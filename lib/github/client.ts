import { Octokit } from '@octokit/rest';
import { supabase } from '@/lib/supabase/client';

export class GitHubClient {
    private octokit: Octokit;
    private username: string;
    private userId: string;

    constructor(accessToken: string, username: string, userId: string) {
        this.octokit = new Octokit({ auth: accessToken });
        this.username = username;
        this.userId = userId;
    }

    // Cache management
    private async getCached(key: string) {
        const { data } = await supabase
            .from('github_cache')
            .select('cache_data, expires_at')
            .eq('user_id', this.userId)
            .eq('cache_key', key)
            .single();

        if (!data) return null;

        const now = new Date();
        const expires = new Date(data.expires_at!);

        if (now > expires) {
            await this.clearCache(key);
            return null;
        }

        return data.cache_data;
    }

    private async setCache(key: string, data: any, ttlHours: number = 24) {
        const expires = new Date();
        expires.setHours(expires.getHours() + ttlHours);

        await supabase
            .from('github_cache')
            .upsert({
                user_id: this.userId,
                cache_key: key,
                cache_data: data,
                expires_at: expires.toISOString()
            });
    }

    private async clearCache(key: string) {
        await supabase
            .from('github_cache')
            .delete()
            .eq('user_id', this.userId)
            .eq('cache_key', key);
    }

    // Fetch user data
    async fetchUserData() {
        const cached = await this.getCached('user_data');
        if (cached) return cached;

        const { data } = await this.octokit.users.getByUsername({
            username: this.username
        });

        await this.setCache('user_data', data, 24);
        return data;
    }

    // Fetch repositories with intelligent batching
    async fetchRepositories(options: {
        limit?: number;
        minStars?: number;
        excludeForked?: boolean;
    } = {}) {
        const {
            limit = 100,
            minStars = 0,
            excludeForked = true
        } = options;

        const cached = await this.getCached('repositories');
        if (cached) return this.filterRepos(cached, options);

        const repos = await this.octokit.paginate(
            this.octokit.repos.listForUser,
            {
                username: this.username,
                type: 'owner',
                sort: 'updated',
                per_page: 100
            }
        );

        await this.setCache('repositories', repos, 12); // 12 hour cache
        return this.filterRepos(repos, options);
    }

    private filterRepos(repos: any[], options: any) {
        let filtered = repos;

        if (options.excludeForked) {
            filtered = filtered.filter(r => !r.fork);
        }

        if (options.minStars > 0) {
            filtered = filtered.filter(r => r.stargazers_count >= options.minStars);
        }

        if (options.limit) {
            filtered = filtered.slice(0, options.limit);
        }

        return filtered;
    }

    // Fetch repository details with README
    async fetchRepoDetails(repoName: string) {
        const cacheKey = `repo_${repoName}`;
        const cached = await this.getCached(cacheKey);
        if (cached) return cached;

        const [repo, readme, languages, commits] = await Promise.allSettled([
            this.octokit.repos.get({
                owner: this.username,
                repo: repoName
            }),
            this.fetchReadme(repoName),
            this.octokit.repos.listLanguages({
                owner: this.username,
                repo: repoName
            }),
            this.octokit.repos.listCommits({
                owner: this.username,
                repo: repoName,
                per_page: 1
            })
        ]);

        const details = {
            repo: repo.status === 'fulfilled' ? repo.value.data : null,
            readme: readme.status === 'fulfilled' ? readme.value : null,
            languages: languages.status === 'fulfilled' ? languages.value.data : {},
            commitCount: commits.status === 'fulfilled'
                ? parseInt(commits.value.headers.link?.match(/page=(\d+)>; rel="last"/)?.[1] || '1')
                : 0
        };

        await this.setCache(cacheKey, details, 24);
        return details;
    }

    // Fetch README
    private async fetchReadme(repoName: string) {
        try {
            const { data } = await this.octokit.repos.getReadme({
                owner: this.username,
                repo: repoName
            });

            const content = Buffer.from(data.content, 'base64').toString('utf-8');
            return content;
        } catch {
            return null;
        }
    }

    // GraphQL query for efficient data fetching
    async fetchMultipleReposGraphQL(repoNames: string[]) {
        const query = `
      query ($owner: String!) {
        user(login: $owner) {
          ${repoNames.map((name, i) => `
            repo${i}: repository(name: "${name}") {
              name
              description
              stargazerCount
              forkCount
              primaryLanguage {
                name
              }
              languages(first: 10) {
                edges {
                  node {
                    name
                  }
                  size
                }
              }
              defaultBranchRef {
                target {
                  ... on Commit {
                    history {
                      totalCount
                    }
                  }
                }
              }
              object(expression: "HEAD:README.md") {
                ... on Blob {
                  text
                }
              }
            }
          `).join('\n')}
        }
      }
    `;

        const result = await this.octokit.graphql(query, {
            owner: this.username
        });

        return result;
    }

    // Fetch key files from repository
    async fetchKeyFiles(repoName: string) {
        try {
            const { data: tree } = await this.octokit.git.getTree({
                owner: this.username,
                repo: repoName,
                tree_sha: 'HEAD',
                recursive: '1'
            });

            // Identify important files
            const keyFiles = tree.tree.filter(file => {
                const path = file.path || '';
                return (
                    path.includes('src/') ||
                    path.includes('lib/') ||
                    path === 'package.json' ||
                    path === 'requirements.txt' ||
                    path.endsWith('.config.js') ||
                    path.endsWith('.config.ts')
                );
            }).slice(0, 10);

            // Fetch content for key files
            const filesWithContent = await Promise.all(
                keyFiles.map(async (file) => {
                    if (file.type === 'blob' && file.sha) {
                        try {
                            const { data } = await this.octokit.git.getBlob({
                                owner: this.username,
                                repo: repoName,
                                file_sha: file.sha
                            });

                            return {
                                path: file.path,
                                content: Buffer.from(data.content, 'base64').toString('utf-8')
                            };
                        } catch {
                            return null;
                        }
                    }
                    return null;
                })
            );

            return filesWithContent.filter(Boolean);
        } catch {
            return [];
        }
    }

    // Analyze contribution patterns
    async analyzeContributionPatterns() {
        const cacheKey = 'contribution_patterns';
        const cached = await this.getCached(cacheKey);
        if (cached) return cached;

        const repos = await this.fetchRepositories();

        const patterns = {
            totalRepos: repos.length,
            totalStars: repos.reduce((sum: number, r: any) => sum + r.stargazers_count, 0),
            totalForks: repos.reduce((sum: number, r: any) => sum + r.forks_count, 0),
            languages: this.aggregateLanguages(repos),
            mostActiveYear: this.getMostActiveYear(repos),
            consistencyScore: this.calculateConsistency(repos)
        };

        await this.setCache(cacheKey, patterns, 24);
        return patterns;
    }

    private aggregateLanguages(repos: any[]) {
        const langMap: Record<string, number> = {};

        repos.forEach(repo => {
            if (repo.language) {
                langMap[repo.language] = (langMap[repo.language] || 0) + 1;
            }
        });

        return Object.entries(langMap)
            .sort(([, a], [, b]) => b - a)
            .map(([name, count]) => ({ name, count }));
    }

    private getMostActiveYear(repos: any[]) {
        const years: Record<string, number> = {};

        repos.forEach(repo => {
            const year = new Date(repo.created_at).getFullYear().toString();
            years[year] = (years[year] || 0) + 1;
        });

        return Object.entries(years).sort(([, a], [, b]) => b - a)[0];
    }

    private calculateConsistency(repos: any[]) {
        // Simple consistency score based on update frequency
        const now = new Date();
        const recentUpdates = repos.filter(repo => {
            const updated = new Date(repo.updated_at);
            const monthsAgo = (now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24 * 30);
            return monthsAgo <= 6;
        });

        return Math.round((recentUpdates.length / repos.length) * 10) / 10;
    }
}

// Helper function to create client
export function createGitHubClient(accessToken: string, username: string, userId: string) {
    return new GitHubClient(accessToken, username, userId);
}

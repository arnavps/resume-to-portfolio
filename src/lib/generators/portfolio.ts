import { supabase as typedSupabase } from '@/lib/supabase/client';
const supabase: any = typedSupabase;
import { createGitHubClient } from '@/lib/github/client';
import {
    generateProjectNarrative,
    generateCareerNarrative,
    analyzeCodeQuality,
    optimizeForATS,
    generateCoachingSuggestions
} from '@/lib/ai/gemini';

interface GenerationOptions {
    includePrivateRepos?: boolean;
    minStars?: number;
    maxProjects?: number;
    targetRole?: string;
    regenerate?: boolean;
}

export class PortfolioGenerator {
    private userId: string;
    private portfolioId: string;

    constructor(userId: string, portfolioId: string) {
        this.userId = userId;
        this.portfolioId = portfolioId;
    }

    // Main generation orchestrator
    async generateComplete(options: GenerationOptions = {}) {
        const {
            minStars = 0,
            maxProjects = 10,
            targetRole = 'Software Engineer',
            regenerate = false
        } = options;

        // Create generation job
        const { data: job } = await supabase
            .from('generation_jobs')
            .insert({
                portfolio_id: this.portfolioId,
                job_type: 'full',
                status: 'processing',
                stages: [
                    { name: 'Fetching Data Sources', progress: 0 },
                    { name: 'Analyzing GitHub', progress: 0 },
                    { name: 'Processing Resume', progress: 0 },
                    { name: 'Generating Project Narratives', progress: 0 },
                    { name: 'Creating About Section', progress: 0 },
                    { name: 'Analyzing Code Quality', progress: 0 },
                    { name: 'ATS Optimization', progress: 0 },
                    { name: 'Generating Coaching', progress: 0 }
                ]
            })
            .select()
            .single();

        try {
            // Stage 1: Fetch data sources
            await this.updateJobProgress(job!.id, 'Fetching Data Sources', 10);
            const dataSources = await this.fetchDataSources();

            // Stage 2: Analyze GitHub
            await this.updateJobProgress(job!.id, 'Analyzing GitHub', 20);
            const githubData = await this.processGitHub(dataSources.github, {
                minStars,
                maxProjects
            });

            // Stage 3: Process Resume
            await this.updateJobProgress(job!.id, 'Processing Resume', 30);
            const resumeData = await this.processResume(dataSources.resume);

            // Stage 4: Process LinkedIn (if available)
            const linkedinData = dataSources.linkedin
                ? await this.processLinkedIn(dataSources.linkedin)
                : null;

            // Merge experience data
            const experiences = this.mergeExperiences(
                resumeData?.experiences || [],
                linkedinData?.experiences || []
            );

            // Stage 5: Generate project narratives (parallel)
            await this.updateJobProgress(job!.id, 'Generating Project Narratives', 40);
            const projects = await this.generateProjectNarratives(
                githubData.repositories,
                resumeData?.projects || []
            );

            // Stage 6: Create about section
            await this.updateJobProgress(job!.id, 'Creating About Section', 60);
            const aboutContent = await generateCareerNarrative({
                experiences,
                projects: projects.slice(0, 5),
                skills: this.extractSkills(githubData, resumeData),
                education: resumeData?.education || []
            });

            // Stage 7: Analyze code quality
            await this.updateJobProgress(job!.id, 'Analyzing Code Quality', 75);
            const codeQualityScores = await this.analyzeCodeQualityForProjects(
                githubData.repositories.slice(0, 5)
            );

            // Stage 8: Save everything to database
            await this.savePortfolioData({
                projects,
                experiences,
                skills: this.extractSkills(githubData, resumeData),
                education: resumeData?.education || [],
                certifications: linkedinData?.certifications || resumeData?.certifications || [],
                aboutContent,
                codeQualityScores
            });

            // Stage 9: ATS Optimization
            await this.updateJobProgress(job!.id, 'ATS Optimization', 85);
            const atsScore = await this.performATSOptimization(targetRole);

            // Stage 10: Generate coaching suggestions
            await this.updateJobProgress(job!.id, 'Generating Coaching', 95);
            const coaching = await this.generateCoaching();

            // Complete job
            await this.updateJobProgress(job!.id, 'Complete', 100, 'completed');

            return {
                success: true,
                portfolioId: this.portfolioId,
                stats: {
                    projectsGenerated: projects.length,
                    experiencesAdded: experiences.length,
                    skillsIdentified: this.extractSkills(githubData, resumeData).length,
                    atsScore: atsScore.overall_score,
                    avgConfidence: this.calculateAvgConfidence(projects)
                }
            };

        } catch (error: any) {
            await supabase
                .from('generation_jobs')
                .update({
                    status: 'failed',
                    error_message: error.message,
                    completed_at: new Date().toISOString()
                })
                .eq('id', job!.id);

            throw error;
        }
    }

    // Helper methods
    private async fetchDataSources() {
        const { data } = await supabase
            .from('data_sources')
            .select('*')
            .eq('user_id', this.userId);

        return {
            github: data?.find((d: any) => d.source_type === 'github'),
            resume: data?.find((d: any) => d.source_type === 'resume'),
            linkedin: data?.find((d: any) => d.source_type === 'linkedin')
        };
    }

    private async processGitHub(source: any, options: any) {
        if (!source) throw new Error('GitHub not connected');

        // Get access token from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.provider_token;

        const client = createGitHubClient(
            accessToken!,
            source.source_identifier,
            this.userId
        );

        const [repos, patterns] = await Promise.all([
            client.fetchRepositories({
                limit: options.maxProjects,
                minStars: options.minStars,
                excludeForked: true
            }),
            client.analyzeContributionPatterns()
        ]);

        // Fetch detailed data for top repos
        const detailedRepos = await Promise.all(
            repos.slice(0, options.maxProjects).map(async (repo: any) => {
                const details = await client.fetchRepoDetails(repo.name);
                const keyFiles = await client.fetchKeyFiles(repo.name);

                return {
                    ...repo,
                    ...details,
                    keyFiles
                };
            })
        );

        return {
            repositories: detailedRepos,
            patterns
        };
    }

    private async processResume(source: any) {
        if (!source) return null;
        return source.source_data;
    }

    private async processLinkedIn(source: any) {
        if (!source) return null;
        return source.source_data;
    }

    private mergeExperiences(resumeExp: any[], linkedinExp: any[]) {
        const merged = [...linkedinExp];

        resumeExp.forEach(rExp => {
            const existing = merged.find(m =>
                m.company.toLowerCase() === rExp.company.toLowerCase() &&
                m.role.toLowerCase() === rExp.role.toLowerCase()
            );

            if (existing && rExp.description) {
                existing.user_edited_description = rExp.description;
            } else if (!existing) {
                merged.push(rExp);
            }
        });

        return merged;
    }

    private async generateProjectNarratives(repos: any[], manualProjects: any[]) {
        const githubProjects = await Promise.all(
            repos.map(async (repo: any) => {
                try {
                    const narrative = await generateProjectNarrative({
                        name: repo.name,
                        description: repo.description,
                        readme: repo.readme,
                        languages: repo.languages,
                        stargazers_count: repo.stargazers_count,
                        forks_count: repo.forks_count,
                        topics: repo.topics,
                        keyFiles: repo.keyFiles
                    });

                    return {
                        source: 'github',
                        source_id: repo.id.toString(),
                        title: repo.name,
                        slug: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                        short_description: narrative.short_description,
                        long_description: narrative.long_description,
                        ai_narrative: narrative.long_description,
                        technologies: narrative.skills_demonstrated,
                        repo_url: repo.html_url,
                        demo_url: repo.homepage,
                        metrics: {
                            stars: repo.stargazers_count,
                            forks: repo.forks_count,
                            commits: repo.commitCount
                        },
                        is_featured: repo.stargazers_count > 5,
                        ai_confidence_score: narrative.confidence_score
                    };
                } catch (error) {
                    console.error(`Failed to generate narrative for ${repo.name}:`, error);
                    return null;
                }
            })
        );

        return [...githubProjects.filter(Boolean), ...manualProjects];
    }

    private extractSkills(githubData: any, resumeData: any) {
        const skills = new Map();

        // From GitHub languages
        githubData.patterns.languages?.forEach(({ name, count }: any) => {
            skills.set(name, {
                skill_name: name,
                category: 'language',
                proficiency_level: Math.min(5, Math.ceil(count / 2)),
                derived_from: ['github']
            });
        });

        // From resume
        resumeData?.skills?.forEach((skill: string) => {
            if (skills.has(skill)) {
                skills.get(skill).derived_from.push('resume');
            } else {
                skills.set(skill, {
                    skill_name: skill,
                    category: 'tool',
                    proficiency_level: 3,
                    derived_from: ['resume']
                });
            }
        });

        return Array.from(skills.values());
    }

    private async analyzeCodeQualityForProjects(repos: any[]) {
        const analyses = await Promise.all(
            repos.map(async (repo: any) => {
                try {
                    const analysis = await analyzeCodeQuality(
                        repo.keyFiles || [],
                        Object.keys(repo.languages || {})
                    );

                    return {
                        repoName: repo.name,
                        ...analysis
                    };
                } catch {
                    return null;
                }
            })
        );

        return analyses.filter(Boolean);
    }

    private async savePortfolioData(data: any) {
        // Save projects
        if (data.projects.length > 0) {
            const { error: projectsError } = await supabase
                .from('projects')
                .upsert(
                    data.projects.map((p: any, i: number) => ({
                        ...p,
                        portfolio_id: this.portfolioId,
                        display_order: i
                    })),
                    { onConflict: 'portfolio_id,source,source_id' }
                );

            if (projectsError) throw projectsError;
        }

        // Save experiences
        if (data.experiences.length > 0) {
            const { error: expError } = await supabase
                .from('experiences')
                .upsert(
                    data.experiences.map((e: any, i: number) => ({
                        ...e,
                        portfolio_id: this.portfolioId,
                        display_order: i
                    }))
                );

            if (expError) throw expError;
        }

        // Save skills
        if (data.skills.length > 0) {
            const { error: skillsError } = await supabase
                .from('skills')
                .upsert(
                    data.skills.map((s: any, i: number) => ({
                        ...s,
                        portfolio_id: this.portfolioId,
                        display_order: i
                    }))
                );

            if (skillsError) throw skillsError;
        }

        // Save education
        if (data.education.length > 0) {
            const { error: eduError } = await supabase
                .from('education')
                .upsert(
                    data.education.map((e: any, i: number) => ({
                        ...e,
                        portfolio_id: this.portfolioId,
                        display_order: i
                    }))
                );

            if (eduError) throw eduError;
        }

        // Save about content
        const { error: contentError } = await supabase
            .from('portfolio_content')
            .upsert({
                portfolio_id: this.portfolioId,
                section_type: 'about',
                content: data.aboutContent.about_me,
                ai_generated_content: data.aboutContent.about_me,
                metadata: {
                    hero_tagline: data.aboutContent.hero_tagline,
                    meta_description: data.aboutContent.meta_description,
                    confidence_score: data.aboutContent.confidence_score
                }
            });

        if (contentError) throw contentError;

        // Update portfolio
        await supabase
            .from('portfolios')
            .update({
                last_synced_at: new Date().toISOString(),
                seo_title: `${data.aboutContent.hero_tagline}`,
                seo_description: data.aboutContent.meta_description
            })
            .eq('id', this.portfolioId);
    }

    private async performATSOptimization(targetRole: string) {
        const { data: portfolio } = await supabase
            .from('portfolios')
            .select(`
        *,
        projects(*),
        experiences(*),
        skills(*),
        portfolio_content(*)
      `)
            .eq('id', this.portfolioId)
            .single();

        const contentToAnalyze = JSON.stringify({
            about: portfolio!.portfolio_content.find((c: any) => c.section_type === 'about')?.content,
            projects: portfolio!.projects.map((p: any) => ({
                title: p.title,
                description: p.ai_narrative || p.long_description
            })),
            experiences: portfolio!.experiences.map((e: any) => ({
                role: e.role,
                company: e.company,
                description: e.ai_enhanced_description || e.description
            })),
            skills: portfolio!.skills.map((s: any) => s.skill_name)
        });

        const atsAnalysis = await optimizeForATS(contentToAnalyze, targetRole);

        await supabase
            .from('ats_scores')
            .insert({
                portfolio_id: this.portfolioId,
                overall_score: atsAnalysis.overall_score,
                keyword_score: atsAnalysis.keyword_score,
                formatting_score: atsAnalysis.formatting_score,
                content_score: atsAnalysis.content_score,
                missing_keywords: atsAnalysis.missing_keywords,
                suggestions: atsAnalysis.suggestions,
                target_role: targetRole,
                analysis_data: atsAnalysis
            });

        return atsAnalysis;
    }

    private async generateCoaching() {
        const { data: portfolio } = await supabase
            .from('portfolios')
            .select(`
        *,
        projects(*),
        experiences(*),
        skills(*),
        ats_scores(*)
      `)
            .eq('id', this.portfolioId)
            .single();

        const coaching = await generateCoachingSuggestions(portfolio);

        await supabase
            .from('coaching_sessions')
            .insert({
                portfolio_id: this.portfolioId,
                session_type: 'improvement',
                recommendations: coaching.priority_actions,
                action_items: coaching.priority_actions,
                priority_score: Math.round(coaching.content_score * 10)
            });

        return coaching;
    }

    private async updateJobProgress(
        jobId: string,
        stage: string,
        progress: number,
        status: string = 'processing'
    ) {
        await supabase
            .from('generation_jobs')
            .update({
                current_stage: stage,
                progress,
                status,
                ...(status === 'completed' && { completed_at: new Date().toISOString() })
            })
            .eq('id', jobId);
    }

    private calculateAvgConfidence(projects: any[]) {
        const scores = projects
            .map(p => p.ai_confidence_score)
            .filter(Boolean);

        if (scores.length === 0) return 0;
        return scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
    }
}

// Export main function
export async function generatePortfolio(
    userId: string,
    portfolioId: string,
    options?: GenerationOptions
) {
    const generator = new PortfolioGenerator(userId, portfolioId);
    return await generator.generateComplete(options);
}

'use server';

import { createServiceClient } from '@/lib/supabase/service';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    const payload = await verifyJWT(token);
    return payload?.sub as string | undefined;
}

export async function syncGithubRepositories() {
    const userId = await getUserId();
    if (!userId) return { error: 'Not authenticated' };

    const supabase = createServiceClient();

    // 1. Get User Info (GitHub Username)
    const { data: rawUser } = await supabase.from('users').select('github_username').eq('id', userId).single();
    const user = rawUser as any;

    if (!user || !user.github_username) {
        return { error: 'No GitHub username linked' };
    }

    // 2. Get Portfolio ID
    let { data: rawPortfolio } = await supabase.from('portfolios').select('id').eq('user_id', userId).single();
    let portfolio = rawPortfolio as any;

    if (!portfolio) {
        // Create default portfolio if missing
        // Verify we have a valid subdomain source
        let subdomain = user.github_username;
        if (!subdomain) {
            // Fallback to part of email or random string
            const { data: rawUserEmail } = await supabase.from('users').select('email').eq('id', userId).single();
            const userEmail = rawUserEmail as any;

            if (userEmail && userEmail.email) {
                subdomain = userEmail.email.split('@')[0];
            } else {
                subdomain = `user-${userId.slice(0, 8)}`;
            }
        }

        // Sanitize subdomain
        subdomain = subdomain.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();

        const { data: newPortfolio, error: createError } = await supabase.from('portfolios').insert({
            user_id: userId,
            subdomain: subdomain,
            template_id: 'modern',
            updated_at: new Date().toISOString()
        } as any).select().single();

        if (createError) {
            console.error('Failed to create portfolio during sync:', createError);
            // Check if it's a unique constraint error on subdomain
            if (createError.code === '23505') { // Unique violation
                // Try one more time with random suffix
                const retrySubdomain = `${subdomain}-${Math.floor(Math.random() * 1000)}`;
                const { data: retryPortfolio, error: retryError } = await supabase.from('portfolios').insert({
                    user_id: userId,
                    subdomain: retrySubdomain,
                    template_id: 'modern',
                    updated_at: new Date().toISOString()
                } as any).select().single();

                if (retryError) {
                    return { error: `Failed to create portfolio context: ${retryError.message}` };
                }
                portfolio = retryPortfolio;
            } else {
                return { error: `Failed to create portfolio context: ${createError.message} (Code: ${createError.code})` };
            }
        } else {
            portfolio = newPortfolio;
        }
    }

    try {
        // 3. Fetch Repos from GitHub
        // Use a personal access token if available in env for higher rate limits, otherwise public
        // Ideally we should use the user's access token if we stored it, but we didn't store it in callbacks.
        // For public repos, unauthenticated is fine but rate limited.
        // Since we are running on server, we can use our GITHUB_CLIENT_ID/SECRET for higher limits if we implement app auth, 
        // but for now let's try simple fetch.

        const token = process.env.GITHUB_ACCESS_TOKEN;
        const headers: any = {
            'Accept': 'application/vnd.github.v3+json'
        };
        if (token) {
            headers['Authorization'] = `token ${token}`;
        }

        const res = await fetch(`https://api.github.com/users/${user.github_username}/repos?sort=updated&per_page=10&type=owner`, {
            headers
        });
        if (!res.ok) {
            throw new Error(`GitHub API error: ${res.statusText}`);
        }

        const repos = await res.json();

        // 4. Upsert Projects
        let count = 0;
        for (const repo of repos) {
            // Skip forks if we want? Maybe keep them for now.

            const projectData = {
                portfolio_id: portfolio.id,
                title: repo.name,
                slug: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${repo.id}`, // Ensure unique slug with ID
                short_description: repo.description,
                repo_url: repo.html_url, // Correct field name
                demo_url: repo.homepage || null, // Correct field name
                technologies: [repo.language].filter(Boolean), // Store as JSON array
                source: 'github',
                source_id: repo.id.toString(),
                is_visible: true, // Default to visible
                updated_at: new Date().toISOString(),
                display_order: count // Simple ordering
            };

            // Check if exists by source_id to update or insert
            const { data: rawExisting } = await supabase
                .from('projects')
                .select('id')
                .eq('portfolio_id', portfolio.id)
                .eq('source_id', repo.id.toString())
                .single();

            const existing = rawExisting as any;

            if (existing) {
                await (supabase.from('projects') as any).update(projectData).eq('id', existing.id);
            } else {
                await (supabase.from('projects') as any).insert(projectData);
            }
            count++;
        }

        return { success: true, count };

    } catch (error: any) {
        console.error('Sync GitHub Error:', error);
        return { error: error.message };
    }
}

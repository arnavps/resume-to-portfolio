import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/types/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        const supabase = (await createClient()) as SupabaseClient<Database>;

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json({ error: 'Authorization code required' }, { status: 400 });
        }

        // Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            })
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            return NextResponse.json({ error: tokenData.error_description }, { status: 400 });
        }

        // Get GitHub user info
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            }
        });

        const githubUser = await userResponse.json();

        // Save to data_sources
        const { data, error } = await supabase
            .from('data_sources')
            .upsert({
                user_id: user.id,
                source_type: 'github',
                source_identifier: githubUser.login,
                source_data: {
                    username: githubUser.login,
                    name: githubUser.name,
                    avatar_url: githubUser.avatar_url,
                    bio: githubUser.bio,
                    public_repos: githubUser.public_repos
                },
                raw_data: githubUser,
                last_synced_at: new Date().toISOString(),
                sync_status: 'completed'
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Update user profile
        await supabase
            .from('users')
            .update({
                github_username: githubUser.login,
                avatar_url: githubUser.avatar_url
            })
            .eq('id', user.id);

        return NextResponse.json({
            success: true,
            username: githubUser.login,
            message: 'GitHub connected successfully'
        });
    } catch (error: any) {
        console.error('Error connecting GitHub:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to connect GitHub' },
            { status: 500 }
        );
    }
}

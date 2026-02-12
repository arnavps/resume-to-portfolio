import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { signJWT } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');
    const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

    if (!code || !GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
        return NextResponse.json({ error: 'Missing code or credentials' }, { status: 400 });
    }

    try {
        // 1. Exchange code for access token
        const tokenParams = new URLSearchParams({
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code,


            redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || process.env.RENDER_EXTERNAL_URL || 'https://resume-to-portfolio-7zdz.onrender.com'}/api/auth/github/callback`,
        });

        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded', // GitHub expects this for token exchange usually
            },
            body: tokenParams,
        });

        const tokenData = await tokenRes.json();

        if (tokenData.error || !tokenData.access_token) {
            throw new Error(tokenData.error_description || 'Failed to get access token');
        }

        const accessToken = tokenData.access_token;

        // 2. Fetch User Profile
        const userRes = await fetch('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const githubUser = await userRes.json();

        // 3. Fetch User Email (if private)
        let email = githubUser.email;
        if (!email) {
            const emailRes = await fetch('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const emails = await emailRes.json();
            const primaryEmail = emails.find((e: any) => e.primary && e.verified);
            email = primaryEmail ? primaryEmail.email : null;
        }

        if (!email) {
            return NextResponse.json({ error: 'No verified email found on GitHub account' }, { status: 400 });
        }

        // 4. Upsert User in Database
        const supabase = createServiceClient();

        // Check if user exists
        const { data: existingUser } = await supabase.from('users').select('*').eq('email', email).single();

        let userId = (existingUser as any)?.id;

        if (!existingUser) {
            // Create new user
            userId = crypto.randomUUID();
            const { error: insertError } = await supabase.from('users').insert({
                id: userId,
                email,
                full_name: githubUser.name || githubUser.login,
                avatar_url: githubUser.avatar_url,
                github_username: githubUser.login,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                subscription_tier: 'free',
                onboarding_completed: false
            } as any);

            if (insertError) throw insertError;
        } else {
            // Update basic info
            await (supabase.from('users') as any).update({
                avatar_url: githubUser.avatar_url,
                github_username: githubUser.login,
                updated_at: new Date().toISOString()
            }).eq('id', userId);
        }

        // 5. Generate and Set Cookie
        const token = await signJWT({ sub: userId, email });
        const origin = process.env.NEXT_PUBLIC_APP_URL || process.env.RENDER_EXTERNAL_URL || 'https://resume-to-portfolio-7zdz.onrender.com';
        const response = NextResponse.redirect(`${origin}/dashboard`);

        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;

    } catch (error: any) {
        console.error('GitHub Auth Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const origin = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const REDIRECT_URI = `${origin}/api/auth/github/callback`;

    if (!GITHUB_CLIENT_ID) {
        return NextResponse.json({ error: 'GitHub Client ID not configured' }, { status: 500 });
    }

    const params = new URLSearchParams({
        client_id: GITHUB_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'read:user user:email',
        allow_signup: 'true',
    });

    const url = `https://github.com/login/oauth/authorize?${params.toString()}`;

    return NextResponse.redirect(url);
}

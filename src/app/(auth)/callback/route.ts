import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/customize';

    // Check for errors returned by Supabase
    const error = searchParams.get('error');
    const error_description = searchParams.get('error_description');

    if (error) {
        return NextResponse.redirect(`${origin}/customize?error=${error}&message=${error_description}`);
    }

    if (code) {
        const supabase = await createClient();
        const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
        if (!sessionError) {
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/customize?error=auth-code-error`);
}

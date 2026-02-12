import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase/service';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    // Optional: Fetch latest user data from DB to ensure they still exist / aren't banned
    const supabase = createServiceClient();
    const { data: user } = await supabase
        .from('users')
        .select('id, email, full_name, avatar_url, subscription_tier')
        .eq('id', payload.sub)
        .single();

    if (!user) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
}

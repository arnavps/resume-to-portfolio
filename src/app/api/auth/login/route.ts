import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, signJWT } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase/service';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input' },
                { status: 400 }
            );
        }

        const { email, password } = result.data;
        const supabase = createServiceClient();

        // Fetch user
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const foundUser = user as any;

        // Verify Password
        // Cast user to any to access password_hash if types aren't updated yet
        const isValid = await comparePassword(password, foundUser.password_hash);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate Token
        const token = await signJWT({ sub: foundUser.id, email: foundUser.email });

        // Set Cookie
        const response = NextResponse.json(
            { success: true, user: { id: foundUser.id, email: foundUser.email, full_name: foundUser.full_name } },
            { status: 200 }
        );

        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

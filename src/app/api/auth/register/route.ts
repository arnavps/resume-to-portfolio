import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, signJWT } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase/service';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().min(1),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: result.error.issues.map(i => i.message) },
                { status: 400 }
            );
        }

        const { email, password, fullName } = result.data;
        const supabase = createServiceClient();

        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user in public.users
        const userId = crypto.randomUUID();
        const { error: insertError } = await supabase.from('users').insert({
            id: userId,
            email,
            full_name: fullName,
            password_hash: passwordHash, // Ensure you ran the SQL migration!
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            subscription_tier: 'free',
            onboarding_completed: false,
        } as any); // Type cast as 'any' because password_hash might not be in types yet

        if (insertError) {
            console.error('Registration Error:', insertError);
            return NextResponse.json(
                { error: 'Failed to create user' },
                { status: 500 }
            );
        }

        // Generate Token
        const token = await signJWT({ sub: userId, email });

        // Set Cookie
        const response = NextResponse.json(
            { success: true, user: { id: userId, email, full_name: fullName } },
            { status: 201 }
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
        console.error('Internal Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

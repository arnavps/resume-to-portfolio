import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseResumePDF } from '@/lib/parsers/resume';

export async function POST(request: NextRequest) {
    try {
        // Authenticate with custom JWT
        const token = request.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { verifyJWT } = await import('@/lib/auth');
        const payload = await verifyJWT(token);

        if (!payload || !payload.sub) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = payload.sub as string;
        const supabase: any = await createClient(); // Still need service client for DB access? createClient is server component client
        // actually for route handlers we should use service client if we want to bypass RLS or just normal client if we had supabase auth
        // But since we are using custom auth, we should use service client to write to DB as "system" but with user_id
        // OR better yet, since we have RLS policies on 'users' table possibly relying on auth.uid(), we might have issues.
        // Wait, our RLS policies rely on auth.uid(). 
        // Our custom JWT does NOT set auth.uid() in Supabase context unless we use setSession.
        // But we are moving away from Supabase Auth.
        // So we should use SERVICE_ROLE client to bypass RLS and manually ensure user_id matches.

        const { createServiceClient } = await import('@/lib/supabase/service');
        const supabaseService = createServiceClient();

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Parse resume
        const resumeData = await parseResumePDF(buffer);

        // Save to data_sources
        const { data, error } = await supabaseService
            .from('data_sources')
            .upsert({
                user_id: userId,
                source_type: 'resume',
                source_identifier: file.name,
                source_data: resumeData,
                raw_data: { filename: file.name, size: file.size },
                last_synced_at: new Date().toISOString(),
                sync_status: 'completed'
            } as any)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: resumeData,
            message: 'Resume uploaded and parsed successfully'
        });
    } catch (error: any) {
        console.error('Error uploading resume:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to upload resume' },
            { status: 500 }
        );
    }
}

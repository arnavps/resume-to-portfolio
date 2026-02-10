import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseResumePDF } from '@/lib/parsers/resume';

export async function POST(request: NextRequest) {
    try {
        const supabase: any = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
        const { data, error } = await supabase
            .from('data_sources')
            .upsert({
                user_id: user.id,
                source_type: 'resume',
                source_identifier: file.name,
                source_data: resumeData,
                raw_data: { filename: file.name, size: file.size },
                last_synced_at: new Date().toISOString(),
                sync_status: 'completed'
            })
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

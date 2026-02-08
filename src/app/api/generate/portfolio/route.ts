import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generatePortfolio } from '@/lib/generators/portfolio';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { portfolioId, options } = body;

        if (!portfolioId) {
            return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 });
        }

        // Verify portfolio ownership
        const { data: portfolio, error: portfolioError } = await supabase
            .from('portfolios')
            .select('id, user_id')
            .eq('id', portfolioId)
            .eq('user_id', user.id)
            .single();

        if (portfolioError || !portfolio) {
            return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
        }

        // Start generation process
        const result = await generatePortfolio(user.id, portfolioId, options);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error generating portfolio:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate portfolio' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const portfolioId = searchParams.get('portfolioId');

        if (!portfolioId) {
            return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 });
        }

        // Get generation job status
        const { data: jobs, error } = await supabase
            .from('generation_jobs')
            .select('*')
            .eq('portfolio_id', portfolioId)
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ job: jobs?.[0] || null });
    } catch (error: any) {
        console.error('Error fetching generation status:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch status' },
            { status: 500 }
        );
    }
}

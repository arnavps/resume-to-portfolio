import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { portfolioData } from '@/lib/data/mockData';
import { hashPassword } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const secret = req.nextUrl.searchParams.get('secret');
    if (secret !== process.env.JWT_SECRET) { // Simple protection using existing secret
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceClient() as any;
    const DEMO_EMAIL = 'demo@folio.ai';

    try {
        // 1. Get or Create Demo User
        let { data: rawUser } = await supabase.from('users').select('id').eq('email', DEMO_EMAIL).single();
        let user = rawUser as { id: string } | null;

        if (!user) {
            const passwordHash = await hashPassword('demo123'); // Default demo password
            const { data: newUser, error: createError } = await supabase.from('users').insert({
                email: DEMO_EMAIL,
                full_name: portfolioData.name,
                password_hash: passwordHash,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            } as any).select().single();

            if (createError) throw createError;
            user = newUser as { id: string };
        }

        if (!user) throw new Error('Failed to get user');

        // 2. Upsert Portfolio
        const { data: rawPortfolio, error: portError } = await supabase
            .from('portfolios')
            .upsert({
                user_id: user.id,
                subdomain: 'demo-user',
                template_id: 'modern-v1',
                color_scheme: { primary: 'indigo', font: 'sans' },
                updated_at: new Date().toISOString()
            } as any, { onConflict: 'user_id' })
            .select()
            .single();

        if (portError) throw portError;
        const portfolio = rawPortfolio as { id: string };

        // 3. Clear existing data
        await supabase.from('projects').delete().eq('portfolio_id', portfolio.id);
        await supabase.from('experiences').delete().eq('portfolio_id', portfolio.id);
        await supabase.from('skills').delete().eq('portfolio_id', portfolio.id);

        // 4. Insert Mock Data
        // Projects
        if (portfolioData.projects) {
            await supabase.from('projects').insert(portfolioData.projects.map((p, i) => ({
                portfolio_id: portfolio.id,
                title: p.title,
                short_description: p.description,
                technologies: JSON.stringify(p.tags),
                demo_url: p.link,
                display_order: i,
                is_visible: true
            })) as any[]);
        }

        // Experience
        if (portfolioData.experience) {
            await supabase.from('experiences').insert(portfolioData.experience.map((e, i) => ({
                portfolio_id: portfolio.id,
                role: e.role,
                company: e.company,
                description: e.description,
                start_date: new Date().toISOString(), // Simplified
                display_order: i,
                is_visible: true
            })) as any[]);
        }

        // Skills
        const skills: any[] = [];
        portfolioData.skills.frontend.forEach((s, i) => skills.push({ portfolio_id: portfolio.id, category: 'Frontend', skill_name: s, display_order: i }));
        portfolioData.skills.backend.forEach((s, i) => skills.push({ portfolio_id: portfolio.id, category: 'Backend', skill_name: s, display_order: i }));
        portfolioData.skills.tools.forEach((s, i) => skills.push({ portfolio_id: portfolio.id, category: 'Tools', skill_name: s, display_order: i }));

        if (skills.length > 0) {
            await supabase.from('skills').insert(skills as any);
        }

        return NextResponse.json({ success: true, message: 'Demo data seeded successfully for demo@folio.ai' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

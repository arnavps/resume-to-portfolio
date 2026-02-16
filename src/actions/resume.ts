'use server';

import { createServiceClient } from '@/lib/supabase/service';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    const payload = await verifyJWT(token);
    return payload?.sub as string | undefined;
}

export async function applyResumeData() {
    const userId = await getUserId();
    if (!userId) return { error: 'Not authenticated' };

    const supabase = createServiceClient();

    // 1. Fetch latest resume upload
    const { data: rawDataSource } = await supabase
        .from('data_sources')
        .select('*')
        .eq('user_id', userId)
        .eq('source_type', 'resume')
        .order('created_at', { ascending: false })
        .limit(1)
        .limit(1)
        .maybeSingle();

    const dataSource = rawDataSource as any;

    if (!dataSource || !dataSource.source_data) {
        return { error: 'No resume data found to apply' };
    }

    const resumeData = dataSource.source_data as any;

    // 2. Get Portfolio ID
    let { data: rawPortfolio } = await supabase.from('portfolios').select('id').eq('user_id', userId).maybeSingle();
    let portfolio = rawPortfolio as any;
    if (!portfolio) {
        // Create default portfolio if missing (lazy creation)
        const { data: newPortfolio, error: createError } = await supabase.from('portfolios').insert({
            user_id: userId,
            subdomain: ((await supabase.from('users').select('email').eq('id', userId).single()).data as any)?.email?.split('@')[0] || userId,
            template_id: 'modern',
            updated_at: new Date().toISOString()
        } as any).select().maybeSingle();

        if (createError) return { error: 'Failed to create portfolio context' };
        portfolio = newPortfolio;
    }

    if (!portfolio) return { error: 'Portfolio context missing' };

    const portfolioId = portfolio.id;
    const results = {
        experiences: 0,
        education: 0,
        skills: 0,
        projects: 0
    };

    try {
        // 3. Apply Experiences
        if (resumeData.experiences && Array.isArray(resumeData.experiences)) {
            for (const exp of resumeData.experiences) {
                await supabase.from('experiences').insert({
                    portfolio_id: portfolioId,
                    company: exp.company,
                    role: exp.role,
                    description: exp.description,
                    start_date: exp.start_date || new Date().toISOString(),
                    end_date: exp.end_date,
                    is_current: exp.is_current,
                    is_visible: true
                } as any);
                results.experiences++;
            }
        }

        // 4. Apply Education
        if (resumeData.education && Array.isArray(resumeData.education)) {
            for (const edu of resumeData.education) {
                await supabase.from('education').insert({
                    portfolio_id: portfolioId,
                    institution: edu.institution,
                    degree: edu.degree,
                    field_of_study: edu.field_of_study,
                    start_date: edu.start_date || null, // Date parsing might be needed if strict date type
                    end_date: edu.end_date || null,
                    description: '', // resume parser might not have this yet
                    is_visible: true
                } as any);
                results.education++;
            }
        }

        // 5. Apply Skills
        if (resumeData.skills && Array.isArray(resumeData.skills)) {
            for (const skill of resumeData.skills) {
                // Check duplicate
                const { data: existing } = await supabase
                    .from('skills')
                    .select('id')
                    .eq('portfolio_id', portfolioId)
                    .ilike('skill_name', skill) // Case insensitive check
                    .maybeSingle();

                if (!existing) {
                    console.log(`Adding skill: ${skill}`);
                    await supabase.from('skills').insert({
                        portfolio_id: portfolioId,
                        skill_name: skill,
                        category: 'Tools', // Changed from 'Other' to 'Tools' so they show up in default templates
                        display_order: 99
                    } as any);
                    results.skills++;
                }
            }
        }

        // 6. Apply Projects (from Resume) - Only if they look substantial?
        if (resumeData.projects && Array.isArray(resumeData.projects)) {
            for (const proj of resumeData.projects) {
                await supabase.from('projects').insert({
                    portfolio_id: portfolioId,
                    title: proj.title,
                    short_description: proj.description,
                    technologies: proj.technologies || [],
                    source: 'resume',
                    is_visible: true,
                    updated_at: new Date().toISOString()
                } as any);
                results.projects++;
            }
        }

        return { success: true, results };

    } catch (error: any) {
        console.error('Apply Resume Data Error:', error);
        return { error: error.message };
    }
}

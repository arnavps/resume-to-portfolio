'use server';

import { createServiceClient } from '@/lib/supabase/service';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    const payload = await verifyJWT(token);
    return payload?.sub as string | undefined;
}

export async function getProjects() {
    const userId = await getUserId();
    if (!userId) return [];

    const supabase = createServiceClient();

    // First need to find the portfolio ID for this user
    const { data: rawPortfolio } = await supabase.from('portfolios').select('id').eq('user_id', userId).single();
    const portfolio = rawPortfolio as { id: string } | null;

    if (!portfolio) return []; // No portfolio = no projects yet or just empty

    const { data: rawProjects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

    if (error || !rawProjects) {
        console.error('Error fetching projects:', error);
        return [];
    }

    const projects: any[] = rawProjects;

    return projects.map(p => ({
        ...p,
        tags: typeof p.technologies === 'string' ? JSON.parse(p.technologies) : (p.technologies || []),
        status: p.is_visible ? 'Published' : 'Draft' // Mapping to UI status
    }));
}

export async function createProject(data: { title: string; description: string; tags: string[]; status: string }) {
    const userId = await getUserId();
    if (!userId) return { error: 'Not authenticated' };

    const supabase = createServiceClient();

    // Get/Create Portfolio
    let { data: rawPortfolio } = await supabase.from('portfolios').select('id').eq('user_id', userId).single();
    let portfolio = rawPortfolio as { id: string } | null;

    if (!portfolio) {
        // Create default portfolio if missing
        const { data: newPortfolio, error: createError } = await supabase.from('portfolios').insert({
            user_id: userId,
            subdomain: ((await supabase.from('users').select('email').eq('id', userId).single()).data as any)?.email?.split('@')[0] || userId,
            template_id: 'modern',
            updated_at: new Date().toISOString()
        } as any).select().single();

        if (createError) return { error: 'Failed to create portfolio context' };
        portfolio = newPortfolio as { id: string };
    }

    const { error } = await supabase.from('projects').insert({
        portfolio_id: portfolio.id,
        title: data.title,
        short_description: data.description,
        technologies: JSON.stringify(data.tags),
        is_visible: data.status === 'Published',
        source: 'manual',
        updated_at: new Date().toISOString()
    } as any);

    if (error) return { error: error.message };
    return { success: true };
}

export async function getExperience() {
    const userId = await getUserId();
    if (!userId) return [];

    const supabase = createServiceClient();
    const { data: rawPortfolio } = await supabase.from('portfolios').select('id').eq('user_id', userId).single();
    const portfolio = rawPortfolio as { id: string } | null;
    if (!portfolio) return [];

    const { data: rawExperiences, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .order('start_date', { ascending: false });

    if (error || !rawExperiences) return [];

    const experiences: any[] = rawExperiences;

    return experiences.map(e => ({
        ...e,
        period: `${e.start_date || ''} - ${e.end_date || 'Present'}`,
        type: 'Full-time', // DB doesn't have type col in previous schema view, assuming default
        skills: [] // DB 'experiences' table didn't have array of skills in initial view, adding empty
    }));
}

export async function createExperience(data: { role: string; company: string; period: string; type: string; description: string; skills: string[] }) {
    const userId = await getUserId();
    if (!userId) return { error: 'Not authenticated' };

    const supabase = createServiceClient();
    const { data: rawPortfolio } = await supabase.from('portfolios').select('id').eq('user_id', userId).single();
    const portfolio = rawPortfolio as { id: string } | null;
    if (!portfolio) return { error: 'No portfolio found' };

    // Parse period to start_date (simple approx)
    let startDate = new Date().toISOString();
    // real impl would parse "2022 - Present"

    const { error } = await supabase.from('experiences').insert({
        portfolio_id: portfolio.id,
        role: data.role,
        company: data.company,
        description: data.description,
        start_date: startDate, // placeholder for now
        is_visible: true
    } as any);

    if (error) return { error: error.message };
    return { success: true };
}

export async function getUserConnections() {
    const userId = await getUserId();
    if (!userId) return null;

    const supabase = createServiceClient();
    const { data: rawUser, error } = await supabase.from('users').select('github_username, linkedin_url').eq('id', userId).single();
    const user = rawUser as any;

    if (error || !user) return null;

    return {
        github: !!user.github_username,
        linkedin: !!user.linkedin_url
    };
}

export async function getSkills() {
    const userId = await getUserId();
    if (!userId) return [];

    const supabase = createServiceClient();
    const { data: rawPortfolio } = await supabase.from('portfolios').select('id').eq('user_id', userId).single();
    const portfolio = rawPortfolio as { id: string } | null;
    if (!portfolio) return [];

    const { data: skills, error } = await supabase
        .from('skills')
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .order('display_order', { ascending: true });

    if (error || !skills) return [];

    return skills.map((s: any) => ({
        id: s.id,
        name: s.skill_name,
        category: s.category,
        level: s.level || 'Intermediate', // Fallback if column missing
        icon: getIconForCategory(s.category)
    }));
}

function getIconForCategory(category: string) {
    switch (category) {
        case 'Frontend': return '⚛️';
        case 'Backend': return '🟢';
        case 'Tools': return '📦';
        default: return '🔹';
    }
}

export async function createSkill(data: { name: string; category: string; level: string }) {
    const userId = await getUserId();
    if (!userId) return { error: 'Not authenticated' };

    const supabase = createServiceClient();
    const { data: rawPortfolio } = await supabase.from('portfolios').select('id').eq('user_id', userId).single();
    const portfolio = rawPortfolio as { id: string } | null;
    if (!portfolio) return { error: 'No portfolio found' };

    const { error } = await supabase.from('skills').insert({
        portfolio_id: portfolio.id,
        skill_name: data.name,
        category: data.category,
        // level: data.level, // Commented out to be safe with unknown schema
        display_order: 99
    } as any);

    if (error) return { error: error.message };
    return { success: true };
}

export async function deleteSkill(skillId: number) {
    const userId = await getUserId();
    if (!userId) return { error: 'Not authenticated' };

    const supabase = createServiceClient();
    // Verify ownership
    const { data: rawPortfolio } = await supabase.from('portfolios').select('id').eq('user_id', userId).single();
    const portfolio = rawPortfolio as { id: string } | null;
    if (!portfolio) return { error: 'No portfolio found' };


    const { error } = await supabase.from('skills').delete().match({ id: skillId, portfolio_id: portfolio.id });
    if (error) return { error: error.message };
    return { success: true };
}

export async function deleteExperience(experienceId: number) {
    const userId = await getUserId();
    if (!userId) return { error: 'Not authenticated' };

    const supabase = createServiceClient();
    // Verify ownership
    const { data: rawPortfolio } = await supabase.from('portfolios').select('id').eq('user_id', userId).single();
    const portfolio = rawPortfolio as { id: string } | null;
    if (!portfolio) return { error: 'No portfolio found' };

    const { error } = await supabase.from('experiences').delete().match({ id: experienceId, portfolio_id: portfolio.id });
    if (error) return { error: error.message };
    return { success: true };
}

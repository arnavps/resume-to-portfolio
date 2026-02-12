import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { PortfolioData } from '@/lib/data/mockData';
import { Database } from '@/lib/types/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

// Templates (Lazy load or import map could be better, but direct import is fine for now)
import { ModernTemplate } from '@/components/templates/ModernTemplate';
import { CreativeTemplate } from '@/components/templates/CreativeTemplate';
import { MinimalTemplate } from '@/components/templates/MinimalTemplate';
// We need to make sure these components are exported from their files
// I will check if they exist, but assuming they do based on previous context.

export default async function PortfolioPage({ params }: { params: Promise<{ subdomain: string }> }) {
    const supabase: any = await createClient();
    const { subdomain } = await params;

    // 1. Fetch Portfolio by Subdomain
    const { data: portfolio, error: portfolioError } = await supabase
        .from('portfolios')
        .select(`
            *,
            users (
                full_name,
                email,
                github_username,
                linkedin_url
            )
        `)
        .eq('subdomain', subdomain)
        .single();

    if (portfolioError || !portfolio) {
        // Fallback for "demo-user" to static mock data if DB missing (optional, but good for "Open Live" default link)
        if (subdomain === 'demo-user') {
            const { portfolioData } = await import('@/lib/data/mockData');
            return <ModernTemplate data={portfolioData} theme="indigo" font="sans" />;
        }
        return notFound();
    }

    const portfolioId = portfolio.id;

    // 2. Fetch Content
    const { data: skills } = await supabase.from('skills').select('*').eq('portfolio_id', portfolioId).order('display_order', { ascending: true });
    const { data: projects } = await supabase.from('projects').select('*').eq('portfolio_id', portfolioId).order('display_order', { ascending: true });
    const { data: experiences } = await supabase.from('experiences').select('*').eq('portfolio_id', portfolioId).order('display_order', { ascending: true });

    // 3. Transform to PortfolioData shape
    const portfolioData: PortfolioData = {
        name: portfolio.users?.full_name || 'Portfolio User',
        email: portfolio.users?.email || '',
        title: 'Developer', // We might want to store this in database 'seo_title' or 'bio'
        bio: portfolio.seo_description || 'Welcome to my portfolio.', // Using seo_description as bio fallback
        location: 'Earth', // Not currently in DB
        socials: {
            github: portfolio.users?.github_username ? `https://github.com/${portfolio.users.github_username}` : '#',
            linkedin: portfolio.users?.linkedin_url || '#',
            email: portfolio.users?.email ? `mailto:${portfolio.users.email}` : '#'
        },
        skills: {
            frontend: skills?.filter((s: any) => s.category === 'Frontend').map((s: any) => s.skill_name) || [],
            backend: skills?.filter((s: any) => s.category === 'Backend').map((s: any) => s.skill_name) || [],
            tools: skills?.filter((s: any) => s.category === 'Tools').map((s: any) => s.skill_name) || []
        },
        projects: projects?.map((p: any) => ({
            id: p.id as any,
            title: p.title,
            description: p.short_description || '',
            tags: typeof p.technologies === 'string' ? JSON.parse(p.technologies) : (p.technologies || []), // It might be JSON object or string array depending on how Supabase returns it.
            link: p.demo_url || '#'
        })) || [],
        experience: experiences?.map((e: any) => ({
            id: e.id as any,
            role: e.role,
            company: e.company,
            period: e.start_date + (e.end_date ? ` - ${e.end_date}` : ' - Present'), // Reconstruct period
            description: e.description || ''
        })) || []
    };

    // 4. Render Template
    // 4. Render Template
    const templates = {
        'modern-v1': ModernTemplate,
        'creative-studio': CreativeTemplate,
        'minimal-mono': MinimalTemplate
    };

    const templateId = portfolio.template_id as keyof typeof templates;
    const TemplateComponent = templates[templateId] || ModernTemplate;

    const theme = (portfolio.color_scheme as any)?.primary || 'indigo';
    const font = (portfolio.color_scheme as any)?.font || 'sans';

    return <TemplateComponent data={portfolioData} theme={theme} font={font} />;
}

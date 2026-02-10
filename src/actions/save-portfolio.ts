'use server';

import { createClient } from '@/lib/supabase/server';
import { PortfolioData } from '@/lib/data/mockData';

export async function savePortfolio(data: PortfolioData, template: string, theme: string, font: string) {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    try {
        // 1. Upsert Portfolio Metadata
        const payload: any = {
            user_id: user.id,
            subdomain: user.email?.split('@')[0] || user.id,
            template_id: template,
            color_scheme: { primary: theme },
            updated_at: new Date().toISOString()
        };

        const { data: portfolio, error: portfolioError } = await supabase
            .from('portfolios')
            .upsert(payload, { onConflict: 'user_id' })
            .select()
            .single();

        if (portfolioError) throw portfolioError;
        if (!portfolio) throw new Error('Failed to create/update portfolio');

        const portfolioId = portfolio.id;

        // 2. Clear existing content (Wipe & Replace strategy for simplicity/consistency)
        await Promise.all([
            supabase.from('skills').delete().eq('portfolio_id', portfolioId),
            supabase.from('projects').delete().eq('portfolio_id', portfolioId),
            supabase.from('experiences').delete().eq('portfolio_id', portfolioId)
        ]);

        // 3. Insert Skills
        if (data.skills) {
            const skillInserts: any[] = [];

            // Helper to process skills
            const processSkills = (skills: string[], category: string) => {
                skills.forEach((skill, index) => {
                    skillInserts.push({
                        portfolio_id: portfolioId,
                        skill_name: skill,
                        category: category,
                        display_order: index,
                        is_visible: true
                    });
                });
            };

            if (data.skills.frontend) processSkills(data.skills.frontend, 'Frontend');
            if (data.skills.backend) processSkills(data.skills.backend, 'Backend');
            if (data.skills.tools) processSkills(data.skills.tools, 'Tools');

            if (skillInserts.length > 0) {
                const { error: skillsError } = await supabase.from('skills').insert(skillInserts);
                if (skillsError) console.error('Error saving skills:', skillsError);
            }
        }

        // 4. Insert Projects
        if (data.projects && data.projects.length > 0) {
            const projectInserts = data.projects.map((project, index) => ({
                portfolio_id: portfolioId,
                title: project.title,
                slug: project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${Date.now()}`, // Ensure unique slug
                short_description: project.description,
                source: 'manual',
                technologies: JSON.stringify(project.tags), // Storing tags as JSON
                demo_url: project.link,
                display_order: index,
                is_visible: true
            }));

            const { error: projectsError } = await supabase.from('projects').insert(projectInserts);
            if (projectsError) console.error('Error saving projects:', projectsError);
        }

        // 5. Insert Experience
        if (data.experience && data.experience.length > 0) {
            const experienceInserts = data.experience.map((job, index) => {
                // Try to parse start date from "YYYY - ..." or "Month YYYY"
                // Simple fallback to current date if parsing fails, to satisfy DB constraint
                let startDate = new Date().toISOString().split('T')[0];
                try {
                    const yearStr = job.period.split('-')[0].trim();
                    const year = parseInt(yearStr.match(/\d{4}/)?.[0] || '');
                    if (year && !isNaN(year)) {
                        startDate = `${year}-01-01`;
                    }
                } catch (e) {
                    // ignore parse error
                }

                return {
                    portfolio_id: portfolioId,
                    company: job.company,
                    role: job.role,
                    description: job.description,
                    start_date: startDate,
                    display_order: index,
                    is_visible: true
                };
            });

            const { error: expError } = await supabase.from('experiences').insert(experienceInserts);
            if (expError) {
                console.error('Error saving experience:', expError);
                throw new Error(`Experience save failed: ${expError.message}`);
            }
        }

        return { success: true, message: 'Portfolio saved successfully' };
    } catch (error: any) {
        console.error('Save error full object:', JSON.stringify(error, null, 2));
        return { error: error.message || 'Failed to save portfolio' };
    }
}

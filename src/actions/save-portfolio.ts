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
        // 1. Update or Insert Portfolio
        // For simplicity, we assume one portfolio per user for now
        const payload: any = {
            user_id: user.id,
            // Ensure required fields are present for Insert
            subdomain: user.email?.split('@')[0] || user.id, // Fallback subdomain
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

        return { success: true, message: 'Portfolio saved successfully' };
    } catch (error) {
        console.error('Save error:', error);
        return { error: 'Failed to save portfolio' };
    }
}

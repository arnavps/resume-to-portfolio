'use server';

import { createServiceClient } from '@/lib/supabase/service';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    const payload = await verifyJWT(token);
    return payload?.sub as string | undefined;
}

export async function getSettings() {
    const userId = await getUserId();
    if (!userId) return null;

    const supabase = createServiceClient();

    // Fetch user
    const { data: rawUser, error: userError } = await supabase
        .from('users')
        .select('email, full_name, github_username, linkedin_url')
        .eq('id', userId)
        .single();

    if (userError || !rawUser) return null;
    const user = rawUser as any;

    // Fetch portfolio
    const { data: rawPortfolio, error: portfolioError } = await supabase
        .from('portfolios')
        .select('subdomain, custom_domain, seo_title, seo_description')
        .eq('user_id', userId)
        .single();

    if (portfolioError || !rawPortfolio) return null;
    const portfolio = rawPortfolio as any;

    return {
        user: {
            email: user.email,
            fullName: user.full_name || '',
            jobTitle: (portfolio as any).seo_title?.split('|')[1]?.trim() || '', // Hacky extract from seo_title
            bio: (portfolio as any).seo_description || '',
            socials: {
                github: user.github_username || '',
                linkedin: user.linkedin_url || '',
                twitter: '',
                email: user.email
            }
        },
        portfolio: {
            subdomain: portfolio.subdomain,
            customDomain: portfolio.custom_domain || '',
            seoTitle: portfolio.seo_title || '',
            seoDescription: portfolio.seo_description || ''
        }
    };
}

export async function updateProfile(data: any) {
    const userId = await getUserId();
    if (!userId) return { error: 'Not authenticated' };

    const supabase = createServiceClient();

    // Update user table
    const { error: userError } = await (supabase
        .from('users') as any)
        .update({
            full_name: data.fullName,
            github_username: data.socials.github,
            linkedin_url: data.socials.linkedin
        })
        .eq('id', userId);

    if (userError) return { error: userError.message };

    // Update portfolio (bio and title stored in SEO fields for now as they map well)
    const { error: portfolioError } = await (supabase
        .from('portfolios') as any)
        .update({
            seo_description: data.bio,
            // We preserve the structure "Name | Title" if title is updated
            seo_title: `${data.fullName} | ${data.jobTitle}`
        })
        .eq('user_id', userId);

    if (portfolioError) return { error: portfolioError.message };

    revalidatePath('/settings');
    return { success: true };
}

export async function updatePortfolioSettings(data: any) {
    const userId = await getUserId();
    if (!userId) return { error: 'Not authenticated' };

    const supabase = createServiceClient();

    const { error } = await (supabase
        .from('portfolios') as any)
        .update({
            subdomain: data.subdomain,
            custom_domain: data.customDomain,
            seo_title: data.seoTitle,
            seo_description: data.seoDescription
        })
        .eq('user_id', userId);

    if (error) return { error: error.message };

    revalidatePath('/settings');
    return { success: true };
}

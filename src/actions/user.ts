'use server';

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/types/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

export async function getUserSubdomain() {
    const supabase = (await createClient()) as SupabaseClient<Database>;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // First try to fetch from portfolios table
    const { data } = await supabase
        .from('portfolios')
        .select('subdomain')
        .eq('user_id', user.id)
        .single();

    if (data) {
        // console.log("Found portfolio via user_id:", data); 
    } else {
        console.log("No portfolio found for user_id:", user.id);
    }

    const portfolio = data as { subdomain: string | null } | null;

    if (portfolio?.subdomain) {
        return portfolio.subdomain;
    }

    // Fallback: simple logic if portfolio doesn't exist yet but user is logged in
    // This matches the save logic: user.email?.split('@')[0] || user.id
    return user.email?.split('@')[0] || user.id;
}

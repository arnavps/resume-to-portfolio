import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database.types';

export function createServiceClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseServiceKey) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    }

    return createClient<Database>(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

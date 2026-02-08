import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/types/database.types'

export const supabase = createClientComponentClient<Database>()

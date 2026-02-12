-- Create public.users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    password_hash TEXT, -- Needed for our custom auth
    subscription_tier TEXT DEFAULT 'free',
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    github_username TEXT,
    linkedin_url TEXT
);

-- Enable Row Level Security (RLS) - Optional/Recommended
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows the Service Role complete access
-- (Though Service Role bypasses RLS, explicit policies can be good for clarity)
-- We'll just leave it open for now or rely on Service Role key bypassing RLS.

-- Grant access to authenticated users (optional, depending on if you want users to read other users)
-- For now, let's keep it simple.

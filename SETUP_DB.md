# Database Setup Guide

It appears your Supabase database is missing the required tables and initial data. Please look at the steps below to set it up.

## 1. Open Supabase SQL Editor

Go to your [Supabase Dashboard](https://supabase.com/dashboard), select your project, and navigate to the **SQL Editor** tab.

## 2. Run the Setup Script

Copy and paste the following SQL script into the editor and click **Run**. This will create all necessary tables and insert default data.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  github_username TEXT UNIQUE,
  linkedin_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'free', -- free, pro, enterprise
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  subdomain TEXT UNIQUE NOT NULL,
  custom_domain TEXT UNIQUE,
  template_id TEXT DEFAULT 'modern',
  color_scheme JSONB DEFAULT '{"primary": "#3B82F6", "secondary": "#10B981"}',
  is_published BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  seo_title TEXT,
  seo_description TEXT,
  analytics_enabled BOOLEAN DEFAULT TRUE,
  favicon_url TEXT,
  social_image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  source TEXT NOT NULL, -- 'github', 'manual', 'resume'
  source_id TEXT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  ai_narrative TEXT,
  user_edited_narrative TEXT,
  technologies JSONB DEFAULT '[]',
  demo_url TEXT,
  repo_url TEXT,
  image_url TEXT,
  gallery_images JSONB DEFAULT '[]',
  metrics JSONB DEFAULT '{}', -- stars, forks, commits, quality_score
  start_date DATE,
  end_date DATE,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  ai_confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experiences table
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  company_logo_url TEXT,
  role TEXT NOT NULL,
  employment_type TEXT, -- full-time, part-time, contract, internship
  location TEXT,
  is_remote BOOLEAN DEFAULT FALSE,
  description TEXT,
  ai_enhanced_description TEXT,
  user_edited_description TEXT,
  achievements JSONB DEFAULT '[]',
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  technologies JSONB DEFAULT '[]',
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  ai_confidence_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'language', 'framework', 'tool', 'soft-skill'
  proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5),
  years_experience DECIMAL(3,1),
  derived_from JSONB DEFAULT '[]', -- sources that contributed to this skill
  endorsement_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education table
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  institution_logo_url TEXT,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  grade TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  achievements JSONB DEFAULT '[]',
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certifications table
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date DATE,
  expiration_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  badge_image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio content sections
CREATE TABLE IF NOT EXISTS public.portfolio_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL, -- 'hero', 'about', 'summary', 'contact'
  content TEXT,
  ai_generated_content TEXT,
  user_edited BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  version INTEGER DEFAULT 1,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data sources (connected accounts)
CREATE TABLE IF NOT EXISTS public.data_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL, -- 'github', 'linkedin', 'resume'
  source_identifier TEXT, -- username, email, filename
  source_data JSONB,
  raw_data JSONB, -- original unprocessed data
  last_synced_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  sync_error TEXT,
  auto_sync_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, source_type)
);

-- Generation jobs (track AI processing)
CREATE TABLE IF NOT EXISTS public.generation_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL, -- 'full', 'projects', 'about', 'ats-optimization'
  status TEXT DEFAULT 'queued', -- queued, processing, completed, failed
  current_stage TEXT,
  progress INTEGER DEFAULT 0, -- 0-100
  stages JSONB DEFAULT '[]',
  result JSONB,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ATS scores and optimization
CREATE TABLE IF NOT EXISTS public.ats_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  keyword_score INTEGER,
  formatting_score INTEGER,
  content_score INTEGER,
  missing_keywords JSONB DEFAULT '[]',
  suggestions JSONB DEFAULT '[]',
  target_role TEXT,
  analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio analytics
CREATE TABLE IF NOT EXISTS public.portfolio_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'view', 'click', 'download', 'contact'
  event_data JSONB,
  visitor_id TEXT,
  session_id TEXT,
  page_path TEXT,
  referrer TEXT,
  device_type TEXT,
  browser TEXT,
  country TEXT,
  city TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI coaching sessions
CREATE TABLE IF NOT EXISTS public.coaching_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  session_type TEXT, -- 'improvement', 'optimization', 'content-review'
  recommendations JSONB DEFAULT '[]',
  action_items JSONB DEFAULT '[]',
  priority_score INTEGER,
  status TEXT DEFAULT 'pending', -- pending, in-progress, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Templates
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'modern', 'minimal', 'creative', 'professional'
  preview_image_url TEXT,
  thumbnail_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  config JSONB DEFAULT '{}', -- layout settings, default colors, etc.
  popularity_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  auto_sync_github BOOLEAN DEFAULT TRUE,
  ai_coaching_enabled BOOLEAN DEFAULT TRUE,
  analytics_opt_in BOOLEAN DEFAULT TRUE,
  theme TEXT DEFAULT 'light', -- light, dark, system
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cache table for GitHub data
CREATE TABLE IF NOT EXISTS public.github_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  cache_key TEXT NOT NULL,
  cache_data JSONB,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, cache_key)
);

-- RLS Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_cache ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (example, adjust as needed)
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_portfolio_id ON public.projects(portfolio_id);

-- Insert Default Templates
-- Clear first to avoid duplicates if re-running (optional)
-- DELETE FROM public.templates;

INSERT INTO public.templates (name, display_name, description, category, is_premium, is_active, config) VALUES
('modern', 'Modern', 'Clean and contemporary design with bold typography', 'modern', false, true, '{"primaryColor": "#3B82F6", "secondaryColor": "#10B981", "fontFamily": "Inter", "layout": "single-page"}'),
('minimal', 'Minimal', 'Minimalist design focusing on content', 'minimal', false, true, '{"primaryColor": "#000000", "secondaryColor": "#666666", "fontFamily": "System", "layout": "single-page"}'),
('creative', 'Creative', 'Vibrant design with animations and gradients', 'creative', true, true, '{"primaryColor": "#8B5CF6", "secondaryColor": "#EC4899", "fontFamily": "Poppins", "layout": "multi-page"}'),
('professional', 'Professional', 'Corporate-friendly design with subtle styling', 'professional', false, true, '{"primaryColor": "#1F2937", "secondaryColor": "#3B82F6", "fontFamily": "Georgia", "layout": "single-page"}'),
('startup', 'Startup', 'Modern startup aesthetic with bold colors', 'startup', true, true, '{"primaryColor": "#F59E0B", "secondaryColor": "#EF4444", "fontFamily": "Space Mono", "layout": "multi-page"}')
ON CONFLICT (name) DO NOTHING;
```

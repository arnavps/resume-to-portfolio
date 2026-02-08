export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    github_username: string | null
                    linkedin_url: string | null
                    onboarding_completed: boolean
                    subscription_tier: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    github_username?: string | null
                    linkedin_url?: string | null
                    onboarding_completed?: boolean
                    subscription_tier?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    github_username?: string | null
                    linkedin_url?: string | null
                    onboarding_completed?: boolean
                    subscription_tier?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            portfolios: {
                Row: {
                    id: string
                    user_id: string
                    subdomain: string
                    custom_domain: string | null
                    template_id: string
                    color_scheme: Json
                    is_published: boolean
                    is_public: boolean
                    seo_title: string | null
                    seo_description: string | null
                    analytics_enabled: boolean
                    favicon_url: string | null
                    social_image_url: string | null
                    published_at: string | null
                    last_synced_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    subdomain: string
                    custom_domain?: string | null
                    template_id?: string
                    color_scheme?: Json
                    is_published?: boolean
                    is_public?: boolean
                    seo_title?: string | null
                    seo_description?: string | null
                    analytics_enabled?: boolean
                    favicon_url?: string | null
                    social_image_url?: string | null
                    published_at?: string | null
                    last_synced_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    subdomain?: string
                    custom_domain?: string | null
                    template_id?: string
                    color_scheme?: Json
                    is_published?: boolean
                    is_public?: boolean
                    seo_title?: string | null
                    seo_description?: string | null
                    analytics_enabled?: boolean
                    favicon_url?: string | null
                    social_image_url?: string | null
                    published_at?: string | null
                    last_synced_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            projects: {
                Row: {
                    id: string
                    portfolio_id: string
                    source: string
                    source_id: string | null
                    title: string
                    slug: string
                    short_description: string | null
                    long_description: string | null
                    ai_narrative: string | null
                    user_edited_narrative: string | null
                    technologies: Json
                    demo_url: string | null
                    repo_url: string | null
                    image_url: string | null
                    gallery_images: Json
                    metrics: Json
                    start_date: string | null
                    end_date: string | null
                    display_order: number
                    is_featured: boolean
                    is_visible: boolean
                    ai_confidence_score: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    portfolio_id: string
                    source: string
                    source_id?: string | null
                    title: string
                    slug: string
                    short_description?: string | null
                    long_description?: string | null
                    ai_narrative?: string | null
                    user_edited_narrative?: string | null
                    technologies?: Json
                    demo_url?: string | null
                    repo_url?: string | null
                    image_url?: string | null
                    gallery_images?: Json
                    metrics?: Json
                    start_date?: string | null
                    end_date?: string | null
                    display_order?: number
                    is_featured?: boolean
                    is_visible?: boolean
                    ai_confidence_score?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    portfolio_id?: string
                    source?: string
                    source_id?: string | null
                    title?: string
                    slug?: string
                    short_description?: string | null
                    long_description?: string | null
                    ai_narrative?: string | null
                    user_edited_narrative?: string | null
                    technologies?: Json
                    demo_url?: string | null
                    repo_url?: string | null
                    image_url?: string | null
                    gallery_images?: Json
                    metrics?: Json
                    start_date?: string | null
                    end_date?: string | null
                    display_order?: number
                    is_featured?: boolean
                    is_visible?: boolean
                    ai_confidence_score?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            experiences: {
                Row: {
                    id: string
                    portfolio_id: string
                    company: string
                    company_logo_url: string | null
                    role: string
                    employment_type: string | null
                    location: string | null
                    is_remote: boolean
                    description: string | null
                    ai_enhanced_description: string | null
                    user_edited_description: string | null
                    achievements: Json
                    start_date: string
                    end_date: string | null
                    is_current: boolean
                    technologies: Json
                    display_order: number
                    is_visible: boolean
                    ai_confidence_score: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    portfolio_id: string
                    company: string
                    company_logo_url?: string | null
                    role: string
                    employment_type?: string | null
                    location?: string | null
                    is_remote?: boolean
                    description?: string | null
                    ai_enhanced_description?: string | null
                    user_edited_description?: string | null
                    achievements?: Json
                    start_date: string
                    end_date?: string | null
                    is_current?: boolean
                    technologies?: Json
                    display_order?: number
                    is_visible?: boolean
                    ai_confidence_score?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    portfolio_id?: string
                    company?: string
                    company_logo_url?: string | null
                    role?: string
                    employment_type?: string | null
                    location?: string | null
                    is_remote?: boolean
                    description?: string | null
                    ai_enhanced_description?: string | null
                    user_edited_description?: string | null
                    achievements?: Json
                    start_date?: string
                    end_date?: string | null
                    is_current?: boolean
                    technologies?: Json
                    display_order?: number
                    is_visible?: boolean
                    ai_confidence_score?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            skills: {
                Row: {
                    id: string
                    portfolio_id: string
                    skill_name: string
                    category: string
                    proficiency_level: number | null
                    years_experience: number | null
                    derived_from: Json
                    endorsement_count: number
                    display_order: number
                    is_visible: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    portfolio_id: string
                    skill_name: string
                    category: string
                    proficiency_level?: number | null
                    years_experience?: number | null
                    derived_from?: Json
                    endorsement_count?: number
                    display_order?: number
                    is_visible?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    portfolio_id?: string
                    skill_name?: string
                    category?: string
                    proficiency_level?: number | null
                    years_experience?: number | null
                    derived_from?: Json
                    endorsement_count?: number
                    display_order?: number
                    is_visible?: boolean
                    created_at?: string
                }
            }
            education: {
                Row: {
                    id: string
                    portfolio_id: string
                    institution: string
                    institution_logo_url: string | null
                    degree: string
                    field_of_study: string | null
                    grade: string | null
                    start_date: string | null
                    end_date: string | null
                    is_current: boolean
                    description: string | null
                    achievements: Json
                    display_order: number
                    is_visible: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    portfolio_id: string
                    institution: string
                    institution_logo_url?: string | null
                    degree: string
                    field_of_study?: string | null
                    grade?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    is_current?: boolean
                    description?: string | null
                    achievements?: Json
                    display_order?: number
                    is_visible?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    portfolio_id?: string
                    institution?: string
                    institution_logo_url?: string | null
                    degree?: string
                    field_of_study?: string | null
                    grade?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    is_current?: boolean
                    description?: string | null
                    achievements?: Json
                    display_order?: number
                    is_visible?: boolean
                    created_at?: string
                }
            }
            certifications: {
                Row: {
                    id: string
                    portfolio_id: string
                    name: string
                    issuing_organization: string
                    issue_date: string | null
                    expiration_date: string | null
                    credential_id: string | null
                    credential_url: string | null
                    badge_image_url: string | null
                    display_order: number
                    is_visible: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    portfolio_id: string
                    name: string
                    issuing_organization: string
                    issue_date?: string | null
                    expiration_date?: string | null
                    credential_id?: string | null
                    credential_url?: string | null
                    badge_image_url?: string | null
                    display_order?: number
                    is_visible?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    portfolio_id?: string
                    name?: string
                    issuing_organization?: string
                    issue_date?: string | null
                    expiration_date?: string | null
                    credential_id?: string | null
                    credential_url?: string | null
                    badge_image_url?: string | null
                    display_order?: number
                    is_visible?: boolean
                    created_at?: string
                }
            }
            portfolio_content: {
                Row: {
                    id: string
                    portfolio_id: string
                    section_type: string
                    content: string | null
                    ai_generated_content: string | null
                    user_edited: boolean
                    metadata: Json
                    version: number
                    is_visible: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    portfolio_id: string
                    section_type: string
                    content?: string | null
                    ai_generated_content?: string | null
                    user_edited?: boolean
                    metadata?: Json
                    version?: number
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    portfolio_id?: string
                    section_type?: string
                    content?: string | null
                    ai_generated_content?: string | null
                    user_edited?: boolean
                    metadata?: Json
                    version?: number
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            data_sources: {
                Row: {
                    id: string
                    user_id: string
                    source_type: string
                    source_identifier: string | null
                    source_data: Json | null
                    raw_data: Json | null
                    last_synced_at: string | null
                    sync_status: string
                    sync_error: string | null
                    auto_sync_enabled: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    source_type: string
                    source_identifier?: string | null
                    source_data?: Json | null
                    raw_data?: Json | null
                    last_synced_at?: string | null
                    sync_status?: string
                    sync_error?: string | null
                    auto_sync_enabled?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    source_type?: string
                    source_identifier?: string | null
                    source_data?: Json | null
                    raw_data?: Json | null
                    last_synced_at?: string | null
                    sync_status?: string
                    sync_error?: string | null
                    auto_sync_enabled?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            generation_jobs: {
                Row: {
                    id: string
                    portfolio_id: string
                    job_type: string
                    status: string
                    current_stage: string | null
                    progress: number
                    stages: Json
                    result: Json | null
                    error_message: string | null
                    started_at: string | null
                    completed_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    portfolio_id: string
                    job_type: string
                    status?: string
                    current_stage?: string | null
                    progress?: number
                    stages?: Json
                    result?: Json | null
                    error_message?: string | null
                    started_at?: string | null
                    completed_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    portfolio_id?: string
                    job_type?: string
                    status?: string
                    current_stage?: string | null
                    progress?: number
                    stages?: Json
                    result?: Json | null
                    error_message?: string | null
                    started_at?: string | null
                    completed_at?: string | null
                    created_at?: string
                }
            }
            ats_scores: {
                Row: {
                    id: string
                    portfolio_id: string
                    overall_score: number | null
                    keyword_score: number | null
                    formatting_score: number | null
                    content_score: number | null
                    missing_keywords: Json
                    suggestions: Json
                    target_role: string | null
                    analysis_data: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    portfolio_id: string
                    overall_score?: number | null
                    keyword_score?: number | null
                    formatting_score?: number | null
                    content_score?: number | null
                    missing_keywords?: Json
                    suggestions?: Json
                    target_role?: string | null
                    analysis_data?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    portfolio_id?: string
                    overall_score?: number | null
                    keyword_score?: number | null
                    formatting_score?: number | null
                    content_score?: number | null
                    missing_keywords?: Json
                    suggestions?: Json
                    target_role?: string | null
                    analysis_data?: Json | null
                    created_at?: string
                }
            }
            portfolio_analytics: {
                Row: {
                    id: string
                    portfolio_id: string
                    event_type: string
                    event_data: Json | null
                    visitor_id: string | null
                    session_id: string | null
                    page_path: string | null
                    referrer: string | null
                    device_type: string | null
                    browser: string | null
                    country: string | null
                    city: string | null
                    ip_address: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    portfolio_id: string
                    event_type: string
                    event_data?: Json | null
                    visitor_id?: string | null
                    session_id?: string | null
                    page_path?: string | null
                    referrer?: string | null
                    device_type?: string | null
                    browser?: string | null
                    country?: string | null
                    city?: string | null
                    ip_address?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    portfolio_id?: string
                    event_type?: string
                    event_data?: Json | null
                    visitor_id?: string | null
                    session_id?: string | null
                    page_path?: string | null
                    referrer?: string | null
                    device_type?: string | null
                    browser?: string | null
                    country?: string | null
                    city?: string | null
                    ip_address?: string | null
                    created_at?: string
                }
            }
            coaching_sessions: {
                Row: {
                    id: string
                    portfolio_id: string
                    session_type: string | null
                    recommendations: Json
                    action_items: Json
                    priority_score: number | null
                    status: string
                    created_at: string
                    completed_at: string | null
                }
                Insert: {
                    id?: string
                    portfolio_id: string
                    session_type?: string | null
                    recommendations?: Json
                    action_items?: Json
                    priority_score?: number | null
                    status?: string
                    created_at?: string
                    completed_at?: string | null
                }
                Update: {
                    id?: string
                    portfolio_id?: string
                    session_type?: string | null
                    recommendations?: Json
                    action_items?: Json
                    priority_score?: number | null
                    status?: string
                    created_at?: string
                    completed_at?: string | null
                }
            }
            templates: {
                Row: {
                    id: string
                    name: string
                    display_name: string
                    description: string | null
                    category: string | null
                    preview_image_url: string | null
                    thumbnail_url: string | null
                    is_premium: boolean
                    is_active: boolean
                    config: Json
                    popularity_score: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    display_name: string
                    description?: string | null
                    category?: string | null
                    preview_image_url?: string | null
                    thumbnail_url?: string | null
                    is_premium?: boolean
                    is_active?: boolean
                    config?: Json
                    popularity_score?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    display_name?: string
                    description?: string | null
                    category?: string | null
                    preview_image_url?: string | null
                    thumbnail_url?: string | null
                    is_premium?: boolean
                    is_active?: boolean
                    config?: Json
                    popularity_score?: number
                    created_at?: string
                }
            }
            user_preferences: {
                Row: {
                    user_id: string
                    email_notifications: boolean
                    auto_sync_github: boolean
                    ai_coaching_enabled: boolean
                    analytics_opt_in: boolean
                    theme: string
                    preferences: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    user_id: string
                    email_notifications?: boolean
                    auto_sync_github?: boolean
                    ai_coaching_enabled?: boolean
                    analytics_opt_in?: boolean
                    theme?: string
                    preferences?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    user_id?: string
                    email_notifications?: boolean
                    auto_sync_github?: boolean
                    ai_coaching_enabled?: boolean
                    analytics_opt_in?: boolean
                    theme?: string
                    preferences?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            github_cache: {
                Row: {
                    id: string
                    user_id: string
                    cache_key: string
                    cache_data: Json | null
                    expires_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    cache_key: string
                    cache_data?: Json | null
                    expires_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    cache_key?: string
                    cache_data?: Json | null
                    expires_at?: string | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

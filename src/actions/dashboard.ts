'use server';

import { createServiceClient } from '@/lib/supabase/service';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    const payload = await verifyJWT(token);
    return payload?.sub as string | undefined;
}

export async function getDashboardOverview() {
    const userId = await getUserId();
    if (!userId) return null;

    const supabase = createServiceClient();

    // 1. Fetch Basic Info (User + Portfolio)
    const { data: rawUser } = await supabase.from('users').select('*').eq('id', userId).single();
    const { data: rawPortfolio } = await supabase.from('portfolios').select('*').eq('user_id', userId).single();

    if (!rawPortfolio) return null;

    const user = rawUser as any;
    const portfolio = rawPortfolio as any;
    const portfolioId = portfolio.id;

    // 2. Fetch Counts for Health Score
    // Casting to any to avoid count property type issues if definitions are strict
    const { count: projectCount } = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('portfolio_id', portfolioId);
    const { count: experienceCount } = await supabase.from('experiences').select('*', { count: 'exact', head: true }).eq('portfolio_id', portfolioId);
    const { count: skillCount } = await supabase.from('skills').select('*', { count: 'exact', head: true }).eq('portfolio_id', portfolioId);

    // Calculate Health Score
    let score = 0;
    // Base: 20
    score += 20;
    // Profile info (Name, Title/Bio in SEO fields): 20
    if (user?.full_name && portfolio.seo_title && portfolio.seo_description) score += 20;
    // Projects (> 0): 20
    if ((projectCount || 0) > 0) score += 20;
    // Experience (> 0): 10
    if ((experienceCount || 0) > 0) score += 10;
    // Skills (> 0): 10
    if ((skillCount || 0) > 0) score += 10;
    // Custom domain or specific subdomain check? 
    // Published? 10
    if (portfolio.is_published) score += 10;
    // Dynamic Health Check Items
    const healthChecks = [
        {
            label: 'Profile Information',
            completed: !!(user?.full_name && portfolio.seo_title),
            type: 'profile'
        },
        {
            label: `${projectCount || 0} Projects added`,
            completed: (projectCount || 0) > 0,
            type: 'projects'
        },
        {
            label: 'Experience section',
            completed: (experienceCount || 0) > 0,
            type: 'experience'
        },
        {
            label: 'Portfolio Published',
            completed: !!portfolio.is_published,
            type: 'publish'
        }
    ];


    // 3. functional Recent Activity
    // We'll combine recent projects and recent analytics events
    const { data: rawRecentProjects } = await supabase
        .from('projects')
        .select('title, created_at, updated_at')
        .eq('portfolio_id', portfolioId)
        .order('updated_at', { ascending: false })
        .limit(3);

    const { data: rawRecentAnalytics } = await supabase
        .from('portfolio_analytics')
        .select('event_type, created_at, country, city')
        .eq('portfolio_id', portfolioId)
        .order('created_at', { ascending: false })
        .limit(5);

    const activities: any[] = [];

    const recentProjects = rawRecentProjects as any[] | null;
    const recentAnalytics = rawRecentAnalytics as any[] | null;

    // Map projects to activity
    if (recentProjects) {
        recentProjects.forEach((p: any) => {
            activities.push({
                text: `Project '${p.title}' updated`,
                time: new Date(p.updated_at).toLocaleDateString(), // Simplification
                timestamp: new Date(p.updated_at).getTime(),
                type: 'update'
            });
        });
    }

    // Map analytics to activity
    if (recentAnalytics) {
        recentAnalytics.forEach((a: any) => {
            let text = 'New visitor';
            if (a.event_type === 'view') text = `Portfolio view from ${a.city || 'Unknown'}, ${a.country || ''}`;
            if (a.event_type === 'project_click') text = 'Project viewed';

            activities.push({
                text: text,
                time: new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: new Date(a.created_at).getTime(),
                type: 'visitor'
            });
        });
    }

    // Sort combined activities
    activities.sort((a, b) => b.timestamp - a.timestamp);
    const recentActivity = activities.slice(0, 5); // Top 5

    return {
        health: {
            score,
            checks: healthChecks
        },
        recentActivity,
        notifications: await getNotifications(portfolio)
    };
}

export async function getNotifications(portfolio?: any) {
    if (!portfolio) {
        const userId = await getUserId();
        if (!userId) return [];
        const supabase = createServiceClient();
        const { data } = await supabase.from('portfolios').select('*').eq('user_id', userId).single();
        portfolio = data;
    }

    if (!portfolio) return [];

    const supabase = createServiceClient();

    // Check project count for "Add Project" notification
    const { count: projectCount } = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('portfolio_id', portfolio.id);

    // 4. Notifications (Derived)
    const notifications: any[] = [];

    if (!portfolio.is_published) {
        notifications.push({
            id: 'publish-nudge',
            title: 'Publish your portfolio',
            description: 'Your portfolio is currently hidden. Publish it to share with the world!',
            unread: true,
            time: 'Now'
        });
    }

    if ((projectCount || 0) === 0) {
        notifications.push({
            id: 'add-project',
            title: 'Add your first project',
            description: 'Showcase your work by adding a project.',
            unread: true,
            time: 'Now'
        });
    }

    // Welcome message
    notifications.push({
        id: 'welcome',
        title: 'Welcome to Folio.ai',
        description: 'We are glad to have you here. Start by setting up your profile.',
        unread: false,
        time: '1d ago'
    });

    return notifications;
}

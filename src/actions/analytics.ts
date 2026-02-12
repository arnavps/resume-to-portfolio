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

export async function getAnalyticsData(period = '7d') {
    const userId = await getUserId();
    if (!userId) return null;

    const supabase = createServiceClient();
    const { data: rawPortfolio } = await supabase.from('portfolios').select('id').eq('user_id', userId).single();
    const portfolio = rawPortfolio as { id: string } | null;
    if (!portfolio) return null;

    // Calculate start date
    const now = new Date();
    const startDate = new Date();
    if (period === '24h') startDate.setHours(startDate.getHours() - 24);
    else if (period === '7d') startDate.setDate(startDate.getDate() - 7);
    else if (period === '30d') startDate.setDate(startDate.getDate() - 30);
    else if (period === '90d') startDate.setDate(startDate.getDate() - 90);

    const { data: events, error } = await supabase
        .from('portfolio_analytics')
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

    if (error || !events) {
        console.error('Error fetching analytics:', error);
        return null;
    }

    const typedEvents = events as any[];

    // Aggregations
    const totalViews = typedEvents.filter(e => e.event_type === 'view').length;
    const uniqueVisitors = new Set(typedEvents.map(e => e.visitor_id)).size;
    const projectClicks = typedEvents.filter(e => e.event_type === 'project_click').length;

    // Bounce rate: % of sessions with 1 event
    const sessions = typedEvents.reduce((acc, e) => {
        if (!e.session_id) return acc;
        acc[e.session_id] = (acc[e.session_id] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const totalSessions = Object.keys(sessions).length;
    const singleEventSessions = Object.values(sessions).filter(count => count === 1).length;
    const bounceRate = totalSessions > 0 ? Math.round((singleEventSessions / totalSessions) * 100) : 0;

    // Daily Trends
    const trendsMap = new Map<string, { visitors: Set<string>, pageviews: number }>();

    // Initialize map with empty days
    if (period !== '24h') { // 24h needs hourly, others daily
        for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
            const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue
            // Using ISO key for sorting, but display name for UI
            // A better approach is to rely on the data, but filling gaps is good.
            // Simplified: just grouping by day name for now as per UI
            // If range > 7 days, maybe use date string
        }
    }

    // Simple grouping
    const trends = typedEvents.reduce((acc, e) => {
        const date = new Date(e.created_at);
        const key = period === '24h'
            ? date.toLocaleTimeString([], { hour: '2-digit', hour12: true })
            : date.toLocaleDateString('en-US', { weekday: 'short' });

        if (!acc[key]) acc[key] = { name: key, visitors: new Set(), pageviews: 0 };
        acc[key].pageviews++;
        if (e.visitor_id) acc[key].visitors.add(e.visitor_id);
        return acc;
    }, {} as Record<string, any>);

    const visitorTrends = Object.values(trends).map((t: any) => ({
        name: t.name,
        visitors: t.visitors.size,
        pageviews: t.pageviews
    }));

    // Device Breakdown
    const devices = typedEvents.reduce((acc, e) => {
        const type = e.device_type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const deviceBreakdown = Object.entries(devices).map(([name, value], i) => ({
        name,
        value: Math.round(((value as number) / typedEvents.length) * 100),
        color: ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B'][i % 4]
    }));

    // Locations
    const locations = typedEvents.reduce((acc, e) => {
        const country = e.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const locationData = Object.entries(locations)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([country, visitors]) => ({
            country,
            visitors: visitors as number,
            percent: Math.round(((visitors as number) / typedEvents.length) * 100)
        }));

    // Referrers
    const referrers = typedEvents.reduce((acc, e) => {
        try {
            const ref = e.referrer ? new URL(e.referrer).hostname : 'Direct';
            acc[ref] = (acc[ref] || 0) + 1;
        } catch {
            const ref = 'Direct';
            acc[ref] = (acc[ref] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const referrerData = Object.entries(referrers)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([name, value]) => ({ name, value: value as number }));

    return {
        metrics: {
            totalViews,
            uniqueVisitors,
            bounceRate,
            avgSession: 'N/A', // Placeholder
            projectClicks
        },
        visitorTrends,
        deviceBreakdown,
        locationData,
        referrerData
    };
}

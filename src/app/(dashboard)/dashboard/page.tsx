'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import {
    BarChart3,
    TrendingUp,
    Users,
    Eye,
    Sparkles,
    ArrowRight,
    Github,
    FileText,
    CheckCircle2,
    AlertCircle,
    Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalViews: 0,
        uniqueVisitors: 0,
        projectClicks: 0,
        contactClicks: 0
    });
    const [user, setUser] = useState<any>(null);
    const [dashboardData, setDashboardData] = useState<any>(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch user from our custom auth API
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            const userData = data.user;

            if (!userData) {
                // Not authenticated, redirect to login
                window.location.href = '/login';
                return;
            }

            // Update user state
            setUser({ ...userData, user_metadata: { full_name: userData.full_name } });

            // Fetch Overview Data (Health, Activity, Notifications)
            try {
                const { getDashboardOverview } = await import('@/actions/dashboard');
                const overview = await getDashboardOverview();
                setDashboardData(overview);
            } catch (err) {
                console.error('Failed to load dashboard overview', err);
            }

            // Fetch Portfolio
            const { data: rawPortfolio } = await supabase
                .from('portfolios')
                .select('id')
                .eq('user_id', (userData as any).id)
                .single();

            const portfolio = rawPortfolio as any;

            if (!portfolio) {
                setStats({
                    totalViews: 0,
                    uniqueVisitors: 0,
                    projectClicks: 0,
                    contactClicks: 0
                });
                setLoading(false);
                return;
            }

            // Fetch Analytics
            const { data: analytics } = await supabase
                .from('portfolio_analytics')
                .select('event_type, visitor_id')
                .eq('portfolio_id', portfolio.id);

            // Calculate stats
            if (analytics) {
                const totalViews = analytics.filter((a: any) => a.event_type === 'view').length;
                const uniqueVisitors = new Set(analytics.map((a: any) => a.visitor_id)).size;
                const projectClicks = analytics.filter((a: any) => a.event_type === 'project_click').length;
                const contactClicks = analytics.filter((a: any) => a.event_type === 'contact_click').length;

                setStats({
                    totalViews,
                    uniqueVisitors,
                    projectClicks,
                    contactClicks
                });
            } else {
                setStats({
                    totalViews: 0,
                    uniqueVisitors: 0,
                    projectClicks: 0,
                    contactClicks: 0
                });
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Wellness / Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Welcome back, {user?.user_metadata?.full_name || 'Developer'} 👋
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Here's what's happening with your portfolio today.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/generate">
                        <Button variant="primary" leftIcon={<Sparkles className="h-4 w-4" />}>
                            Update Portfolio
                        </Button>
                    </Link>
                    <Link href="/preview">
                        <Button variant="outline" leftIcon={<Eye className="h-4 w-4" />}>
                            View Live
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Views"
                    value={stats.totalViews}
                    icon={<Eye className="w-5 h-5" />}
                    trend="+12.5%"
                    trendUp={true}
                    color="indigo"
                />
                <StatsCard
                    title="Unique Visitors"
                    value={stats.uniqueVisitors}
                    icon={<Users className="w-5 h-5" />}
                    trend="+8.2%"
                    trendUp={true}
                    color="purple"
                />
                <StatsCard
                    title="Project Clicks"
                    value={stats.projectClicks}
                    icon={<Github className="w-5 h-5" />}
                    trend="+5.4%"
                    trendUp={true}
                    color="emerald"
                />
                <StatsCard
                    title="Contact Requests"
                    value={stats.contactClicks}
                    icon={<TrendingUp className="w-5 h-5" />}
                    trend="-2.1%"
                    trendUp={false}
                    color="amber"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Portfolio Health */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                Portfolio Health
                            </CardTitle>
                            <CardDescription>Your portfolio is looking great! Just a few items to polish.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">Completion Score</span>
                                        <span className="font-bold text-indigo-600">{dashboardData?.health?.score || 0}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                                        <div
                                            className="h-2 rounded-full bg-gradient-primary animate-pulse-subtle"
                                            style={{ width: `${dashboardData?.health?.score || 0}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    {dashboardData?.health?.checks.map((check: any, i: number) => (
                                        <div key={i} className={`flex items-center gap-3 p-3 rounded-lg text-sm ${check.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                            {check.completed ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                                            <span>{check.label}</span>
                                        </div>
                                    ))}
                                    {!dashboardData && (
                                        <div className="text-sm text-slate-400">Loading health data...</div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <QuickActionCard
                            title="Sync GitHub"
                            description="Pull latest repositories"
                            icon={<Github className="h-6 w-6 text-indigo-600" />}
                            href="/connect"
                        />
                        <QuickActionCard
                            title="Edit Projects"
                            description="Manage project details"
                            icon={<FileText className="h-6 w-6 text-purple-600" />}
                            href="/projects"
                        />
                        <QuickActionCard
                            title="Analytics"
                            description="View visitor insights"
                            icon={<BarChart3 className="h-6 w-6 text-emerald-600" />}
                            href="/analytics"
                        />
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6 relative ml-2">
                                <div className="absolute left-0 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-800" />
                                {dashboardData?.recentActivity?.length > 0 ? (
                                    dashboardData.recentActivity.map((item: any, i: number) => (
                                        <div key={i} className="relative pl-6 flex flex-col gap-1">
                                            <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-white border-2 border-indigo-500 ring-4 ring-white dark:ring-slate-950" />
                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.text}</span>
                                            <span className="text-xs text-slate-500">{item.time}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="pl-6 text-sm text-slate-500">No recent activity</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Insight */}
                    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                                <Sparkles className="h-4 w-4" /> AI Insight
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Adding a case study to your "E-commerce" project could increase engagement by ~40%.
                            </p>
                            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 p-0 h-auto font-medium">
                                Generate Case Study <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, trend, trendUp, color }: any) {
    const colors = {
        indigo: "text-indigo-600 bg-indigo-100",
        purple: "text-purple-600 bg-purple-100",
        emerald: "text-emerald-600 bg-emerald-100",
        amber: "text-amber-600 bg-amber-100",
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${colors[color as keyof typeof colors]}`}>
                        {icon}
                    </div>
                    {trend && (
                        <Badge variant={trendUp ? "success" : "neutral"} className="font-mono">
                            {trend}
                        </Badge>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </h3>
                </div>
            </CardContent>
        </Card>
    );
}

function QuickActionCard({ title, description, icon, href }: any) {
    return (
        <Link href={href} className="group">
            <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md border-slate-200 hover:border-indigo-200">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="p-3 rounded-full bg-slate-50 group-hover:bg-indigo-50 transition-colors">
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">{title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{description}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="h-10 w-32 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-64 bg-slate-200 rounded-xl animate-pulse" />
                <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
            </div>
        </div>
    );
}

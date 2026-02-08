'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalViews: 0,
        uniqueVisitors: 0,
        projectClicks: 0,
        contactClicks: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            // Get user's portfolio
            const { data: portfolio } = await supabase
                .from('portfolios')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!portfolio) {
                setLoading(false);
                return;
            }

            // Fetch analytics
            const { data: analytics } = await supabase
                .from('portfolio_analytics')
                .select('event_type, visitor_id')
                .eq('portfolio_id', portfolio.id);

            if (analytics) {
                const totalViews = analytics.filter(a => a.event_type === 'view').length;
                const uniqueVisitors = new Set(analytics.map(a => a.visitor_id)).size;
                const projectClicks = analytics.filter(a => a.event_type === 'click' && a.event_data?.type === 'project').length;
                const contactClicks = analytics.filter(a => a.event_type === 'contact').length;

                setStats({
                    totalViews,
                    uniqueVisitors,
                    projectClicks,
                    contactClicks
                });
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-lime-400 text-black rounded-lg font-semibold">
                        Daily
                    </button>
                    <button className="px-4 py-2 bg-gray-100 rounded-lg">Weekly</button>
                    <button className="px-4 py-2 bg-gray-100 rounded-lg">Monthly</button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Views"
                    value={stats.totalViews}
                    icon={<Eye className="w-6 h-6" />}
                    trend="+5.2%"
                    color="blue"
                />
                <StatsCard
                    title="Unique Visitors"
                    value={stats.uniqueVisitors}
                    icon={<Users className="w-6 h-6" />}
                    trend="+3.1%"
                    color="green"
                />
                <StatsCard
                    title="Project Clicks"
                    value={stats.projectClicks}
                    icon={<BarChart3 className="w-6 h-6" />}
                    trend="+8.4%"
                    color="purple"
                />
                <StatsCard
                    title="Contact Clicks"
                    value={stats.contactClicks}
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend="+12.1%"
                    color="pink"
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickActionCard
                        title="Generate Portfolio"
                        description="Create your portfolio with AI"
                        href="/dashboard/generate"
                        color="lime"
                    />
                    <QuickActionCard
                        title="Connect Data Sources"
                        description="Link GitHub, Resume, LinkedIn"
                        href="/dashboard/connect"
                        color="blue"
                    />
                    <QuickActionCard
                        title="Customize Design"
                        description="Choose template and colors"
                        href="/dashboard/customize"
                        color="purple"
                    />
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, trend, color }: any) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        pink: 'bg-pink-50 text-pink-600'
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
                    {icon}
                </div>
                <span className="text-sm text-green-600 font-semibold">{trend}</span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
            <p className="text-3xl font-bold">{value.toLocaleString()}</p>
        </div>
    );
}

function QuickActionCard({ title, description, href, color }: any) {
    const colorClasses = {
        lime: 'bg-lime-400 hover:bg-lime-500',
        blue: 'bg-blue-500 hover:bg-blue-600',
        purple: 'bg-purple-500 hover:bg-purple-600'
    };

    return (
        <a
            href={href}
            className={`${colorClasses[color as keyof typeof colorClasses]} text-white p-6 rounded-xl transition-colors`}
        >
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-sm opacity-90">{description}</p>
        </a>
    );
}

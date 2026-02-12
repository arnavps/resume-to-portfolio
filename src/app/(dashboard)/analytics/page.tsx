'use client';

import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import {
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Users,
    Clock,
    MousePointer,
    Smartphone,
    Globe,
    Monitor
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock Data
const dataVisitorTrends = [
    { name: 'Mon', visitors: 145, pageviews: 230 },
    { name: 'Tue', visitors: 230, pageviews: 450 },
    { name: 'Wed', visitors: 180, pageviews: 310 },
    { name: 'Thu', visitors: 278, pageviews: 520 },
    { name: 'Fri', visitors: 189, pageviews: 340 },
    { name: 'Sat', visitors: 239, pageviews: 410 },
    { name: 'Sun', visitors: 349, pageviews: 650 },
];

const dataDevices = [
    { name: 'Desktop', value: 65, color: '#6366F1' },
    { name: 'Mobile', value: 25, color: '#8B5CF6' },
    { name: 'Tablet', value: 10, color: '#10B981' },
];

const dataReferrers = [
    { name: 'Direct', value: 450 },
    { name: 'Google', value: 320 },
    { name: 'LinkedIn', value: 210 },
    { name: 'Twitter', value: 150 },
    { name: 'GitHub', value: 90 },
];

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState('7d');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, [dateRange]);

    const loadData = async () => {
        setLoading(true);
        try {
            const { getAnalyticsData } = await import('@/actions/analytics');
            const result = await getAnalyticsData(dateRange);
            setData(result);
        } catch (error) {
            console.error('Failed to load analytics', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading analytics...</div>;
    if (!data) return <div className="p-10 text-center">No analytics data available.</div>;

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Insights into your portfolio traffic and engagement.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    {['24h', '7d', '30d', '90d'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${dateRange === range
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Visitors"
                    value={data.metrics.uniqueVisitors}
                    trend="--"
                    trendUp={true}
                    icon={<Users className="h-5 w-5 text-indigo-600" />}
                    color="bg-indigo-50"
                />
                <MetricCard
                    title="Page Views"
                    value={data.metrics.totalViews}
                    trend="--"
                    trendUp={true}
                    icon={<Monitor className="h-5 w-5 text-purple-600" />}
                    color="bg-purple-50"
                />
                <MetricCard
                    title="Bounce Rate"
                    value={data.metrics.bounceRate + '%'}
                    trend="--"
                    trendUp={false} // Lower bounce rate is good
                    icon={<ArrowDownRight className="h-5 w-5 text-emerald-600" />}
                    color="bg-emerald-50"
                />
                <MetricCard
                    title="Project Clicks"
                    value={data.metrics.projectClicks}
                    trend="--"
                    trendUp={true}
                    icon={<MousePointer className="h-5 w-5 text-amber-600" />}
                    color="bg-amber-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Visitor Trends</CardTitle>
                        <CardDescription>Daily unique visitors and pageviews.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.visitorTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="visitors" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
                                    <Area type="monotone" dataKey="pageviews" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorPageviews)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Device Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Device Breakdown</CardTitle>
                        <CardDescription>Visitors by device type.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.deviceBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.deviceBreakdown.map((entry: any, index: any) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <span className="text-2xl font-bold text-slate-900">{data.metrics.totalViews}</span>
                                    <p className="text-xs text-slate-500">Views</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 space-y-4">
                            {data.deviceBreakdown.map((device: any) => (
                                <div key={device.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: device.color }} />
                                        <span className="text-slate-600">{device.name}</span>
                                    </div>
                                    <span className="font-semibold text-slate-900">{device.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Traffic Sources */}
                <Card>
                    <CardHeader>
                        <CardTitle>Traffic Sources</CardTitle>
                        <CardDescription>Where your visitors are coming from.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={data.referrerData} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" width={80} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 13 }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    />
                                    <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Locations */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Locations</CardTitle>
                        <CardDescription>Visitors by country.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.locationData.map((loc: any) => (
                                <div key={loc.country} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-slate-400" />
                                            <span className="font-medium text-slate-700">{loc.country}</span>
                                        </div>
                                        <span className="text-slate-500">{loc.visitors}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full"
                                            style={{ width: `${loc.percent}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function MetricCard({ title, value, trend, trendUp, icon, color }: any) {
    return (
        <Card className="hover:border-indigo-200 transition-colors">
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4 mb-4">
                    <div className={`p-2 rounded-lg ${color}`}>
                        {icon}
                    </div>
                    <Badge variant={trendUp ? 'success' : 'error'} className="font-mono">
                        {trend}
                    </Badge>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
                </div>
            </CardContent>
        </Card>
    );
}

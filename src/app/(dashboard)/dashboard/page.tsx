'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/lib/hooks/useUser'
import StatsCard from '@/components/dashboard/StatsCard'
import Sidebar from '@/components/dashboard/Sidebar'
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useUser()
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchAnalytics()
    }
  }, [user])

  const fetchAnalytics = async () => {
    try {
      const { data: portfolio } = await supabase
        .from('portfolios')
        .select('id')
        .eq('user_id', user?.id)
        .single()

      if (!portfolio) {
        setLoading(false)
        return
      }

      const { data: stats } = await supabase
        .from('portfolio_analytics')
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      const processed = processAnalytics(stats || [])
      setAnalytics(processed)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const processAnalytics = (stats: any[]) => {
    const totalViews = stats.filter(s => s.event_type === 'view').length
    const totalClicks = stats.filter(s => s.event_type === 'click').length
    const uniqueVisitors = new Set(stats.map(s => s.visitor_id)).size
    
    const monthlyData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      const dateStr = date.toISOString().split('T')[0]
      
      const dayStats = stats.filter(s => 
        s.created_at.startsWith(dateStr) && s.event_type === 'view'
      )
      
      return {
        date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        views: dayStats.length
      }
    })

    const demographics = stats.reduce((acc: any, stat) => {
      if (stat.country) {
        acc[stat.country] = (acc[stat.country] || 0) + 1
      }
      return acc
    }, {})

    const topChannels = stats.reduce((acc: any, stat) => {
      const referrer = stat.referrer || 'Direct'
      acc[referrer] = (acc[referrer] || 0) + 1
      return acc
    }, {})

    return {
      totalReach: totalViews,
      paidReach: Math.round(totalViews * 0.3),
      organicReach: Math.round(totalViews * 0.7),
      totalClicks,
      uniqueVisitors,
      monthlyData,
      demographics: Object.entries(demographics).slice(0, 5).map(([name, value]) => ({ name, value })),
      topChannels: Object.entries(topChannels).slice(0, 5).map(([name, value]) => ({ name, value }))
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="flex-1 p-8">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Reach"
            value={analytics?.totalReach || 0}
            icon={BarChart3}
            trend={"+5.2%"}
            color="blue"
          />
          <StatsCard
            title="Total Paid Reach"
            value={analytics?.paidReach || 0}
            icon={TrendingUp}
            trend={"+3.1%"}
            color="green"
          />
          <StatsCard
            title="Total Organic Reach"
            value={analytics?.organicReach || 0}
            icon={Users}
            trend={"-1.2%"}
            color="pink"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Reach Overview</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart component will be implemented here
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Demographics</h2>
            <div className="space-y-3">
              {analytics?.demographics?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Top Channels</h2>
            <div className="space-y-3">
              {analytics?.topChannels?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

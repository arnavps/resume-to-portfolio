'use client'

import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon | string
  trend?: string
  color?: 'blue' | 'green' | 'pink' | 'yellow' | 'purple'
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'blue' 
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    pink: 'bg-pink-100 text-pink-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600'
  }

  const trendColor = trend?.startsWith('+') ? 'text-green-600' : 
                    trend?.startsWith('-') ? 'text-red-600' : 'text-gray-600'

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {typeof Icon === 'string' ? (
            <span className="text-lg">{Icon}</span>
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm font-medium ${trendColor}`}>
              {trend}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

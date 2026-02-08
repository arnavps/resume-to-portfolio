'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  FolderOpen,
  Settings,
  HelpCircle,
  FileText,
  Palette,
  Eye,
  Sparkles
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface SidebarItemType {
  name: string;
  href: string;
  icon: any;
  highlight?: boolean;
  badge?: string;
}

const menuItems: SidebarItemType[] = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Connect', href: '/dashboard/connect', icon: Users },
  { name: 'Generate', href: '/dashboard/generate', icon: Sparkles, highlight: true },
]

const workspaceItems: SidebarItemType[] = [
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'Experience', href: '/dashboard/experience', icon: Calendar },
  { name: 'Skills', href: '/dashboard/skills', icon: FileText },
  { name: 'Customize', href: '/dashboard/customize', icon: Palette },
]

const analysisItems: SidebarItemType[] = [
  { name: 'Preview', href: '/dashboard/preview', icon: Eye },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
]

const generalItems: SidebarItemType[] = [
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 bg-slate-900 text-slate-300 min-h-screen flex flex-col border-r border-slate-800 shadow-xl transition-all duration-300">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="font-bold text-lg text-white tracking-tight group-hover:text-indigo-200 transition-colors">Folio.ai</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        {/* Main Menu */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
            Main Menu
          </h3>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </div>
        </div>

        {/* Workspace */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
            Content Manager
          </h3>
          <div className="space-y-1">
            {workspaceItems.map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </div>
        </div>

        {/* Analysis */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
            Analysis & View
          </h3>
          <div className="space-y-1">
            {analysisItems.map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </div>
        </div>

        {/* General */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
            System
          </h3>
          <div className="space-y-1">
            {generalItems.map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Profile/Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30">
        <Link
          href="/help"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all group"
        >
          <HelpCircle className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
          <span className="font-medium">Help & Support</span>
        </Link>
      </div>
    </aside>
  )
}

function SidebarItem({ item, isActive }: {
  item: SidebarItemType;
  isActive: boolean
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-all duration-200 group relative",
        isActive
          ? "bg-indigo-500/10 text-indigo-300"
          : "hover:bg-slate-800 hover:text-white text-slate-400",
        item.highlight && !isActive && "text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
      )}

      <item.icon className={cn(
        "w-5 h-5 transition-colors",
        isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-400",
        item.highlight && "text-indigo-400"
      )} />

      <span className="flex-1 font-medium">{item.name}</span>

      {item.highlight && (
        <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
      )}

      {item.badge && (
        <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
          {item.badge}
        </Badge>
      )}
    </Link>
  )
}

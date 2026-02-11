'use client'

import { SidebarContent } from './SidebarContent'

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-72 bg-slate-900 border-r border-slate-800 shadow-xl min-h-screen flex-col transition-all duration-300">
      <SidebarContent />
    </aside>
  )
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Link2,
    Sparkles,
    FolderOpen,
    Briefcase,
    Code2,
    Palette,
    Eye,
    BarChart3,
    Settings,
    HelpCircle
} from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Connect Data', href: '/dashboard/connect', icon: Link2 },
    { name: 'Generate', href: '/dashboard/generate', icon: Sparkles },
];

const workspaceItems = [
    { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
    { name: 'Experience', href: '/dashboard/experience', icon: Briefcase },
    { name: 'Skills', href: '/dashboard/skills', icon: Code2 },
    { name: 'Customize', href: '/dashboard/customize', icon: Palette },
    { name: 'Preview', href: '/dashboard/preview', icon: Eye },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
];

const generalItems = [
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-lime-100 min-h-screen p-4 flex flex-col">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8 px-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">P</span>
                </div>
                <span className="font-bold text-lg">PortfolioGen</span>
            </div>

            {/* Main Menu */}
            <nav className="flex-1">
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-600 mb-2 px-2">
                        MAIN MENU
                    </h3>
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            item={item}
                            isActive={pathname === item.href}
                        />
                    ))}
                </div>

                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-600 mb-2 px-2">
                        WORKSPACE
                    </h3>
                    {workspaceItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            item={item}
                            isActive={pathname === item.href}
                        />
                    ))}
                </div>

                <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-2 px-2">
                        GENERAL
                    </h3>
                    {generalItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            item={item}
                            isActive={pathname === item.href}
                        />
                    ))}
                </div>
            </nav>

            {/* Help Button */}
            <div className="mt-auto">
                <div className="bg-black text-white rounded-xl p-4 text-center">
                    <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center mx-auto mb-3">
                        <HelpCircle className="w-6 h-6 text-black" />
                    </div>
                    <p className="text-sm font-semibold mb-2">Need Help?</p>
                    <button className="bg-lime-400 text-black px-4 py-2 rounded-lg text-sm font-semibold w-full hover:bg-lime-500 transition">
                        Documentation
                    </button>
                </div>
            </div>
        </aside>
    );
}

function SidebarItem({ item, isActive }: { item: any; isActive: boolean }) {
    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors",
                isActive
                    ? "bg-white shadow-sm"
                    : "hover:bg-lime-50"
            )}
        >
            <item.icon className="w-5 h-5" />
            <span className="flex-1 font-medium">{item.name}</span>
            {item.badge && (
                <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                </span>
            )}
        </Link>
    );
}

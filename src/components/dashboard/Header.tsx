'use client';

import { Bell, Search, User, Settings, LogOut, CreditCard, Sparkles, Check, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { usePortfolioStore } from '@/lib/store/usePortfolioStore';
import MobileSidebar from './MobileSidebar';

export default function Header() {
    const [mounted, setMounted] = useState(false);
    const { data } = usePortfolioStore();

    useEffect(() => {
        setMounted(true);
        // Fetch real user data
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    usePortfolioStore.setState({
                        data: {
                            ...usePortfolioStore.getState().data,
                            name: data.user.full_name || data.user.email,
                            email: data.user.email
                        }
                    });
                }
            })
            .catch(err => console.error('Failed to fetch user for header:', err));
    }, []);

    const notifications = [
        {
            id: 1,
            title: "Portfolio Views Spike",
            description: "Your portfolio got 150+ views today!",
            time: "2 hours ago",
            unread: true
        },
        {
            id: 2,
            title: "AI Analysis Complete",
            description: "Your latest project has been analyzed.",
            time: "5 hours ago",
            unread: true
        },
        {
            id: 3,
            title: "New Feature Unlocked",
            description: "Try out the new 'Creative' template.",
            time: "1 day ago",
            unread: false
        }
    ];

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b border-border bg-white/80 px-6 backdrop-blur-md dark:bg-slate-950/80">
            <div className="flex flex-1 items-center gap-4">
                <MobileSidebar />
                <div className="relative w-full max-w-md md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search projects, skills, or templates..."
                        className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                {/* Notifications */}
                {mounted ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative text-slate-500 hover:bg-slate-100 hover:text-indigo-600">
                                <Bell className="h-5 w-5" />
                                {notifications.some(n => n.unread) && (
                                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                                )}
                                <span className="sr-only">Notifications</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            {/* ... content ... */}
                            <DropdownMenuLabel className="flex items-center justify-between">
                                Notifications
                                <Badge variant="secondary" className="text-xs font-normal">3 Unread</Badge>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.map((notification) => (
                                    <DropdownMenuItem key={notification.id} className="cursor-pointer flex flex-col items-start gap-1 p-3">
                                        <div className="flex items-center justify-between w-full">
                                            <span className="font-medium text-sm">{notification.title}</span>
                                            {notification.unread && <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>}
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {notification.description}
                                        </p>
                                        <span className="text-[10px] text-slate-400">{notification.time}</span>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="w-full text-center justify-center text-xs text-indigo-600 font-medium cursor-pointer">
                                View all notifications
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button variant="ghost" size="icon" className="relative text-slate-500 hover:bg-slate-100 hover:text-indigo-600">
                        <Bell className="h-5 w-5" />
                        {notifications.some(n => n.unread) && (
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        )}
                        <span className="sr-only">Notifications</span>
                    </Button>
                )}

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

                {/* Profile */}
                {mounted ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-slate-200 p-0 shadow-sm hover:bg-slate-50">
                                <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white font-medium text-xs">
                                    {data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{data.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{data.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                                    <span>Upgrade Plan</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                                <Link href="/help" className="flex items-center w-full">
                                    <HelpCircle className="mr-2 h-4 w-4" />
                                    <span>Help & Support</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="h-9 w-9 rounded-full bg-slate-200 animate-pulse" />
                )}
            </div>
        </header>
    );
}

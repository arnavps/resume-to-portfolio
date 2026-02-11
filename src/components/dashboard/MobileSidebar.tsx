'use client'

import { Menu } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet'
import { SidebarContent } from './SidebarContent'
import { Button } from '@/components/ui/button'

export default function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-slate-500 hover:text-indigo-600">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-slate-900 border-r border-slate-800 w-72">
                <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                    <SheetDescription>Main navigation menu for the dashboard</SheetDescription>
                </SheetHeader>
                <SidebarContent />
            </SheetContent>
        </Sheet>
    )
}

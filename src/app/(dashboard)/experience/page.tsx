'use client';

import { useState } from 'react';
import { Plus, Briefcase, Calendar, Building2, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function ExperiencePage() {
    // Mock data
    const experience = [
        {
            id: 1,
            role: 'Senior Frontend Developer',
            company: 'TechCorp Inc.',
            period: '2022 - Present',
            type: 'Full-time',
            description: 'Leading the frontend migration to Next.js and implementing a new design system.',
            skills: ['React', 'Next.js', 'TypeScript', 'Tailwind']
        },
        {
            id: 2,
            role: 'Full Stack Engineer',
            company: 'StartupX',
            period: '2020 - 2022',
            type: 'Full-time',
            description: 'Built scalable APIs and interactive UI for a fintech product.',
            skills: ['Node.js', 'PostgreSQL', 'Vue.js']
        },
        {
            id: 3,
            role: 'Web Developer Intern',
            company: 'Digital Agency',
            period: '2019 - 2020',
            type: 'Internship',
            description: 'Developed responsive websites for various clients using WordPress and React.',
            skills: ['HTML/CSS', 'JavaScript', 'WordPress']
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Experience</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Showcase your professional journey and career milestones.
                    </p>
                </div>
                <Button size="lg" variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                    Add Experience
                </Button>
            </div>

            <div className="space-y-6 relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-4 bottom-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

                {experience.map((item, index) => (
                    <Card key={item.id} className="relative md:ml-20 transition-all hover:shadow-md border-slate-200 hover:border-indigo-200 group">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[3.25rem] top-8 h-6 w-6 rounded-full border-4 border-white dark:border-slate-950 bg-indigo-500 shadow-sm hidden md:block group-hover:scale-110 transition-transform" />

                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-slate-900">{item.role}</h3>
                                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                                        <Building2 className="h-4 w-4" />
                                        {item.company}
                                        <span className="text-slate-300">•</span>
                                        <Badge variant="secondary" className="font-normal text-xs">
                                            {item.type}
                                        </Badge>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium mb-3">
                                <Calendar className="h-4 w-4" />
                                {item.period}
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mb-4 ml-1 pl-4 border-l-2 border-slate-100">
                                {item.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {item.skills.map(skill => (
                                    <Badge key={skill} variant="neutral" className="bg-slate-50 text-slate-600 border-slate-200">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Plus, Search, Tag, X, Sparkles, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type SkillCategory = 'Frontend' | 'Backend' | 'Tools' | 'Soft Skills';

export default function SkillsPage() {
    const [activeTab, setActiveTab] = useState<SkillCategory>('Frontend');

    // Mock data
    const [skills, setSkills] = useState([
        { id: 1, name: 'React', category: 'Frontend', level: 'Expert', icon: '⚛️' },
        { id: 2, name: 'TypeScript', category: 'Frontend', level: 'Advanced', icon: 'TS' },
        { id: 3, name: 'Tailwind CSS', category: 'Frontend', level: 'Expert', icon: '🎨' },
        { id: 4, name: 'Next.js', category: 'Frontend', level: 'Advanced', icon: '▲' },
        { id: 5, name: 'Node.js', category: 'Backend', level: 'Intermediate', icon: '🟢' },
        { id: 6, name: 'PostgreSQL', category: 'Backend', level: 'Intermediate', icon: '🐘' },
        { id: 7, name: 'Git', category: 'Tools', level: 'Advanced', icon: '📦' },
        { id: 8, name: 'Docker', category: 'Tools', level: 'Intermediate', icon: '🐳' },
    ]);

    const categories: SkillCategory[] = ['Frontend', 'Backend', 'Tools', 'Soft Skills'];

    const filteredSkills = skills.filter(s => s.category === activeTab);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Skills</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Manage your technical and soft skills. AI suggests skills based on your projects.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Sparkles className="h-4 w-4" />}>
                        AI Suggest
                    </Button>
                    <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                        Add Skill
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Categories Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === category
                                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300 shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                                }`}
                        >
                            {category}
                            <Badge variant={activeTab === category ? 'primary' : 'secondary'} className="h-5 w-auto px-1.5 ml-2">
                                {skills.filter(s => s.category === category).length}
                            </Badge>
                        </button>
                    ))}
                </div>

                {/* Skills Grid */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{activeTab} Skills</CardTitle>
                                <div className="relative w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input placeholder="Search skills..." className="pl-9 h-9" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredSkills.map(skill => (
                                    <div
                                        key={skill.id}
                                        className="group flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all bg-white"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-lg shadow-sm group-hover:bg-indigo-50 transition-colors">
                                                {skill.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-900">{skill.name}</h4>
                                                <span className="text-xs text-slate-500">{skill.level}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing">
                                                <GripVertical className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <button className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all text-slate-500 hover:text-indigo-600 h-[74px]">
                                    <Plus className="h-4 w-4" />
                                    <span className="font-medium">Add New Skill</span>
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Suggestions */}
                    <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-indigo-900">AI Suggested Skills</h3>
                                <p className="text-sm text-indigo-700/80 mt-1 mb-4">
                                    Based on your project "E-commerce Platform", you might want to add these skills:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {['Redux', 'Stripe API', 'SEO', 'Performance Optimization'].map(skill => (
                                        <button
                                            key={skill}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-sm font-medium text-indigo-700 shadow-sm hover:shadow-md hover:bg-indigo-50 transition-all border border-indigo-100"
                                        >
                                            <Plus className="h-3 w-3" />
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

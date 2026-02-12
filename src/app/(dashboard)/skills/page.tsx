'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Tag, X, Sparkles, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';

type SkillCategory = 'Frontend' | 'Backend' | 'Tools' | 'Soft Skills';

export default function SkillsPage() {
    const [activeTab, setActiveTab] = useState<SkillCategory>('Frontend');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [skills, setSkills] = useState<any[]>([]);

    const categories: SkillCategory[] = ['Frontend', 'Backend', 'Tools', 'Soft Skills'];
    const filteredSkills = skills.filter(s => s.category === activeTab);

    const [newSkill, setNewSkill] = useState({
        name: '',
        category: 'Frontend' as SkillCategory,
        level: 'Intermediate',
        icon: '🔹'
    });

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        setLoading(true);
        try {
            const { getSkills } = await import('@/actions/user-data');
            const data = await getSkills();
            setSkills(data);
        } catch (error) {
            console.error('Failed to load skills', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = async () => {
        const { createSkill } = await import('@/actions/user-data');
        const result = await createSkill({
            name: newSkill.name,
            category: newSkill.category,
            level: newSkill.level
        });

        if (result.success) {
            await loadSkills();
            setNewSkill({ name: '', category: activeTab, level: 'Intermediate', icon: '🔹' });
            setIsDialogOpen(false);
        } else {
            alert('Failed to add skill');
        }
    };

    const handleDeleteSkill = async (id: number) => {
        if (!confirm('Are you sure you want to delete this skill?')) return;
        const { deleteSkill } = await import('@/actions/user-data');
        const result = await deleteSkill(id);
        if (result.success) {
            setSkills(skills.filter(s => s.id !== id));
        }
    };

    const handleAISuggest = () => {
        // AI suggest logic - for now mocked or could be implemented later
        alert("AI suggestions coming soon!");
    };

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
                    <Button variant="outline" leftIcon={<Sparkles className="h-4 w-4" />} onClick={handleAISuggest}>
                        AI Suggest
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                                Add Skill
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Skill</DialogTitle>
                                <DialogDescription>
                                    Add a skill to your portfolio.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Skill Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. React"
                                        value={newSkill.name}
                                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="category">Category</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map((cat) => (
                                            <Badge
                                                key={cat}
                                                variant={newSkill.category === cat ? 'primary' : 'outline'}
                                                className="cursor-pointer"
                                                onClick={() => setNewSkill({ ...newSkill, category: cat, icon: cat === 'Frontend' ? '⚛️' : cat === 'Backend' ? '🟢' : '🔹' })}
                                            >
                                                {cat}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="level">Proficiency</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                                            <Badge
                                                key={level}
                                                variant={newSkill.level === level ? 'secondary' : 'outline'}
                                                className="cursor-pointer"
                                                onClick={() => setNewSkill({ ...newSkill, level })}
                                            >
                                                {level}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" variant="primary" onClick={handleAddSkill} disabled={!newSkill.name}>
                                    Save Skill
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
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
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteSkill(skill.id)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => setIsDialogOpen(true)}
                                    className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all text-slate-500 hover:text-indigo-600 h-[74px]"
                                >
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
                                            onClick={() => {
                                                // @ts-ignore
                                                setSkills([...skills, { id: Date.now(), name: skill, category: 'Frontend', level: 'Intermediate', icon: '🔹' }])
                                            }}
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

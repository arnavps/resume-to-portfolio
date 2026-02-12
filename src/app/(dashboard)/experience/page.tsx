'use client';

import { useState, useEffect } from 'react';
import { Plus, Briefcase, Calendar, Building2, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ExperiencePage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [experience, setExperience] = useState<any[]>([]);

    useEffect(() => {
        loadExperience();
    }, []);

    const loadExperience = async () => {
        setLoading(true);
        try {
            const { getExperience } = await import('@/actions/user-data');
            const data = await getExperience();
            setExperience(data);
        } catch (error) {
            console.error('Failed to load experience', error);
        } finally {
            setLoading(false);
        }
    };

    const [newExperience, setNewExperience] = useState({
        role: '',
        company: '',
        period: '',
        type: 'Full-time',
        description: '',
        skills: ''
    });

    const handleAddExperience = async () => {
        const { createExperience } = await import('@/actions/user-data');
        const skillsArray = newExperience.skills.split(',').map(s => s.trim()).filter(s => s !== '');

        const result = await createExperience({
            role: newExperience.role,
            company: newExperience.company,
            period: newExperience.period,
            type: newExperience.type,
            description: newExperience.description,
            skills: skillsArray
        });

        if (result.success) {
            await loadExperience();
            setNewExperience({ role: '', company: '', period: '', type: 'Full-time', description: '', skills: '' });
            setIsDialogOpen(false);
        } else {
            alert('Failed to save experience: ' + (result.error || 'Unknown error'));
        }
    };

    const handleDeleteExperience = async (id: number) => {
        if (!confirm('Are you sure you want to delete this experience?')) return;
        const { deleteExperience } = await import('@/actions/user-data');
        const result = await deleteExperience(id);
        if (result.success) {
            setExperience(experience.filter(e => e.id !== id));
        } else {
            alert('Failed to delete experience');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Experience</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Showcase your professional journey and career milestones.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                            Add Experience
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                            <DialogTitle>Add Experience</DialogTitle>
                            <DialogDescription>
                                Add your work experience, internships, or freelance projects.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="role">Role / Job Title</Label>
                                    <Input
                                        id="role"
                                        placeholder="e.g. Senior Developer"
                                        value={newExperience.role}
                                        onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="company">Company</Label>
                                    <Input
                                        id="company"
                                        placeholder="e.g. Google"
                                        value={newExperience.company}
                                        onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="period">Period</Label>
                                    <Input
                                        id="period"
                                        placeholder="e.g. 2022 - Present"
                                        value={newExperience.period}
                                        onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Input
                                        id="type"
                                        placeholder="e.g. Full-time"
                                        value={newExperience.type}
                                        onChange={(e) => setNewExperience({ ...newExperience, type: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your responsibilities and achievements..."
                                    value={newExperience.description}
                                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="skills">Skills Used (comma separated)</Label>
                                <Input
                                    id="skills"
                                    placeholder="React, Leadership, Agile"
                                    value={newExperience.skills}
                                    onChange={(e) => setNewExperience({ ...newExperience, skills: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="primary" onClick={handleAddExperience} disabled={!newExperience.role || !newExperience.company}>
                                Save Experience
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteExperience(item.id)}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
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
                                {item.skills && item.skills.map((skill: string) => (
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

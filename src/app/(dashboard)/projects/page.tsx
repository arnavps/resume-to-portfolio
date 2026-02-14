'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Folder, MoreVertical, Github, Globe, Calendar, X } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Textarea } from '@/components/ui/textarea';

export default function ProjectsPage() {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [search, setSearch] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        try {
            // Import dynamically to avoid server component issues if client component
            const { getProjects } = await import('@/actions/user-data');
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to load projects', error);
        } finally {
            setLoading(false);
        }
    };

    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        tags: '',
        status: 'Draft'
    });

    const handleAddProject = async () => {
        const { createProject } = await import('@/actions/user-data');
        const tagsArray = newProject.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        const result = await createProject({
            title: newProject.title,
            description: newProject.description,
            tags: tagsArray,
            status: newProject.status
        });

        if (result.success) {
            await loadProjects(); // Refresh list
            setNewProject({ title: '', description: '', tags: '', status: 'Draft' });
            setIsDialogOpen(false);
        } else {
            alert('Failed to create project: ' + (result.error || 'Unknown error'));
        }
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Projects</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Manage your portfolio projects and case studies.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                            Add Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                            <DialogTitle>Add New Project</DialogTitle>
                            <DialogDescription>
                                Add details about your project to showcase in your portfolio.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Project Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. E-commerce Dashboard"
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your project, technologies used, and your role..."
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tags">Tags (comma separated)</Label>
                                <Input
                                    id="tags"
                                    placeholder="React, Node.js, TypeScript"
                                    value={newProject.tags}
                                    onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <div className="flex gap-2">
                                    {['Draft', 'Published'].map((status) => (
                                        <Badge
                                            key={status}
                                            variant={newProject.status === status ? (status === 'Published' ? 'success' : 'secondary') : 'outline'}
                                            className="cursor-pointer"
                                            onClick={() => setNewProject({ ...newProject, status })}
                                        >
                                            {status}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="primary" onClick={handleAddProject} disabled={!newProject.title}>
                                Save Project
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search projects..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <Card key={project.id} className="group overflow-hidden border-slate-200 hover:border-indigo-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            <div className="h-40 bg-slate-100 relative group-hover:scale-105 transition-transform duration-500">
                                {/* Placeholder for project image */}
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                    <Folder className="h-10 w-10 opacity-20" />
                                </div>
                                <div className="absolute top-4 right-4">
                                    <Badge variant={project.status === 'Published' ? 'success' : 'neutral'}>
                                        {project.status}
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader className="p-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> Updated {project.updatedAt}
                                        </p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 pt-0">
                                <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag: string) => (
                                        <Badge key={tag} variant="secondary" className="font-normal">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="p-5 pt-0 mt-4 flex gap-2">
                                {project.repo_url && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        leftIcon={<Github className="h-3 w-3" />}
                                        onClick={() => window.open(project.repo_url, '_blank')}
                                    >
                                        Code
                                    </Button>
                                )}
                                {project.demo_url && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        leftIcon={<Globe className="h-3 w-3" />}
                                        onClick={() => window.open(project.demo_url, '_blank')}
                                    >
                                        Demo
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
                        <Search className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No projects found</h3>
                    <p className="text-slate-500 mt-1">
                        Try adjusting your search terms or add a new project.
                    </p>
                </div>
            )}
        </div>
    );
}

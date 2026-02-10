'use client';

import { usePortfolioStore } from '@/lib/store/usePortfolioStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ContentEditor() {
    const { data, updateData, updateProject, addProject, removeProject } = usePortfolioStore();

    const handleProjectChange = (index: number, field: string, value: string) => {
        updateProject(index, { [field]: value });
    };

    const handleAddProject = () => {
        addProject({
            id: Date.now(),
            title: 'New Project',
            description: 'Description of your new project.',
            tags: ['New'],
            link: '#'
        });
    };

    return (
        <div className="space-y-6">
            {/* Personal Details */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-900">Personal Details</h3>
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => updateData({ name: e.target.value })}
                        size={32}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                        id="title"
                        value={data.title}
                        onChange={(e) => updateData({ title: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                        id="bio"
                        value={data.bio}
                        onChange={(e) => updateData({ bio: e.target.value })}
                        className="h-24 resize-none"
                    />
                </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Projects */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-900">Projects</h3>
                    <Button variant="outline" size="sm" onClick={handleAddProject} className="h-8 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-2">
                    {data.projects.map((project, index) => (
                        <AccordionItem key={project.id} value={`item-${index}`} className="border rounded-lg px-3 bg-white">
                            <AccordionTrigger className="hover:no-underline py-3 text-sm">
                                <span className="font-medium truncate mr-2 text-left">{project.title}</span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-3 pt-2 pb-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Project Title</Label>
                                    <Input
                                        value={project.title}
                                        onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Description</Label>
                                    <Textarea
                                        value={project.description}
                                        onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                        className="h-20 text-sm resize-none"
                                    />
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeProject(index)}
                                        className="h-7 text-xs"
                                    >
                                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}

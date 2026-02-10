'use client';

import { useState } from 'react';
import { Search, LayoutTemplate, Star, Check, Eye, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';

import { Template, templates } from '@/lib/data/templates';


export default function TemplatesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

    const categories = ['All', 'Minimal', 'Creative', 'Professional'];

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Templates</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Choose a design foundation for your portfolio.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search templates..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Featured Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">Featured Theme</Badge>
                        <h2 className="text-3xl font-bold">Neo-Brutalism</h2>
                        <p className="text-indigo-100 text-lg max-w-md">
                            Stand out with high contrast, bold typography, and a distinct lack of shadows. Perfect for making a statement.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <Button className="bg-white text-indigo-600 hover:bg-indigo-50 border-0" size="lg">
                                Use This Template
                            </Button>
                            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10" size="lg" leftIcon={<Eye className="h-4 w-4" />}>
                                Preview
                            </Button>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="aspect-video bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-500 flex items-center justify-center">
                            <LayoutTemplate className="h-16 w-16 text-white/50" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                    <Card key={template.id} className="group overflow-hidden border-slate-200 transition-all hover:shadow-lg hover:border-indigo-200">
                        <div className="aspect-video bg-slate-100 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-slate-50">
                                <span className="sr-only">{template.name} Preview</span>
                                <LayoutTemplate className="h-12 w-12 opacity-20" />
                            </div>

                            {/* Badges */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                                {template.isPremium && (
                                    <Badge variant="accent" className="bg-amber-100 text-amber-700 shadow-sm border-amber-200">PRO</Badge>
                                )}
                                {template.isNew && (
                                    <Badge className="bg-emerald-500 text-white shadow-sm border-0">NEW</Badge>
                                )}
                                {template.isPopular && (
                                    <Badge className="bg-rose-500 text-white shadow-sm border-0 flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-current" /> HOT
                                    </Badge>
                                )}
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="secondary" size="sm" onClick={() => setPreviewTemplate(template)} leftIcon={<Eye className="h-4 w-4" />}>
                                            Preview
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden">
                                        <div className="p-4 border-b flex items-center justify-between bg-slate-50">
                                            <div>
                                                <DialogTitle>{previewTemplate?.name} Template</DialogTitle>
                                                <DialogDescription>{previewTemplate?.category} Collection</DialogDescription>
                                            </div>
                                            <Button size="sm" leftIcon={<Check className="h-4 w-4" />}>
                                                Select Template
                                            </Button>
                                        </div>
                                        <div className="flex-1 bg-slate-900 overflow-y-auto p-8 flex items-center justify-center">
                                            <div className="bg-white aspect-[9/16] md:aspect-video w-full max-w-3xl rounded-lg shadow-2xl flex items-center justify-center text-slate-300">
                                                <div className="text-center">
                                                    <LayoutTemplate className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                                    <p>Full Preview for {previewTemplate?.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{template.name}</CardTitle>
                                    <CardDescription>{template.category}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <p className="text-sm text-slate-500 line-clamp-2">
                                {template.description}
                            </p>
                        </CardContent>
                        <CardFooter className="p-4 border-t bg-slate-50/50">
                            <Button className="w-full" variant="outline" leftIcon={<Check className="h-4 w-4" />}>
                                Use Template
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { LayoutTemplate, Palette, Type, Layout, Eye, Save, Smartphone, Monitor, Tablet, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

export default function CustomizePage() {
    const [template, setTemplate] = useState('modern');
    const [colorTheme, setColorTheme] = useState('indigo');
    const [fontPair, setFontPair] = useState('inter');
    const [deviceView, setDeviceView] = useState('desktop');

    const templates = [
        { id: 'modern', name: 'Modern', image: '/templates/modern.png' },
        { id: 'minimal', name: 'Minimal', image: '/templates/minimal.png' },
        { id: 'creative', name: 'Creative', image: '/templates/creative.png' }
    ];

    const colors = [
        { id: 'indigo', name: 'Indigo', class: 'bg-indigo-500' },
        { id: 'emerald', name: 'Emerald', class: 'bg-emerald-500' },
        { id: 'rose', name: 'Rose', class: 'bg-rose-500' },
        { id: 'amber', name: 'Amber', class: 'bg-amber-500' },
        { id: 'slate', name: 'Slate', class: 'bg-slate-800' },
    ];

    const fonts = [
        { id: 'inter', name: 'Inter + Inter', class: 'font-sans' },
        { id: 'serif', name: 'Merriweather + Sans', class: 'font-serif' },
        { id: 'mono', name: 'Mono + Sans', class: 'font-mono' },
    ];

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 animate-fade-in">
            {/* Controls Panel */}
            <Card className="lg:w-96 flex flex-col h-full border-slate-200 shadow-xl z-10">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-xl">Customize Design</CardTitle>
                    <CardDescription>Personalize your portfolio style.</CardDescription>
                </CardHeader>
                <div className="flex-1 overflow-y-auto">
                    <Tabs defaultValue="templates" className="w-full">
                        <div className="px-6 pt-4">
                            <TabsList className="w-full grid grid-cols-3">
                                <TabsTrigger value="templates">Templates</TabsTrigger>
                                <TabsTrigger value="style">Style</TabsTrigger>
                                <TabsTrigger value="layout">Layout</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="templates" className="p-6 space-y-4">
                            <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                                <LayoutTemplate className="h-4 w-4" /> Select Template
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {templates.map(t => (
                                    <div
                                        key={t.id}
                                        onClick={() => setTemplate(t.id)}
                                        className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${template === t.id
                                                ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                                                : 'border-slate-200 hover:border-indigo-200'
                                            }`}
                                    >
                                        <div className="aspect-video bg-slate-100 relative">
                                            {/* Placeholder for template preview */}
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                                Image Placeholder
                                            </div>
                                            {template === t.id && (
                                                <div className="absolute top-2 right-2 bg-indigo-500 text-white p-1 rounded-full shadow-sm">
                                                    <Check className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3 bg-white">
                                            <span className="font-medium text-slate-900">{t.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="style" className="p-6 space-y-8">
                            {/* Colors */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                    <Palette className="h-4 w-4" /> Accent Color
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => setColorTheme(c.id)}
                                            className={`w-10 h-10 rounded-full ${c.class} shadow-sm transition-all flex items-center justify-center ${colorTheme === c.id ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'hover:scale-105'
                                                }`}
                                        >
                                            {colorTheme === c.id && <Check className="h-5 w-5 text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Fonts */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                    <Type className="h-4 w-4" /> Typography
                                </h3>
                                <div className="space-y-2">
                                    {fonts.map(f => (
                                        <div
                                            key={f.id}
                                            onClick={() => setFontPair(f.id)}
                                            className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${fontPair === f.id
                                                    ? 'border-indigo-500 bg-indigo-50/50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <span className={`text-sm ${f.class}`}>{f.name}</span>
                                            {fontPair === f.id && <Check className="h-4 w-4 text-indigo-600" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="layout" className="p-6">
                            <div className="text-center py-8 text-slate-500">
                                <Layout className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                <p>Layout options coming soon</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <Button className="w-full" size="lg" variant="primary" icon={<Save className="h-4 w-4" />}>
                        Save Changes
                    </Button>
                </div>
            </Card>

            {/* Preview Panel */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner">
                {/* Preview Toolbar */}
                <div className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <Badge variant="neutral" className="bg-slate-100 text-slate-600">
                            Live Preview
                        </Badge>
                    </div>
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setDeviceView('desktop')}
                            className={`p-1.5 rounded-md transition-all ${deviceView === 'desktop' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <Monitor className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setDeviceView('tablet')}
                            className={`p-1.5 rounded-md transition-all ${deviceView === 'tablet' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <Tablet className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setDeviceView('mobile')}
                            className={`p-1.5 rounded-md transition-all ${deviceView === 'mobile' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <Smartphone className="h-4 w-4" />
                        </button>
                    </div>
                    <Button variant="ghost" size="sm" rightIcon={<Eye className="h-4 w-4" />}>
                        Full Screen
                    </Button>
                </div>

                {/* Preview Viewport */}
                <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-dot-pattern">
                    <div
                        className={`bg-white shadow-2xl transition-all duration-500 ease-in-out border border-slate-200 overflow-hidden ${deviceView === 'desktop' ? 'w-full h-full max-w-[1200px] rounded-lg' :
                                deviceView === 'tablet' ? 'w-[768px] h-[1024px] rounded-2xl border-8 border-slate-800' :
                                    'w-[375px] h-[812px] rounded-3xl border-8 border-slate-800'
                            }`}
                    >
                        {/* Mock Content for Preview */}
                        <div className="w-full h-full overflow-y-auto custom-scrollbar">
                            <div className={`
                               h-64 flex items-center justify-center text-white
                               ${colorTheme === 'indigo' ? 'bg-indigo-600' :
                                    colorTheme === 'emerald' ? 'bg-emerald-600' :
                                        colorTheme === 'rose' ? 'bg-rose-600' :
                                            colorTheme === 'amber' ? 'bg-amber-600' :
                                                'bg-slate-800'}
                           `}>
                                <div className="text-center">
                                    <div className="inline-block p-1 bg-white/20 rounded-full mb-4 px-3 text-sm font-medium backdrop-blur-sm">
                                        Hire Me
                                    </div>
                                    <h1 className={`text-4xl font-bold mb-4 ${fontPair === 'serif' ? 'font-serif' :
                                            fontPair === 'mono' ? 'font-mono' : 'font-sans'
                                        }`}>
                                        Alex Developer
                                    </h1>
                                    <p className="text-white/80 max-w-md mx-auto">
                                        Building digital products, brands, and experiences.
                                    </p>
                                </div>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-6" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="h-32 bg-slate-100 rounded-lg animate-pulse" />
                                    <div className="h-32 bg-slate-100 rounded-lg animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

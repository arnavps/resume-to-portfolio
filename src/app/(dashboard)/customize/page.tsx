'use client';

import { useState, useEffect } from 'react';
import { LayoutTemplate, Palette, Type, Layout, Eye, Save, Smartphone, Monitor, Tablet, Check, ArrowRight, FileText, Loader2, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { ModernTemplate } from '@/components/templates/ModernTemplate';
import { MinimalTemplate } from '@/components/templates/MinimalTemplate';
import { CreativeTemplate } from '@/components/templates/CreativeTemplate';
import { usePortfolioStore } from '@/lib/store/usePortfolioStore';
import ContentEditor from '@/components/dashboard/ContentEditor';
import { savePortfolio } from '@/actions/save-portfolio';

export default function CustomizePage() {
    const {
        data,
        template,
        theme,
        font,
        deviceView,
        setTemplate,
        setTheme,
        setFont,
        setDeviceView
    } = usePortfolioStore();

    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const templates = [
        {
            id: 'modern',
            name: 'Modern',
            preview: (
                <div className="w-full h-full bg-slate-50 relative p-2 flex flex-col gap-1 overflow-hidden">
                    <div className="h-4 bg-white rounded-sm shadow-sm"></div>
                    <div className="flex gap-1">
                        <div className="flex-1 h-8 bg-white rounded-sm shadow-sm"></div>
                        <div className="w-4 h-8 bg-indigo-500 rounded-full opacity-20"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                        <div className="h-6 bg-white rounded-sm shadow-sm"></div>
                        <div className="h-6 bg-white rounded-sm shadow-sm"></div>
                    </div>
                </div>
            )
        },
        {
            id: 'minimal',
            name: 'Minimal',
            preview: (
                <div className="w-full h-full bg-white relative p-3 flex flex-col gap-2 overflow-hidden border border-slate-100">
                    <div className="h-2 w-1/2 bg-slate-900 rounded-full"></div>
                    <div className="h-1 w-3/4 bg-slate-200 rounded-full"></div>
                    <div className="h-px w-full bg-slate-100 my-1"></div>
                    <div className="flex flex-col gap-1">
                        <div className="h-1 w-full bg-slate-100 rounded-full"></div>
                        <div className="h-1 w-full bg-slate-100 rounded-full"></div>
                    </div>
                </div>
            )
        },
        {
            id: 'creative',
            name: 'Creative',
            preview: (
                <div className="w-full h-full bg-slate-950 relative flex overflow-hidden">
                    <div className="w-1/3 h-full bg-slate-900 p-1 flex flex-col gap-1 border-r border-slate-800">
                        <div className="w-6 h-1 bg-indigo-500 rounded-full mb-1"></div>
                        <div className="w-full h-2 bg-slate-800 rounded-sm"></div>
                        <div className="w-3/4 h-2 bg-slate-800 rounded-sm"></div>
                    </div>
                    <div className="w-2/3 h-full p-2 flex flex-col gap-1">
                        <div className="w-full h-8 bg-slate-900 rounded-md border border-slate-800"></div>
                        <div className="w-full h-8 bg-slate-900 rounded-md border border-slate-800"></div>
                    </div>
                </div>
            )
        }
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

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage('');
        try {
            const result = await savePortfolio(data, template, theme, font);
            if (result.success) {
                setSaveMessage('Saved successfully!');
                setTimeout(() => setSaveMessage(''), 3000);
            } else {
                setSaveMessage('Failed to save.');
            }
        } catch (error) {
            setSaveMessage('Error saving.');
        } finally {
            setIsSaving(false);
        }
    };

    const renderTemplate = () => {
        const props = { data, theme, font };
        switch (template) {
            case 'minimal': return <MinimalTemplate {...props} />;
            case 'creative': return <CreativeTemplate {...props} />;
            default: return <ModernTemplate {...props} />;
        }
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 animate-fade-in relative">
            {/* Controls Panel */}
            <div className={`${isSidebarOpen ? 'lg:w-96' : 'w-0 opacity-0 overflow-hidden'} transition-all duration-300 ease-in-out flex flex-col h-full z-20 flex-shrink-0`}>
                <Card className="h-full border-slate-200 shadow-xl flex flex-col">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-xl">Customize Design</CardTitle>
                        <CardDescription>Personalize your portfolio style.</CardDescription>
                    </CardHeader>
                    {/* ... content remains same ... */}
                    <div className="flex-1 overflow-y-auto">
                        <Tabs defaultValue="templates" className="w-full">
                            <div className="px-6 pt-4 sticky top-0 bg-white z-10 pb-2">
                                <TabsList className="w-full grid grid-cols-4">
                                    <TabsTrigger value="templates" className="text-xs px-1">Templates</TabsTrigger>
                                    <TabsTrigger value="content" className="text-xs px-1">Content</TabsTrigger>
                                    <TabsTrigger value="style" className="text-xs px-1">Style</TabsTrigger>
                                    <TabsTrigger value="layout" className="text-xs px-1">Layout</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="templates" className="p-6 space-y-4 pt-2">
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
                                            <div className="aspect-video bg-slate-100 relative group">
                                                {t.preview}
                                                {template === t.id && (
                                                    <div className="absolute top-2 right-2 bg-indigo-500 text-white p-1 rounded-full shadow-sm z-10">
                                                        <Check className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3 bg-white flex justify-between items-center">
                                                <span className="font-medium text-slate-900">{t.name}</span>
                                                {template === t.id && <Badge variant="secondary" className="text-[10px] h-5">Active</Badge>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="content" className="p-6 pt-2">
                                <div className="mb-4 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-slate-500" />
                                    <h3 className="text-sm font-medium text-slate-900">Edit Content</h3>
                                </div>
                                <ContentEditor />
                            </TabsContent>

                            <TabsContent value="style" className="p-6 space-y-8 pt-2">
                                {/* Colors */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                        <Palette className="h-4 w-4" /> Accent Color
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {colors.map(c => (
                                            <button
                                                key={c.id}
                                                onClick={() => setTheme(c.id)}
                                                className={`w-10 h-10 rounded-full ${c.class} shadow-sm transition-all flex items-center justify-center ${theme === c.id ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'hover:scale-105'
                                                    }`}
                                            >
                                                {theme === c.id && <Check className="h-5 w-5 text-white" />}
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
                                                onClick={() => setFont(f.id)}
                                                className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${font === f.id
                                                    ? 'border-indigo-500 bg-indigo-50/50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                <span className={`text-sm ${f.class}`}>{f.name}</span>
                                                {font === f.id && <Check className="h-4 w-4 text-indigo-600" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="layout" className="p-6 pt-2">
                                <div className="text-center py-8 text-slate-500">
                                    <Layout className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                    <p>Layout options coming soon</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                        <Button
                            className="w-full"
                            size="lg"
                            variant="primary"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {saveMessage || 'Save Changes'}
                                </>
                            )}
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Preview Panel */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner relative">
                {/* Preview Toolbar */}
                <div className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-10 relative">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="mr-2"
                            title={isSidebarOpen ? "Expand Preview" : "Show Controls"}
                        >
                            {isSidebarOpen ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                        </Button>
                        <Badge variant="neutral" className="bg-slate-100 text-slate-600">
                            Live Preview
                        </Badge>
                    </div>
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setDeviceView('desktop')}
                            className={`p-1.5 rounded-md transition-all ${deviceView === 'desktop' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                            title="Desktop"
                        >
                            <Monitor className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setDeviceView('tablet')}
                            className={`p-1.5 rounded-md transition-all ${deviceView === 'tablet' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                            title="Tablet"
                        >
                            <Tablet className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setDeviceView('mobile')}
                            className={`p-1.5 rounded-md transition-all ${deviceView === 'mobile' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                            title="Mobile"
                        >
                            <Smartphone className="h-4 w-4" />
                        </button>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        rightIcon={<ExternalLink className="h-4 w-4" />}
                        onClick={() => window.open('/portfolio/demo-user', '_blank')}
                    >
                        Open Live
                    </Button>
                </div>

                {/* Preview Viewport */}
                <div className="flex-1 overflow-y-auto custom-scrollbar flex items-start justify-center p-8 bg-dot-pattern relative">
                    <div
                        className="transition-transform duration-300 ease-in-out origin-top mb-10"
                        style={{
                            transform: `scale(${deviceView === 'tablet' ? 0.65 : deviceView === 'mobile' ? 0.85 : 1})`,
                            marginTop: deviceView !== 'desktop' ? '20px' : '0'
                        }}
                    >
                        <div
                            className={`bg-white shadow-2xl transition-all duration-500 ease-in-out border border-slate-200 overflow-hidden ${deviceView === 'desktop' ? 'w-full h-full max-w-[1200px] rounded-lg' :
                                deviceView === 'tablet' ? 'w-[768px] h-[1024px] rounded-2xl border-8 border-slate-800' :
                                    'w-[375px] h-[812px] rounded-3xl border-8 border-slate-800'
                                }`}
                        >
                            {/* Render Selected Template */}
                            <div className="w-full h-full overflow-y-auto custom-scrollbar">
                                {renderTemplate()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

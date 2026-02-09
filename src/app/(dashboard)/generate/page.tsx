'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, ArrowRight, Wand2, Search, FileText, Globe, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress'; // If available, otherwise use custom

export default function GeneratePage() {
    const [generating, setGenerating] = useState(false);
    const [complete, setComplete] = useState(false);
    const [currentStage, setCurrentStage] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const stages = [
        { name: 'Analyzing Data Sources', icon: Search, detail: 'Scanning GitHub repos and Resume...' },
        { name: 'Structuring Content', icon: FileText, detail: 'Creating project descriptions and bio...' },
        { name: 'Optimizing SEO', icon: Globe, detail: 'Injecting keywords and meta tags...' },
        { name: 'Finalizing Design', icon: Wand2, detail: 'Applying theme and layout...' }
    ];

    const startGeneration = async () => {
        setGenerating(true);
        setComplete(false);
        setCurrentStage(0);
        setError(null);

        try {
            // Simulate generation process
            for (let i = 0; i < stages.length; i++) {
                setCurrentStage(i);
                await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds per stage
            }

            setComplete(true);
            setGenerating(false);
        } catch (err) {
            console.error('Generation error:', err);
            setError('An error occurred during generation. Please try again.');
            setGenerating(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 animate-fade-in-up">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-gradient-primary rounded-2xl shadow-lg mb-6">
                    <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                    Generate Your Portfolio
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                    Our AI will analyze your connected data and build a professional, SEO-optimized portfolio website in seconds.
                </p>
            </div>

            <Card className="border-indigo-100 shadow-xl dark:border-indigo-900/50 overflow-hidden">
                {!generating && !complete && (
                    <div className="p-8 text-center space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                <Search className="h-6 w-6 text-indigo-500 mb-3" />
                                <h3 className="font-semibold mb-1">Deep Analysis</h3>
                                <p className="text-sm text-slate-500">Extracts key skills and impact from your work history.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                <FileText className="h-6 w-6 text-purple-500 mb-3" />
                                <h3 className="font-semibold mb-1">Smart Writing</h3>
                                <p className="text-sm text-slate-500">Generates compelling project narratives and bio.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                <Globe className="h-6 w-6 text-emerald-500 mb-3" />
                                <h3 className="font-semibold mb-1">SEO Optimized</h3>
                                <p className="text-sm text-slate-500">Built to rank high on Google and job boards.</p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                size="xl"
                                variant="primary"
                                className="w-full md:w-auto min-w-[200px] shadow-indigo-500/25 shadow-lg"
                                onClick={startGeneration}
                                rightIcon={<Wand2 className="h-5 w-5" />}
                            >
                                Start Formatting
                            </Button>
                            <p className="text-xs text-slate-400 mt-4">
                                * Takes approximately 30-60 seconds
                            </p>
                        </div>
                    </div>
                )}

                {generating && (
                    <div className="p-12">
                        <div className="max-w-md mx-auto space-y-8">
                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-indigo-600">Generating...</span>
                                    <span className="text-slate-500">{Math.min((currentStage + 1) * 25, 95)}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-primary transition-all duration-700 ease-out rounded-full relative"
                                        style={{ width: `${(currentStage + 1) * 25}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                                    </div>
                                </div>
                            </div>

                            {/* Stages List */}
                            <div className="space-y-4">
                                {stages.map((stage, index) => {
                                    const isActive = index === currentStage;
                                    const isDone = index < currentStage;
                                    const isPending = index > currentStage;

                                    return (
                                        <div
                                            key={index}
                                            className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${isActive ? 'bg-indigo-50 border border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800 translate-x-2' : 'opacity-60'
                                                }`}
                                        >
                                            <div className={`
                                                w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors
                                                ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' :
                                                    isActive ? 'border-indigo-500 text-indigo-600 animate-spin-slow-subtle' :
                                                        'border-slate-200 text-slate-300'}
                                            `}>
                                                {isDone ? <CheckCircle2 className="h-5 w-5" /> :
                                                    isActive ? <Loader2 className="h-5 w-5 animate-spin" /> :
                                                        <span className="text-xs font-bold">{index + 1}</span>}
                                            </div>
                                            <div>
                                                <h4 className={`font-medium ${isActive ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-500'}`}>
                                                    {stage.name}
                                                </h4>
                                                {isActive && (
                                                    <p className="text-xs text-indigo-600/80 dark:text-indigo-400 mt-0.5 animate-fade-in">
                                                        {stage.detail}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {complete && (
                    <div className="p-12 text-center animate-scale-in">
                        <div className="inline-flex items-center justify-center p-4 bg-emerald-100 text-emerald-600 rounded-full mb-6">
                            <CheckCircle2 className="h-12 w-12" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Portfolio Generated!</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            Your professional portfolio has been successfully created. You can now preview it live or customize the design.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/preview">
                                <Button size="lg" variant="primary" rightIcon={<Eye className="h-5 w-5" />}>
                                    View Live Preview
                                </Button>
                            </Link>
                            <Link href="/dashboard/customize">
                                <Button size="lg" variant="outline" rightIcon={<ArrowRight className="h-5 w-5" />}>
                                    Customize Design
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

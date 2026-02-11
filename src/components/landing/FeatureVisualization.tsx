
import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Check, Github, FileText, ArrowUpRight } from 'lucide-react';

interface FeatureVisualizationProps {
    type: 'ai' | 'github' | 'ats';
    className?: string;
}

export function FeatureVisualization({ type, className }: FeatureVisualizationProps) {
    return (
        <div className={cn("w-full h-full relative overflow-hidden", className)}>
            {type === 'ai' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 bg-white rounded-xl shadow-lg border border-indigo-100 p-4 relative z-10 transform -rotate-2">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div className="w-24 h-2 bg-slate-100 rounded-full" />
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="w-full h-2 bg-slate-100 rounded-full" />
                            <div className="w-5/6 h-2 bg-slate-100 rounded-full" />
                            <div className="w-4/6 h-2 bg-slate-100 rounded-full" />
                        </div>
                        <div className="w-full h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-50/50 p-3">
                            <div className="animate-pulse space-y-2">
                                <div className="w-3/4 h-2 bg-indigo-200/50 rounded-full" />
                                <div className="w-1/2 h-2 bg-indigo-200/50 rounded-full" />
                            </div>
                        </div>
                        {/* Floating elements */}
                        <div className="absolute -top-4 -right-4 bg-white p-2 rounded-lg shadow-md border border-slate-100 animate-bounce-subtle">
                            <Sparkles className="w-6 h-6 text-amber-400 fill-amber-400" />
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200/20 via-purple-200/20 to-pink-200/20 blur-xl" />
                </div>
            )}

            {type === 'github' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-[320px] bg-slate-900 rounded-xl shadow-xl border border-slate-800 p-4 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Github className="w-5 h-5 text-white" />
                                <span className="text-slate-400 text-xs font-mono">user/project</span>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-slate-700" />
                                <div className="w-2 h-2 rounded-full bg-slate-700" />
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-4">
                            {[...Array(28)].map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "w-full aspect-square rounded-sm",
                                        i % 2 === 0 ? "bg-emerald-500/80" :
                                            i % 3 === 0 ? "bg-emerald-500/40" :
                                                i % 5 === 0 ? "bg-emerald-500/20" : "bg-slate-800"
                                    )}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg border border-slate-700">
                            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                            <span className="text-xs text-indigo-300 font-mono">Repo synced successfully</span>
                        </div>
                    </div>
                </div>
            )}

            {type === 'ats' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                        {/* Circle Background */}
                        <div className="w-48 h-48 rounded-full border-[12px] border-slate-100 flex items-center justify-center bg-white shadow-xl relative z-10">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-slate-800">98</div>
                                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">ATS Score</div>
                            </div>
                        </div>
                        {/* Progress Arc (Simplified as border for now) */}
                        <svg className="absolute top-0 left-0 w-48 h-48 rotate-[-90deg] z-20 pointer-events-none drop-shadow-lg">
                            <circle
                                cx="96"
                                cy="96"
                                r="84"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="12"
                                strokeDasharray="527"
                                strokeDashoffset="40"
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* Floating Checkmarks */}
                        <div className="absolute top-0 -right-8 bg-white px-3 py-1.5 rounded-full shadow-lg border border-emerald-100 flex items-center gap-1.5 animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-xs font-medium text-slate-600">Keywords</span>
                        </div>
                        <div className="absolute bottom-4 -left-6 bg-white px-3 py-1.5 rounded-full shadow-lg border border-emerald-100 flex items-center gap-1.5 animate-bounce-subtle" style={{ animationDelay: '0.5s' }}>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-xs font-medium text-slate-600">Formatting</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

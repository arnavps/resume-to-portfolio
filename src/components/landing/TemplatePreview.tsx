
import React from 'react';
import { cn } from '@/lib/utils';

interface TemplatePreviewProps {
    category: 'Minimal' | 'Creative' | 'Professional';
    className?: string;
}

export function TemplatePreview({ category, className }: TemplatePreviewProps) {
    return (
        <div className={cn("w-full h-full bg-slate-50 relative overflow-hidden", className)}>
            {category === 'Professional' && (
                <div className="absolute inset-0 flex">
                    {/* Sidebar */}
                    <div className="w-1/4 h-full bg-slate-900 flex flex-col gap-2 p-2">
                        <div className="w-8 h-8 rounded-full bg-slate-700 mb-4" />
                        <div className="w-full h-2 rounded bg-slate-800" />
                        <div className="w-2/3 h-2 rounded bg-slate-800" />
                        <div className="w-3/4 h-2 rounded bg-slate-800" />
                    </div>
                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col gap-3">
                        <div className="w-1/3 h-4 rounded bg-slate-200 mb-2" />
                        <div className="w-full h-24 rounded bg-slate-100 border border-slate-200" />
                        <div className="grid grid-cols-2 gap-2">
                            <div className="h-16 rounded bg-slate-100 border border-slate-200" />
                            <div className="h-16 rounded bg-slate-100 border border-slate-200" />
                        </div>
                    </div>
                </div>
            )}

            {category === 'Minimal' && (
                <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-200 mb-4" />
                    <div className="w-3/4 h-4 rounded bg-slate-900 mb-2" />
                    <div className="w-1/2 h-3 rounded bg-slate-400 mb-6" />
                    <div className="w-full h-px bg-slate-200 my-2" />
                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded bg-slate-100" />
                        <div className="w-8 h-8 rounded bg-slate-100" />
                        <div className="w-8 h-8 rounded bg-slate-100" />
                    </div>
                </div>
            )}

            {category === 'Creative' && (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
                    <div className="grid grid-cols-2 gap-3 h-full">
                        <div className="col-span-1 row-span-2 bg-white rounded-lg shadow-sm" />
                        <div className="bg-indigo-100 rounded-lg" />
                        <div className="bg-purple-100 rounded-lg" />
                    </div>

                    {/* Floating elements */}
                    <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-xl" />
                    <div className="absolute bottom-8 left-8 w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 opacity-20 blur-xl" />
                </div>
            )}
        </div>
    );
}

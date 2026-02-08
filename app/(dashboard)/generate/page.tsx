'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function GeneratePage() {
    const [generating, setGenerating] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [currentStage, setCurrentStage] = useState('');
    const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!jobId) return;

        const subscription = supabase
            .channel('generation_jobs')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'generation_jobs',
                    filter: `id=eq.${jobId}`
                },
                (payload) => {
                    const job = payload.new;
                    setProgress(job.progress);
                    setCurrentStage(job.current_stage);
                    setStatus(job.status);
                    if (job.error_message) {
                        setError(job.error_message);
                    }
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [jobId]);

    const startGeneration = async () => {
        try {
            setGenerating(true);
            setStatus('processing');
            setError('');

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Get or create portfolio
            let { data: portfolio } = await supabase
                .from('portfolios')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!portfolio) {
                const { data: newPortfolio, error: createError } = await supabase
                    .from('portfolios')
                    .insert({
                        user_id: user.id,
                        subdomain: user.email?.split('@')[0] || 'portfolio'
                    })
                    .select()
                    .single();

                if (createError) throw createError;
                portfolio = newPortfolio;
            }

            // Start generation
            const response = await fetch('/api/generate/portfolio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    portfolioId: portfolio.id,
                    options: {
                        minStars: 0,
                        maxProjects: 10,
                        targetRole: 'Software Engineer'
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Generation failed');
            }

            const result = await response.json();

            if (result.success) {
                setStatus('completed');
            }
        } catch (err: any) {
            console.error('Generation error:', err);
            setError(err.message);
            setStatus('failed');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Generate Portfolio</h1>
                <p className="text-gray-600 mb-8">
                    Use AI to automatically create your professional portfolio from your connected data sources
                </p>

                {status === 'idle' && (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-10 h-10 text-lime-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Ready to Generate</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Our AI will analyze your GitHub repositories, resume, and LinkedIn profile to create a compelling portfolio with project narratives, skills analysis, and ATS optimization.
                        </p>
                        <button
                            onClick={startGeneration}
                            disabled={generating}
                            className="bg-lime-400 text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-lime-500 transition disabled:opacity-50"
                        >
                            Start Generation
                        </button>
                    </div>
                )}

                {status === 'processing' && (
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">{currentStage || 'Initializing...'}</span>
                                <span className="text-gray-600">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-lime-400 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <StageItem name="Fetching Data Sources" completed={progress > 10} />
                            <StageItem name="Analyzing GitHub" completed={progress > 20} />
                            <StageItem name="Processing Resume" completed={progress > 30} />
                            <StageItem name="Generating Project Narratives" completed={progress > 40} />
                            <StageItem name="Creating About Section" completed={progress > 60} />
                            <StageItem name="Analyzing Code Quality" completed={progress > 75} />
                            <StageItem name="ATS Optimization" completed={progress > 85} />
                            <StageItem name="Generating Coaching" completed={progress > 95} />
                        </div>
                    </div>
                )}

                {status === 'completed' && (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Portfolio Generated!</h2>
                        <p className="text-gray-600 mb-8">
                            Your portfolio has been successfully created. You can now customize it or preview it.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <a
                                href="/dashboard/customize"
                                className="bg-gray-100 text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                            >
                                Customize Design
                            </a>
                            <a
                                href="/dashboard/preview"
                                className="bg-lime-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-lime-500 transition"
                            >
                                Preview Portfolio →
                            </a>
                        </div>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Generation Failed</h2>
                        <p className="text-gray-600 mb-8">{error || 'An error occurred during generation'}</p>
                        <button
                            onClick={() => {
                                setStatus('idle');
                                setError('');
                                setProgress(0);
                            }}
                            className="bg-lime-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-lime-500 transition"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function StageItem({ name, completed }: { name: string; completed: boolean }) {
    return (
        <div className="flex items-center gap-3">
            {completed ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            )}
            <span className={completed ? 'text-gray-900' : 'text-gray-500'}>{name}</span>
        </div>
    );
}

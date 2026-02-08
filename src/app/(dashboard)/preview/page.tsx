'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Eye, ExternalLink, Smartphone, Tablet, Monitor, Share2, Rocket, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function PreviewPage() {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [portfolioData, setPortfolioData] = useState<any>(null);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setPortfolioData({
        name: 'Alex Developer',
        role: 'Full Stack Engineer',
        bio: 'Building digital products that make a difference.',
        completed: true
      });
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-slate-500 animate-pulse">Generating preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -m-8">
      {/* Toolbar */}
      <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 relative z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
          </Link>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">Professional Portfolio</span>
            <Badge variant="success" className="h-5">Ready</Badge>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-2 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            title="Desktop View"
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('tablet')}
            className={`p-2 rounded-md transition-all ${viewMode === 'tablet' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            title="Tablet View"
          >
            <Tablet className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-2 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            title="Mobile View"
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/customize">
            <Button variant="outline" size="sm">
              Customize
            </Button>
          </Link>
          <Button variant="outline" size="sm" icon={<Share2 className="h-4 w-4" />}>
            Share
          </Button>
          <Button variant="primary" size="sm" icon={<Rocket className="h-4 w-4" />}>
            Publish Live
          </Button>
        </div>
      </div>

      {/* Viewport Area */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-950 overflow-hidden relative flex items-center justify-center p-8 bg-dot-pattern">
        <div
          className={`bg-white shadow-2xl transition-all duration-500 ease-in-out border border-slate-200 overflow-hidden relative group ${viewMode === 'desktop' ? 'w-full h-full max-w-[1200px] rounded-lg' :
              viewMode === 'tablet' ? 'w-[768px] h-[1024px] max-h-full rounded-2xl border-8 border-slate-800' :
                'w-[375px] h-[812px] max-h-full rounded-3xl border-8 border-slate-800'
            }`}
        >
          {/* Live Preview Overlay (Only for visualization in dashboard) */}
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="sm" icon={<ExternalLink className="h-4 w-4" />}>
              Open in New Tab
            </Button>
          </div>

          {/* IFrame or Component Rendering */}
          <iframe
            src="/" // In real app, this would be /portfolio/[id]
            className="w-full h-full bg-white"
            title="Portfolio Preview"
          />
        </div>
      </div>
    </div>
  );
}

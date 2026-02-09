'use client';

import { useState } from 'react';
import { Smartphone, Tablet, Monitor, ExternalLink, Share2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function PreviewPage() {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const portfolioUrl = '/demo-user'; // In a real app, this would be the actual user's portfolio URL

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-950 -m-8">
      {/* Toolbar */}
      <div className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-md transition-all ${device === 'mobile' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              title="Mobile View"
            >
              <Smartphone className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-2 rounded-md transition-all ${device === 'tablet' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              title="Tablet View"
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-md transition-all ${device === 'desktop' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              title="Desktop View"
            >
              <Monitor className="h-4 w-4" />
            </button>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
          <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:inline-block">
            {device === 'mobile' ? 'Mobile Portrait (375px)' : device === 'tablet' ? 'Tablet Portrait (768px)' : 'Desktop (100%)'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ExternalLink className="h-4 w-4" />}
            onClick={() => window.open(portfolioUrl, '_blank')}
          >
            Full Screen
          </Button>
          <Link href="/customize">
            <Button variant="outline" size="sm">
              Customize
            </Button>
          </Link>
          <Link href="/share">
            <Button variant="outline" size="sm" leftIcon={<Share2 className="h-4 w-4" />}>
              Share
            </Button>
          </Link>
          <Button size="sm" variant="primary" leftIcon={<ArrowRight className="h-4 w-4" />}>
            Publish Live
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden flex items-center justify-center bg-slate-100/50 dark:bg-black/20 p-8">
        <div
          className={cn(
            "bg-white transition-all duration-500 ease-in-out shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800",
            device === 'mobile' ? "w-[375px] h-[667px] rounded-[3rem] border-8 border-slate-900" :
              device === 'tablet' ? "w-[768px] h-[1024px] rounded-[2rem] border-8 border-slate-900" :
                "w-full h-full rounded-lg"
          )}
        >
          <iframe
            src={portfolioUrl}
            className="w-full h-full bg-white"
            title="Portfolio Preview"
          />
        </div>
      </div>
    </div>
  );
}

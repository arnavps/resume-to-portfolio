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
import { getUserSubdomain } from '@/actions/user';

export default function CustomizePage() {
    // ... existing hooks ...
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [portfolioUrl, setPortfolioUrl] = useState('/portfolio/demo-user');

    useEffect(() => {
        async function fetchSubdomain() {
            const subdomain = await getUserSubdomain();
            if (subdomain) {
                setPortfolioUrl(`/portfolio/${subdomain}`);
            }
        }
        fetchSubdomain();
    }, []);

    // ... templates, colors, fonts definitions ...

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage('');
        try {
            const result = await savePortfolio(data, template, theme, font);
            if (result.success) {
                setSaveMessage('Saved successfully!');
                setTimeout(() => setSaveMessage(''), 3000);
            } else {
                setSaveMessage(result.error || 'Failed to save.');
            }
        } catch (error: any) {
            setSaveMessage(error.message || 'Error saving.');
        } finally {
            setIsSaving(false);
        }
    };

    // ... renderTemplate ...

    return (
        // ... (lines 127-306)
        <Button
            variant="ghost"
            size="sm"
            rightIcon={<ExternalLink className="h-4 w-4" />}
            onClick={() => window.open(portfolioUrl, '_blank')}
        >
            Open Live
        </Button>
                </div >

        {/* Preview Viewport */ }
        < div className = "flex-1 overflow-y-auto custom-scrollbar flex items-start justify-center p-8 bg-dot-pattern relative" >
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
                </div >
            </div >
        </div >
    );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Github, Upload, Linkedin, CheckCircle2, Loader2, ArrowRight, FileText, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ConnectPage() {
    const [githubConnected, setGithubConnected] = useState(false);
    const [resumeUploaded, setResumeUploaded] = useState(false);
    const [linkedinUploaded, setLinkedinUploaded] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);

    useEffect(() => {
        const checkConnections = async () => {
            const { getUserConnections } = await import('@/actions/user-data');
            const connections = await getUserConnections();
            if (connections) {
                setGithubConnected(connections.github);
                setLinkedinUploaded(connections.linkedin);
            }
        };
        checkConnections();
    }, []);


    const connectGitHub = () => {
        window.location.href = '/api/auth/github';
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'linkedin') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(type);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`/api/upload/${type}`, { method: 'POST', body: formData });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            if (type === 'resume') {
                setResumeUploaded(true);
                // Trigger Data Application
                const { applyResumeData } = await import('@/actions/resume');
                const result = await applyResumeData();
                if (result.error) {
                    console.error('Failed to apply resume data:', result.error);
                } else {
                    console.log('Resume data applied:', result.results);
                }
            }
            if (type === 'linkedin') setLinkedinUploaded(true);

        } catch (error) {
            console.error(`Error uploading ${type}:`, error);
        } finally {
            setUploading(null);
        }
    };

    // Auto-sync GitHub when connected
    useEffect(() => {
        if (githubConnected) {
            import('@/actions/github').then(({ syncGithubRepositories }) => {
                syncGithubRepositories().then(res => {
                    if (res.error) console.error('GitHub sync failed:', res.error);
                    else console.log('GitHub sync success:', res.count, 'repos');
                });
            });
        }
    }, [githubConnected]);

    const allConnected = githubConnected || resumeUploaded || linkedinUploaded;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Connect Data Sources</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                    Link your professional profiles to automatically generate your portfolio content.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GitHub Card */}
                <Card className={`border-2 transition-all ${githubConnected ? 'border-emerald-500/50 bg-emerald-50/10' : 'border-slate-200 hover:border-indigo-200'}`}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-slate-900 rounded-xl text-white">
                                <Github className="h-6 w-6" />
                            </div>
                            {githubConnected && (
                                <Badge variant="success" icon={<CheckCircle2 className="h-3 w-3" />}>Connected</Badge>
                            )}
                        </div>
                        <CardTitle className="mt-4">GitHub</CardTitle>
                        <CardDescription>
                            Import your public repositories, contribution graph, and coding languages.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-sm text-slate-500 space-y-2 mb-4">
                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Repository details & stars</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Contribution statistics</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Language breakdown</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        {githubConnected ? (
                            <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800">
                                Sync Settings
                            </Button>
                        ) : (
                            <Button variant="primary" className="w-full" onClick={connectGitHub}>
                                Connect GitHub
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                {/* Resume Upload Card */}
                <Card className={`border-2 transition-all ${resumeUploaded ? 'border-emerald-500/50 bg-emerald-50/10' : 'border-slate-200 hover:border-indigo-200'}`}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-blue-600 rounded-xl text-white">
                                <FileText className="h-6 w-6" />
                            </div>
                            {resumeUploaded && (
                                <Badge variant="success" icon={<CheckCircle2 className="h-3 w-3" />}>Uploaded</Badge>
                            )}
                        </div>
                        <CardTitle className="mt-4">Resume / CV</CardTitle>
                        <CardDescription>
                            Upload your PDF resume to extract work experience, education, and skills.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-sm text-slate-500 space-y-2 mb-4">
                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Work history parsing</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Education timeline</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Skills extraction</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        {resumeUploaded ? (
                            <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800">
                                View Parsed Data
                            </Button>
                        ) : (
                            <div className="w-full">
                                <input
                                    id="resume-upload"
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, 'resume')}
                                    disabled={!!uploading}
                                />
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => document.getElementById('resume-upload')?.click()}
                                    loading={uploading === 'resume'}
                                    leftIcon={<Upload className="h-4 w-4" />}
                                >
                                    Upload PDF
                                </Button>
                            </div>
                        )}
                    </CardFooter>
                </Card>

                {/* LinkedIn Card */}
                <Card className={`border-2 transition-all ${linkedinUploaded ? 'border-emerald-500/50 bg-emerald-50/10' : 'border-slate-200 hover:border-indigo-200'}`}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-[#0A66C2] rounded-xl text-white">
                                <Linkedin className="h-6 w-6" />
                            </div>
                            {linkedinUploaded && (
                                <Badge variant="success" icon={<CheckCircle2 className="h-3 w-3" />}>Imported</Badge>
                            )}
                        </div>
                        <CardTitle className="mt-4">LinkedIn</CardTitle>
                        <CardDescription>
                            Import your LinkedIn profile PDF to augment your professional summary.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-sm text-slate-500 space-y-2 mb-4">
                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Professional summary</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Endorsements & recommendations</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Certifications</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        {linkedinUploaded ? (
                            <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800">
                                Update Data
                            </Button>
                        ) : (
                            <div className="w-full">
                                <input
                                    id="linkedin-upload"
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, 'linkedin')}
                                    disabled={!!uploading}
                                />
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => document.getElementById('linkedin-upload')?.click()}
                                    loading={uploading === 'linkedin'}
                                    leftIcon={<Upload className="h-4 w-4" />}
                                >
                                    Upload PDF Export
                                </Button>
                            </div>
                        )}
                    </CardFooter>
                </Card>

                {/* Custom/Manual Card */}
                <Card className="border-2 border-dashed border-slate-200 hover:border-indigo-200 transition-colors bg-slate-50/50">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-amber-500 rounded-xl text-white">
                                <Globe className="h-6 w-6" />
                            </div>
                        </div>
                        <CardTitle className="mt-4">Manual Entry</CardTitle>
                        <CardDescription>
                            Want to add details manually? You can always edit your portfolio directly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-500 mb-4">
                            Perfect for custom projects, freelance work, or skills that aren't listed on your other profiles.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link href="/projects" className="w-full">
                            <Button variant="ghost" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                                Go to Content Manager
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>

            {/* Next Steps CTA */}
            {allConnected && (
                <div className="sticky bottom-6 animate-slide-up">
                    <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20" />
                        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                    Data Sources Connected
                                </h3>
                                <p className="text-slate-400 mt-1">
                                    You're ready to generate your AI portfolio!
                                </p>
                            </div>
                            <Link href="/generate">
                                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="h-5 w-5" />} className="shadow-lg shadow-indigo-500/25">
                                    Generate Portfolio Now
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

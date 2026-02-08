'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Github, Upload, Linkedin, CheckCircle, Loader2 } from 'lucide-react';

export default function ConnectPage() {
    const [githubConnected, setGithubConnected] = useState(false);
    const [resumeUploaded, setResumeUploaded] = useState(false);
    const [linkedinUploaded, setLinkedinUploaded] = useState(false);
    const [uploading, setUploading] = useState(false);

    const connectGitHub = () => {
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
        const redirectUri = `${window.location.origin}/api/auth/github`;
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user,repo`;
    };

    const uploadResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload/resume', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                setResumeUploaded(true);
            }
        } catch (error) {
            console.error('Error uploading resume:', error);
        } finally {
            setUploading(false);
        }
    };

    const uploadLinkedIn = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload/linkedin', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                setLinkedinUploaded(true);
            }
        } catch (error) {
            console.error('Error uploading LinkedIn:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Connect Data Sources</h1>
                <p className="text-gray-600 mb-8">
                    Connect your professional profiles to automatically generate your portfolio
                </p>

                <div className="space-y-6">
                    {/* GitHub */}
                    <DataSourceCard
                        icon={<Github className="w-8 h-8" />}
                        title="GitHub"
                        description="Import your repositories and contribution history"
                        connected={githubConnected}
                        onConnect={connectGitHub}
                        color="black"
                    />

                    {/* Resume */}
                    <DataSourceCard
                        icon={<Upload className="w-8 h-8" />}
                        title="Resume (PDF)"
                        description="Upload your resume to extract experience and education"
                        connected={resumeUploaded}
                        onConnect={() => document.getElementById('resume-upload')?.click()}
                        color="blue"
                    />
                    <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={uploadResume}
                        disabled={uploading}
                    />

                    {/* LinkedIn */}
                    <DataSourceCard
                        icon={<Linkedin className="w-8 h-8" />}
                        title="LinkedIn (PDF)"
                        description="Upload your LinkedIn profile export"
                        connected={linkedinUploaded}
                        onConnect={() => document.getElementById('linkedin-upload')?.click()}
                        color="blue"
                    />
                    <input
                        id="linkedin-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={uploadLinkedIn}
                        disabled={uploading}
                    />
                </div>

                {uploading && (
                    <div className="mt-8 flex items-center justify-center gap-2 text-gray-600">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Uploading and processing...</span>
                    </div>
                )}

                {(githubConnected || resumeUploaded || linkedinUploaded) && (
                    <div className="mt-8 bg-lime-50 border border-lime-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-2">Ready to Generate!</h3>
                        <p className="text-gray-600 mb-4">
                            You've connected at least one data source. Head to the Generate page to create your portfolio.
                        </p>
                        <a
                            href="/dashboard/generate"
                            className="inline-block bg-lime-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-lime-500 transition"
                        >
                            Generate Portfolio →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

function DataSourceCard({ icon, title, description, connected, onConnect, color }: any) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${color === 'black' ? 'bg-black text-white' : 'bg-blue-50 text-blue-600'}`}>
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-lg">{title}</h3>
                    <p className="text-gray-600 text-sm">{description}</p>
                </div>
            </div>

            {connected ? (
                <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Connected</span>
                </div>
            ) : (
                <button
                    onClick={onConnect}
                    className="bg-lime-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-lime-500 transition"
                >
                    Connect
                </button>
            )}
        </div>
    );
}

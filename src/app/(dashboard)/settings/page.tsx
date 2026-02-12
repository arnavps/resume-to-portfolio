'use client';

import { useState, useEffect } from 'react';
import { User, Globe, Shield, CreditCard, Save, Upload, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function SettingsPage() {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [portfolio, setPortfolio] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setMounted(true);
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const { getSettings } = await import('@/actions/settings');
            const data = await getSettings();
            if (data) {
                setUser(data.user);
                setPortfolio(data.portfolio);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const { updateProfile } = await import('@/actions/settings');
            const result = await updateProfile(user);
            if (result.success) {
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile: ' + result.error);
            }
        } catch (error) {
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const handleSavePortfolio = async () => {
        setSaving(true);
        try {
            const { updatePortfolioSettings } = await import('@/actions/settings');
            const result = await updatePortfolioSettings(portfolio);
            if (result.success) {
                alert('Portfolio settings updated successfully!');
            } else {
                alert('Failed to update portfolio: ' + result.error);
            }
        } catch (error) {
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (!mounted || loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
                <div className="h-8 w-48 bg-slate-200 rounded"></div>
                <div className="h-4 w-96 bg-slate-200 rounded"></div>
                <div className="h-10 w-full bg-slate-200 rounded mt-6"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Manage your profile, portfolio preferences, and account settings.
                </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>

                {/* Profile Settings */}
                <TabsContent value="profile" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Public Profile</CardTitle>
                            <CardDescription>This information will be displayed on your portfolio.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="relative h-24 w-24 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-md">
                                    <div className="flex items-center justify-center h-full w-full text-2xl font-bold text-slate-400">
                                        {user?.fullName?.charAt(0) || user?.email?.charAt(0)}
                                    </div>
                                </div>
                                <div>
                                    <Button variant="outline" size="sm" onClick={() => alert('Avatar upload not implemented yet')}>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Change Avatar
                                    </Button>
                                    <p className="text-xs text-slate-500 mt-2">
                                        JPG, GIF or PNG. 1MB max.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-900">Full Name</label>
                                    <Input
                                        value={user?.fullName || ''}
                                        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-900">Job Title</label>
                                    <Input
                                        value={user?.jobTitle || ''}
                                        onChange={(e) => setUser({ ...user, jobTitle: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">Bio</label>
                                <textarea
                                    className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={user?.bio || ''}
                                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4 pt-4">
                                <h4 className="text-sm font-semibold text-slate-900">Social Links</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Github className="h-5 w-5 text-slate-500" />
                                        <Input
                                            placeholder="GitHub Username"
                                            value={user?.socials?.github || ''}
                                            onChange={(e) => setUser({ ...user, socials: { ...user.socials, github: e.target.value } })}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Linkedin className="h-5 w-5 text-blue-600" />
                                        <Input
                                            placeholder="LinkedIn URL"
                                            value={user?.socials?.linkedin || ''}
                                            onChange={(e) => setUser({ ...user, socials: { ...user.socials, linkedin: e.target.value } })}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-5 w-5 text-slate-500" />
                                        <Input value={user?.email || ''} disabled />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 flex justify-end">
                            <Button variant="primary" onClick={handleSaveProfile} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Profile'}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Portfolio Settings */}
                <TabsContent value="portfolio" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Domain & SEO</CardTitle>
                            <CardDescription>Configure how your portfolio appears on the web.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">Subdomain</label>
                                <div className="flex items-center">
                                    <span className="bg-slate-100 border border-slate-200 text-slate-500 px-3 py-2 rounded-l-md text-sm border-r-0">
                                        folio.ai/
                                    </span>
                                    <Input
                                        className="rounded-l-none"
                                        value={portfolio?.subdomain || ''}
                                        onChange={(e) => setPortfolio({ ...portfolio, subdomain: e.target.value })}
                                    />
                                </div>
                                <p className="text-xs text-slate-500">
                                    Your portfolio is live at <a href={`https://folio.ai/${portfolio?.subdomain}`} className="text-indigo-600 hover:underline">folio.ai/{portfolio?.subdomain}</a>
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-semibold text-slate-900">Custom Domain</h4>
                                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">PRO Feature</Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="www.yourdomain.com"
                                        value={portfolio?.customDomain || ''}
                                        onChange={(e) => setPortfolio({ ...portfolio, customDomain: e.target.value })}
                                    />
                                    <Button variant="secondary">Verify</Button>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h4 className="text-sm font-semibold text-slate-900">SEO Settings</h4>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-900">Meta Title</label>
                                    <Input
                                        value={portfolio?.seoTitle || ''}
                                        onChange={(e) => setPortfolio({ ...portfolio, seoTitle: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-900">Meta Description</label>
                                    <Input
                                        value={portfolio?.seoDescription || ''}
                                        onChange={(e) => setPortfolio({ ...portfolio, seoDescription: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 flex justify-end">
                            <Button variant="primary" onClick={handleSavePortfolio} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Settings'}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Account Settings */}
                <TabsContent value="account" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Security</CardTitle>
                            <CardDescription>Manage your account credentials and security.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">Email Address</label>
                                <Input value={user?.email || ''} disabled />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h4 className="text-sm font-semibold text-slate-900">Change Password</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-900">Current Password</label>
                                        <Input type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-900">New Password</label>
                                        <Input type="password" />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button variant="outline">Update Password</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-200">
                        <CardHeader>
                            <CardTitle className="text-red-600">Danger Zone</CardTitle>
                            <CardDescription>Irreversible account actions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-slate-900">Delete Account</h4>
                                    <p className="text-sm text-slate-500">Permanently remove your account and all data.</p>
                                </div>
                                <Button variant="destructive">Delete Account</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Billing Settings */}
                <TabsContent value="billing" className="space-y-6 mt-6">
                    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-white">Free Plan</CardTitle>
                                    <CardDescription className="text-slate-300">Basic portfolio features</CardDescription>
                                </div>
                                <Badge className="bg-white/10 text-white border-0">Current</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-6">$0<span className="text-base font-normal text-slate-400">/mo</span></div>
                            <ul className="space-y-2 text-sm text-slate-300">
                                <li className="flex items-center gap-2"><Globe className="h-4 w-4" /> 1 Portfolio</li>
                                <li className="flex items-center gap-2"><Github className="h-4 w-4" /> Basic GitHub Integration</li>
                                <li className="flex items-center gap-2"><Shield className="h-4 w-4" /> Standard Support</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="primary" className="w-full bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-all">
                                Upgrade to Pro
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Billing History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-6 text-slate-500">
                                <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                <p>No billing history available.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

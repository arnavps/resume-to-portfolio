import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Github, FileText, Palette, BarChart3, Zap, Shield, ArrowRight, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image src="/logo.svg" alt="Folio.ai" width={140} height={40} className="h-10 w-auto" />
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="#features" className="text-slate-600 hover:text-indigo-600 transition font-medium">
                                Features
                            </Link>
                            <Link href="#templates" className="text-slate-600 hover:text-indigo-600 transition font-medium">
                                Templates
                            </Link>
                            <Link href="#pricing" className="text-slate-600 hover:text-indigo-600 transition font-medium">
                                Pricing
                            </Link>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="md">Dashboard</Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button variant="primary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                                    Get Started Free
                                </Button>
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-hero bg-dot-pattern py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge variant="primary" icon={<Sparkles className="h-3 w-3" />} className="mb-6 animate-fade-in">
                            AI-Powered Portfolio Generation
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance animate-slide-up">
                            Build Your Dream Portfolio in{' '}
                            <span className="bg-gradient-primary bg-clip-text text-transparent">Minutes with AI</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto text-balance animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Connect your GitHub, upload your resume, and let AI create a professional portfolio website in minutes. No coding required.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Link href="/dashboard">
                                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                                    Generate Your Portfolio
                                </Button>
                            </Link>
                            <Link href="#templates">
                                <Button variant="secondary" size="lg">
                                    View Templates
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-600 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-primary border-2 border-white" />
                                ))}
                            </div>
                            <span className="font-medium">Join 10,000+ developers</span>
                        </div>
                    </div>
                </div>
                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
                    <div className="w-6 h-10 rounded-full border-2 border-slate-300 flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-slate-400 rounded-full" />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="features" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
                    <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
                        Three simple steps to create your professional portfolio
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
                        {/* Connection Lines (Desktop Only) */}
                        <div className="hidden md:block absolute top-20 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200" style={{ width: 'calc(66.666% - 4rem)', left: 'calc(16.666% + 2rem)' }} />

                        <FeatureCard
                            number="1"
                            icon={<Github className="w-8 h-8" />}
                            title="Connect Your Data"
                            description="Link your GitHub, upload your resume, and connect LinkedIn to import your professional history."
                            gradient="from-indigo-500 to-indigo-600"
                        />
                        <FeatureCard
                            number="2"
                            icon={<Sparkles className="w-8 h-8" />}
                            title="AI Generation"
                            description="Our AI analyzes your work and creates compelling project narratives, skills analysis, and optimized content."
                            gradient="from-purple-500 to-purple-600"
                        />
                        <FeatureCard
                            number="3"
                            icon={<Palette className="w-8 h-8" />}
                            title="Customize & Publish"
                            description="Choose from beautiful templates, customize colors, and publish your portfolio with a custom domain."
                            gradient="from-indigo-500 to-purple-600"
                        />
                    </div>
                </div>
            </section>

            {/* Features/Benefits */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-16">Everything You Need to Stand Out</h2>
                    <div className="max-w-6xl mx-auto space-y-24">
                        <FeatureRow
                            title="AI-Powered Content Generation"
                            description="Let AI craft compelling narratives that showcase your best work"
                            benefits={[
                                "Smart project descriptions that highlight your impact",
                                "Professional career summaries tailored to your experience",
                                "Optimized keywords for better discoverability"
                            ]}
                            imageAlt="AI Generation"
                            reverse={false}
                        />
                        <FeatureRow
                            title="Seamless GitHub Integration"
                            description="Automatically sync your repositories and showcase your coding journey"
                            benefits={[
                                "Real-time repository sync with contribution analysis",
                                "Code quality insights and best practices detection",
                                "Automatic updates when you push new code"
                            ]}
                            imageAlt="GitHub Integration"
                            reverse={true}
                        />
                        <FeatureRow
                            title="ATS Optimization Built-In"
                            description="Get past applicant tracking systems and land more interviews"
                            benefits={[
                                "Instant ATS score with actionable improvements",
                                "Keyword optimization for your target roles",
                                "Format that recruiters and hiring managers love"
                            ]}
                            imageAlt="ATS Optimization"
                            reverse={false}
                        />
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">Why Developers Choose Folio.ai</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        <StatCard
                            icon={<Zap className="w-6 h-6" />}
                            stat="< 2 min"
                            label="Average generation time"
                        />
                        <StatCard
                            icon={<Sparkles className="w-6 h-6" />}
                            stat="95%"
                            label="AI accuracy rate"
                        />
                        <StatCard
                            icon={<BarChart3 className="w-6 h-6" />}
                            stat="85+"
                            label="Average ATS score"
                        />
                        <StatCard
                            icon={<Shield className="w-6 h-6" />}
                            stat="24/7"
                            label="Auto-sync updates"
                        />
                    </div>
                </div>
            </section>

            {/* Templates Preview */}
            <section id="templates" className="py-20 bg-gradient-hero">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-4">Choose Your Style</h2>
                    <p className="text-center text-slate-600 mb-12">
                        Beautiful, responsive templates designed for developers
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {['Modern', 'Minimal', 'Creative'].map((template) => (
                            <Card key={template} interactive className="overflow-hidden group">
                                <div className="aspect-[4/3] bg-gradient-to-br from-indigo-100 to-purple-100 relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-semibold">
                                        {template} Template Preview
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-xl mb-2">{template}</h3>
                                    <Badge variant="primary" className="mb-3">Free</Badge>
                                    <p className="text-slate-600 text-sm mb-4">
                                        Perfect for showcasing your projects with a {template.toLowerCase()} aesthetic
                                    </p>
                                    <Button variant="ghost" size="sm" className="w-full group-hover:bg-indigo-50">
                                        Use This Template
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Link href="/templates">
                            <Button variant="secondary" size="lg">
                                View All Templates
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">What Developers Are Saying</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {testimonials.map((testimonial, i) => (
                            <Card key={i} className="p-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-slate-700 mb-4 italic">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-primary" />
                                    <div>
                                        <p className="font-semibold text-sm">{testimonial.name}</p>
                                        <p className="text-xs text-slate-600">{testimonial.role}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gradient-hero">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-12 shadow-2xl border border-slate-200">
                        <h2 className="text-4xl font-bold text-center mb-4">Ready to Stand Out?</h2>
                        <p className="text-xl text-center text-slate-600 mb-8">
                            Join 10,000+ developers who've created stunning portfolios with AI
                        </p>
                        <div className="flex justify-center mb-6">
                            <Link href="/dashboard">
                                <Button variant="primary" size="xl" rightIcon={<ArrowRight className="h-5 w-5" />}>
                                    Get Started Free
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                                <Check className="w-4 h-4 text-emerald-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Shield className="w-4 h-4 text-indigo-500" />
                                <span>SSL Secure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="font-bold mb-4">Product</h3>
                            <ul className="space-y-2 text-slate-400">
                                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                                <li><Link href="#templates" className="hover:text-white transition">Templates</Link></li>
                                <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Resources</h3>
                            <ul className="space-y-2 text-slate-400">
                                <li><Link href="/docs" className="hover:text-white transition">Documentation</Link></li>
                                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                                <li><Link href="/support" className="hover:text-white transition">Support</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Company</h3>
                            <ul className="space-y-2 text-slate-400">
                                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Legal</h3>
                            <ul className="space-y-2 text-slate-400">
                                <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
                        <p>© 2024 Folio.ai. Built with AI for developers.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ number, icon, title, description, gradient }: any) {
    return (
        <div className="relative">
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg relative z-10`}>
                    {icon}
                </div>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-lg z-20">
                    {number}
                </div>
                <h3 className="font-bold text-xl mb-2 mt-4">{title}</h3>
                <p className="text-slate-600">{description}</p>
            </div>
        </div>
    );
}

function FeatureRow({ title, description, benefits, imageAlt, reverse }: any) {
    return (
        <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
            <div className="flex-1">
                <h3 className="text-3xl font-bold mb-4">{title}</h3>
                <p className="text-lg text-slate-600 mb-6">{description}</p>
                <ul className="space-y-3">
                    {benefits.map((benefit: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700">{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex-1">
                <div className="aspect-[4/3] bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl shadow-xl flex items-center justify-center">
                    <span className="text-slate-400 font-semibold">{imageAlt}</span>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, stat, label }: any) {
    return (
        <div className="text-center">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                {icon}
            </div>
            <div className="text-4xl font-bold mb-2">{stat}</div>
            <div className="text-slate-400 text-sm">{label}</div>
        </div>
    );
}

const testimonials = [
    {
        quote: "Folio.ai helped me land my dream job at a FAANG company. The AI-generated content was spot-on!",
        name: "Alex Chen",
        role: "Software Engineer at Google"
    },
    {
        quote: "I went from no portfolio to a professional website in under 5 minutes. Absolutely incredible!",
        name: "Sarah Johnson",
        role: "Full Stack Developer"
    },
    {
        quote: "The ATS optimization feature is a game-changer. I'm getting 3x more interview requests now.",
        name: "Michael Rodriguez",
        role: "Frontend Developer"
    }
];

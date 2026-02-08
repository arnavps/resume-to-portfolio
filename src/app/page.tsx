import Link from 'next/link';
import { Sparkles, Github, FileText, Palette, BarChart3, Zap, Shield } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-lime-50 to-white">
            {/* Header */}
            <header className="container mx-auto px-4 py-6">
                <nav className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <span className="font-bold text-xl">PortfolioGen</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-gray-600 hover:text-black transition">
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard"
                            className="bg-lime-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-lime-500 transition"
                        >
                            Get Started
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero */}
            <section className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-lime-100 px-4 py-2 rounded-full mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-semibold">AI-Powered Portfolio Generation</span>
                    </div>
                    <h1 className="text-6xl font-bold mb-6">
                        Turn Your Digital Footprint Into a
                        <span className="text-lime-600"> Stunning Portfolio</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Connect your GitHub, upload your resume, and let AI create a professional portfolio website in minutes. No coding required.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/dashboard"
                            className="bg-lime-400 text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-lime-500 transition"
                        >
                            Generate Your Portfolio →
                        </Link>
                        <Link
                            href="/templates"
                            className="bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition border-2 border-gray-200"
                        >
                            View Templates
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="container mx-auto px-4 py-20">
                <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <FeatureCard
                        icon={<Github className="w-8 h-8" />}
                        title="Connect Your Data"
                        description="Link your GitHub, upload your resume, and connect LinkedIn to import your professional history."
                        color="black"
                    />
                    <FeatureCard
                        icon={<Sparkles className="w-8 h-8" />}
                        title="AI Generation"
                        description="Our AI analyzes your work and creates compelling project narratives, skills analysis, and optimized content."
                        color="lime"
                    />
                    <FeatureCard
                        icon={<Palette className="w-8 h-8" />}
                        title="Customize & Publish"
                        description="Choose from beautiful templates, customize colors, and publish your portfolio with a custom domain."
                        color="purple"
                    />
                </div>
            </section>

            {/* Benefits */}
            <section className="bg-black text-white py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">Why PortfolioGen?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        <BenefitCard
                            icon={<Zap className="w-6 h-6" />}
                            title="Lightning Fast"
                            description="Generate a complete portfolio in under 2 minutes"
                        />
                        <BenefitCard
                            icon={<Sparkles className="w-6 h-6" />}
                            title="AI-Powered"
                            description="Smart narratives that showcase your best work"
                        />
                        <BenefitCard
                            icon={<BarChart3 className="w-6 h-6" />}
                            title="ATS Optimized"
                            description="Get higher scores from applicant tracking systems"
                        />
                        <BenefitCard
                            icon={<Shield className="w-6 h-6" />}
                            title="Always Updated"
                            description="Auto-sync with GitHub to keep projects current"
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-3xl mx-auto bg-lime-400 rounded-3xl p-12">
                    <h2 className="text-4xl font-bold mb-4">Ready to Stand Out?</h2>
                    <p className="text-xl mb-8">
                        Join thousands of developers who've created stunning portfolios with AI
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-block bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-900 transition"
                    >
                        Get Started Free →
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-8">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    <p>© 2024 PortfolioGen. Built with AI for developers.</p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description, color }: any) {
    const colorClasses = {
        black: 'bg-black text-white',
        lime: 'bg-lime-400 text-black',
        purple: 'bg-purple-500 text-white'
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className={`w-16 h-16 ${colorClasses[color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                {icon}
            </div>
            <h3 className="font-bold text-xl mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}

function BenefitCard({ icon, title, description }: any) {
    return (
        <div className="text-center">
            <div className="w-12 h-12 bg-lime-400 text-black rounded-lg flex items-center justify-center mx-auto mb-4">
                {icon}
            </div>
            <h3 className="font-bold mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    );
}

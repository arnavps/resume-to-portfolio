import Link from 'next/link';
import { Mail, Github, Linkedin, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock Data (In a real app, this would be fetched based on the subdomain/ID)
const portfolioData = {
    name: "Alex Dev",
    title: "Senior Full Stack Developer",
    bio: "Passionate about building scalable web applications and intuitive user experiences. Specialized in React, Node.js, and cloud architecture.",
    location: "San Francisco, CA",
    socials: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "mailto:alex@example.com"
    },
    skills: {
        frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        backend: ["Node.js", "PostgreSQL", "GraphQL", "Redis"],
        tools: ["Git", "Docker", "AWS", "Figma"]
    },
    projects: [
        {
            id: 1,
            title: "E-commerce Platform",
            description: "A full-stack e-commerce solution with Next.js and Stripe. Features include real-time inventory, secure checkout, and admin dashboard.",
            tags: ["Next.js", "TypeScript", "Stripe"],
            link: "#"
        },
        {
            id: 2,
            title: "Task Management App",
            description: "Real-time collaboration tool for remote teams. specialized for agile workflows with Kanban boards and sprint planning.",
            tags: ["React", "Firebase", "Tailwind"],
            link: "#"
        },
        {
            id: 3,
            title: "Fitness Tracker API",
            description: "RESTful API for tracking workouts and nutrition. Built with scalability in mind using microservices architecture.",
            tags: ["Node.js", "Express", "PostgreSQL"],
            link: "#"
        }
    ],
    experience: [
        {
            id: 1,
            role: "Senior Frontend Developer",
            company: "TechCorp Inc.",
            period: "2022 - Present",
            description: "Leading the frontend migration to Next.js and implementing a new design system. Improved site performance by 40%."
        },
        {
            id: 2,
            role: "Full Stack Engineer",
            company: "StartupX",
            period: "2020 - 2022",
            description: "Built scalable APIs and interactive UI for a fintech product. Mentored junior developers and established code quality standards."
        }
    ]
};

export default function PortfolioPage({ params }: { params: { subdomain: string } }) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header / Hero */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
                            {portfolioData.name}
                        </h1>
                        <p className="text-xl md:text-2xl text-indigo-600 font-medium">
                            {portfolioData.title}
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            {portfolioData.bio}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-slate-500 pt-2">
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {portfolioData.location}
                            </span>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button className="rounded-full" leftIcon={<Mail className="h-4 w-4" />}>
                                Contact
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full">
                                <Github className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="hidden md:block w-32 h-32 md:w-48 md:h-48 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-lg">
                        {/* Avatar Placeholder */}
                        <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-600" />
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-16 space-y-20">

                {/* Skills Section */}
                <section>
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        Technical Skills
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="pb-3"><CardTitle className="text-lg">Frontend</CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {portfolioData.skills.frontend.map(skill => (
                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3"><CardTitle className="text-lg">Backend</CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {portfolioData.skills.backend.map(skill => (
                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3"><CardTitle className="text-lg">Tools</CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {portfolioData.skills.tools.map(skill => (
                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Projects Section */}
                <section>
                    <h2 className="text-2xl font-bold mb-8">Featured Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {portfolioData.projects.map(project => (
                            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200">
                                <div className="h-48 bg-slate-100 flex items-center justify-center text-slate-300">
                                    Display Image
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>
                                        {project.link && (
                                            <a href={project.link} className="text-indigo-600 hover:text-indigo-700">
                                                <ExternalLink className="h-5 w-5" />
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-slate-600 mb-4 line-clamp-3">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map(tag => (
                                            <Badge key={tag} variant="outline" className="font-normal">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Experience Section */}
                <section>
                    <h2 className="text-2xl font-bold mb-8">Experience</h2>
                    <div className="space-y-8 relative border-l-2 border-slate-200 ml-3 pl-8 pb-4">
                        {portfolioData.experience.map((job) => (
                            <div key={job.id} className="relative">
                                <div className="absolute -left-[39px] top-1 h-5 w-5 rounded-full border-4 border-white bg-indigo-600" />
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                    <h3 className="text-lg font-bold text-slate-900">{job.role}</h3>
                                    <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                        {job.period}
                                    </span>
                                </div>
                                <div className="text-indigo-600 font-medium mb-2">{job.company}</div>
                                <p className="text-slate-600">
                                    {job.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-5xl mx-auto px-6 text-center text-slate-500">
                    <p>&copy; {new Date().getFullYear()} {portfolioData.name}. All rights reserved.</p>
                    <p className="text-sm mt-2">Built with Folio.ai</p>
                </div>
            </footer>
        </div>
    );
}

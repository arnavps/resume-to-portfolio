
import { Mail, Github, Linkedin, ExternalLink, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PortfolioData } from '@/lib/data/mockData';

interface TemplateProps {
    data: PortfolioData;
    theme: string;
    font: string;
}

export const ModernTemplate = ({ data, theme, font }: TemplateProps) => {
    // Helper to get theme class
    const getThemeColor = () => {
        switch (theme) {
            case 'emerald': return 'text-emerald-600';
            case 'rose': return 'text-rose-600';
            case 'amber': return 'text-amber-600';
            case 'slate': return 'text-slate-800';
            default: return 'text-indigo-600'; // indigo
        }
    };

    const getThemeBg = () => {
        switch (theme) {
            case 'emerald': return 'bg-emerald-600';
            case 'rose': return 'bg-rose-600';
            case 'amber': return 'bg-amber-600';
            case 'slate': return 'bg-slate-800';
            default: return 'bg-indigo-600'; // indigo
        }
    }

    const fontClass = font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans';
    const themeColor = getThemeColor();
    const themeBg = getThemeBg();

    return (
        <div className={`min-h-full bg-slate-50 text-slate-900 ${fontClass}`}>
            {/* Header / Hero */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
                            {data.name}
                        </h1>
                        <p className={`text-xl md:text-2xl font-medium ${themeColor}`}>
                            {data.title}
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            {data.bio}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-slate-500 pt-2">
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {data.location}
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
                        <div className={`w-full h-full ${themeBg}`} />
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
                                    {data.skills.frontend.map(skill => (
                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3"><CardTitle className="text-lg">Backend</CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.backend.map(skill => (
                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3"><CardTitle className="text-lg">Tools</CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.tools.map(skill => (
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
                        {data.projects.map(project => (
                            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200">
                                <div className="h-48 bg-slate-100 flex items-center justify-center text-slate-300">
                                    Display Image
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>
                                        {project.link && (
                                            <a href={project.link} className={`${themeColor} hover:underline`}>
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
                        {data.experience.map((job) => (
                            <div key={job.id} className="relative">
                                <div className={`absolute -left-[39px] top-1 h-5 w-5 rounded-full border-4 border-white ${themeBg}`} />
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                    <h3 className="text-lg font-bold text-slate-900">{job.role}</h3>
                                    <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                        {job.period}
                                    </span>
                                </div>
                                <div className={`${themeColor} font-medium mb-2`}>{job.company}</div>
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
                    <p>&copy; {new Date().getFullYear()} {data.name}. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}


import { Mail, Github, Linkedin, ExternalLink, MapPin, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PortfolioData } from '@/lib/data/mockData';

interface TemplateProps {
    data: PortfolioData;
    theme: string;
    font: string;
}

export const CreativeTemplate = ({ data, theme, font }: TemplateProps) => {

    // Creative uses bold dark mode by default
    const getThemeColor = () => {
        switch (theme) {
            case 'emerald': return 'text-emerald-400';
            case 'rose': return 'text-rose-400';
            case 'amber': return 'text-amber-400';
            case 'slate': return 'text-slate-400';
            default: return 'text-indigo-400'; // indigo
        }
    };

    const getThemeBg = () => {
        switch (theme) {
            case 'emerald': return 'bg-emerald-500';
            case 'rose': return 'bg-rose-500';
            case 'amber': return 'bg-amber-500';
            case 'slate': return 'bg-slate-500';
            default: return 'bg-indigo-500'; // indigo
        }
    }

    const fontClass = font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans';
    const themeColor = getThemeColor();
    const themeBg = getThemeBg();

    return (
        <div className={`min-h-full bg-slate-950 text-white ${fontClass}`}>

            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">

                {/* Sidebar / Left Panel */}
                <aside className="lg:col-span-4 bg-slate-900 p-8 lg:p-12 flex flex-col justify-between border-r border-slate-800">
                    <div>
                        <div className={`w-20 h-2 rounded-full mb-8 ${themeBg}`} />
                        <h1 className="text-5xl font-black tracking-tight mb-4 leading-tight">
                            HELLO, I'M <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">{data.name.toUpperCase()}</span>
                        </h1>
                        <p className={`text-xl font-bold ${themeColor} mb-6`}>{data.title}</p>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">{data.bio}</p>

                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                                <Mail className="h-4 w-4 mr-2" /> Contact
                            </Button>
                            <Button variant="ghost" className="text-slate-300 hover:text-white">
                                <Github className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="mt-12 lg:mt-0">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Core Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {[...data.skills.frontend, ...data.skills.backend].slice(0, 8).map(s => (
                                <span key={s} className="px-3 py-1 bg-slate-800 rounded-md text-sm text-slate-300 border border-slate-700">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-8 p-8 lg:p-12 overflow-y-auto">

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                        {data.projects.map((project, i) => (
                            <div key={project.id} className={`group relative bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-slate-600 transition-colors ${i === 0 ? 'md:col-span-2' : ''}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-lg bg-slate-800 ${themeColor}`}>
                                        <ArrowUpRight className="h-6 w-6" />
                                    </div>
                                    <div className="flex gap-2">
                                        {project.tags.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-xs text-slate-500">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors">{project.title}</h3>
                                <p className="text-slate-400 mb-6">{project.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Timeline */}
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-4">
                        <span className={`w-8 h-1 ${themeBg}`}></span>
                        Experience
                    </h2>

                    <div className="space-y-12 pl-4 border-l border-slate-800 ml-4">
                        {data.experience.map(job => (
                            <div key={job.id} className="relative pl-8">
                                <div className={`absolute -left-[5px] top-2 w-2 h-2 rounded-full ${themeBg}`} />
                                <h3 className="text-xl font-bold text-white mb-1">{job.role}</h3>
                                <div className="flex items-center gap-3 text-sm mb-3">
                                    <span className={themeColor}>{job.company}</span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-slate-500">{job.period}</span>
                                </div>
                                <p className="text-slate-400">{job.description}</p>
                            </div>
                        ))}
                    </div>

                </main>

            </div>
        </div>
    );
}

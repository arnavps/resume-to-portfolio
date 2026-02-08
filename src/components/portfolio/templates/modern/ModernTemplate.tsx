'use client'

import { useState, useEffect } from 'react'
import { Github, Linkedin, Mail, ExternalLink, Calendar, MapPin } from 'lucide-react'

interface ModernTemplateProps {
  portfolioData: any
  isPreview?: boolean
}

export default function ModernTemplate({ portfolioData, isPreview = false }: ModernTemplateProps) {
  const [activeSection, setActiveSection] = useState('about')

  const {
    user,
    projects = [],
    experiences = [],
    skills = [],
    education = [],
    portfolio_content = [],
    seo_title,
    seo_description
  } = portfolioData || {}

  const aboutContent = portfolio_content?.find((c: any) => c.section_type === 'about')
  const heroTagline = aboutContent?.metadata?.hero_tagline || 'Software Developer'
  const aboutText = aboutContent?.content || ''

  const featuredProjects = projects.filter((p: any) => p.is_featured).slice(0, 3)
  const allSkills = skills.sort((a: any, b: any) => b.proficiency_level - a.proficiency_level)

  if (isPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <TemplateContent 
              portfolioData={portfolioData}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              featuredProjects={featuredProjects}
              allSkills={allSkills}
              aboutContent={aboutContent}
              heroTagline={heroTagline}
              aboutText={aboutText}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TemplateContent 
        portfolioData={portfolioData}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        featuredProjects={featuredProjects}
        allSkills={allSkills}
        aboutContent={aboutContent}
        heroTagline={heroTagline}
        aboutText={aboutText}
      />
    </div>
  )
}

function TemplateContent({ 
  portfolioData,
  activeSection,
  setActiveSection,
  featuredProjects,
  allSkills,
  aboutContent,
  heroTagline,
  aboutText
}: any) {
  const { user, experiences = [], education = [] } = portfolioData || {}

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">
              {user?.full_name || 'Portfolio'}
            </h1>
            <div className="flex gap-6">
              {['about', 'projects', 'experience', 'skills', 'education'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === section 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {activeSection === 'about' && (
          <section className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {user?.full_name?.charAt(0) || 'P'}
                  </span>
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                  {user?.full_name || 'Your Name'}
                </h1>
                <p className="text-2xl text-blue-600 mb-6">{heroTagline}</p>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                  {aboutText}
                </p>
              </div>
              
              <div className="flex justify-center gap-4 mb-8">
                {user?.github_username && (
                  <a
                    href={`https://github.com/${user.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    <Github className="w-5 h-5" />
                    GitHub
                  </a>
                )}
                {user?.linkedin_url && (
                  <a
                    href={user.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <Linkedin className="w-5 h-5" />
                    LinkedIn
                  </a>
                )}
                <a
                  href={`mailto:${user?.email}`}
                  className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  <Mail className="w-5 h-5" />
                  Contact
                </a>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'projects' && (
          <section className="min-h-screen px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-16">Featured Projects</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProjects.map((project: any, index: number) => (
                  <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-4">{project.short_description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies?.slice(0, 3).map((tech: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        {project.repo_url && (
                          <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                          >
                            <Github className="w-4 h-4" />
                            Code
                          </a>
                        )}
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'experience' && (
          <section className="min-h-screen px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-16">Experience</h2>
              
              <div className="space-y-8">
                {experiences.map((exp: any, index: number) => (
                  <div key={exp.id} className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{exp.role}</h3>
                        <p className="text-lg text-blue-600">{exp.company}</p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(exp.start_date).toLocaleDateString()} - 
                          {exp.is_current ? 'Present' : new Date(exp.end_date).toLocaleDateString()}
                        </div>
                        {exp.location && (
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {exp.location}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600">
                      {exp.ai_enhanced_description || exp.description}
                    </p>
                    
                    {exp.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {exp.technologies.map((tech: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'skills' && (
          <section className="min-h-screen px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-16">Skills</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {['language', 'framework', 'tool'].map((category) => {
                  const categorySkills = allSkills.filter((skill: any) => skill.category === category)
                  if (categorySkills.length === 0) return null
                  
                  return (
                    <div key={category} className="bg-white rounded-xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold mb-4 capitalize">{category}s</h3>
                      <div className="space-y-3">
                        {categorySkills.map((skill: any, index: number) => (
                          <div key={skill.id}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{skill.skill_name}</span>
                              <span className="text-sm text-gray-600">
                                {skill.proficiency_level}/5
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(skill.proficiency_level / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'education' && (
          <section className="min-h-screen px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-16">Education</h2>
              
              <div className="space-y-8">
                {education.map((edu: any, index: number) => (
                  <div key={edu.id} className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{edu.degree}</h3>
                        <p className="text-lg text-blue-600">{edu.institution}</p>
                        {edu.field_of_study && (
                          <p className="text-gray-600">{edu.field_of_study}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        {edu.start_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(edu.start_date).toLocaleDateString()} - 
                            {edu.is_current ? 'Present' : new Date(edu.end_date).toLocaleDateString()}
                          </div>
                        )}
                        {edu.grade && (
                          <p className="mt-1">Grade: {edu.grade}</p>
                        )}
                      </div>
                    </div>
                    
                    {edu.description && (
                      <p className="text-gray-600">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

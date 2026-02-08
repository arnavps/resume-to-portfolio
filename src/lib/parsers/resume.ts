export async function parseResumePDF(file: File): Promise<any> {
  try {
    const text = await extractTextFromPDF(file)
    return extractResumeData(text)
  } catch (error) {
    console.error('Error parsing resume PDF:', error)
    throw error
  }
}

async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

function extractResumeData(text: string): any {
  const lines = text.split('\n').filter(line => line.trim())
  
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/
  
  const email = text.match(emailRegex)?.[0] || ''
  const phone = text.match(phoneRegex)?.[0] || ''
  
  const skills = extractSkills(text)
  const experiences = extractExperiences(text)
  const education = extractEducation(text)
  const projects = extractProjects(text)
  
  return {
    personalInfo: { email, phone },
    skills,
    experiences,
    education,
    projects
  }
}

function extractSkills(text: string): string[] {
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++',
    'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'Git', 'REST API', 'GraphQL', 'Machine Learning', 'AI'
  ]
  
  const foundSkills: string[] = []
  const lowerText = text.toLowerCase()
  
  skillKeywords.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill)
    }
  })
  
  return foundSkills
}

function extractExperiences(text: string): any[] {
  const experiences: any[] = []
  const lines = text.split('\n')
  
  let currentExperience: any = null
  let inExperienceSection = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (line.toLowerCase().includes('experience') || line.toLowerCase().includes('work')) {
      inExperienceSection = true
      continue
    }
    
    if (inExperienceSection && (line.toLowerCase().includes('education') || line.toLowerCase().includes('skills'))) {
      inExperienceSection = false
      if (currentExperience) {
        experiences.push(currentExperience)
        currentExperience = null
      }
      continue
    }
    
    if (inExperienceSection && line.length > 0) {
      const dateRegex = /\b(19|20)\d{2}\b/
      const hasDate = dateRegex.test(line)
      
      if (hasDate || currentExperience) {
        if (!currentExperience) {
          const parts = line.split(dateRegex)
          if (parts.length >= 2) {
            currentExperience = {
              company: parts[0].trim(),
              role: '',
              start_date: '',
              end_date: '',
              description: '',
              is_current: false
            }
          }
        } else {
          if (!currentExperience.role) {
            currentExperience.role = line
          } else if (!currentExperience.description) {
            currentExperience.description = line
          }
        }
      }
    }
  }
  
  if (currentExperience) {
    experiences.push(currentExperience)
  }
  
  return experiences
}

function extractEducation(text: string): any[] {
  const education: any[] = []
  const lines = text.split('\n')
  
  let currentEducation: any = null
  let inEducationSection = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (line.toLowerCase().includes('education')) {
      inEducationSection = true
      continue
    }
    
    if (inEducationSection && (line.toLowerCase().includes('experience') || line.toLowerCase().includes('skills'))) {
      inEducationSection = false
      if (currentEducation) {
        education.push(currentEducation)
        currentEducation = null
      }
      continue
    }
    
    if (inEducationSection && line.length > 0) {
      if (!currentEducation) {
        currentEducation = {
          institution: line,
          degree: '',
          field_of_study: '',
          start_date: '',
          end_date: '',
          is_current: false
        }
      } else if (!currentEducation.degree) {
        currentEducation.degree = line
      } else if (!currentEducation.field_of_study) {
        currentEducation.field_of_study = line
      }
    }
  }
  
  if (currentEducation) {
    education.push(currentEducation)
  }
  
  return education
}

function extractProjects(text: string): any[] {
  const projects: any[] = []
  const lines = text.split('\n')
  
  let currentProject: any = null
  let inProjectSection = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (line.toLowerCase().includes('projects')) {
      inProjectSection = true
      continue
    }
    
    if (inProjectSection && (line.toLowerCase().includes('experience') || line.toLowerCase().includes('education'))) {
      inProjectSection = false
      if (currentProject) {
        projects.push(currentProject)
        currentProject = null
      }
      continue
    }
    
    if (inProjectSection && line.length > 0) {
      if (!currentProject) {
        currentProject = {
          title: line,
          description: '',
          technologies: [],
          start_date: '',
          end_date: ''
        }
      } else if (!currentProject.description) {
        currentProject.description = line
      }
    }
  }
  
  if (currentProject) {
    projects.push(currentProject)
  }
  
  return projects
}

export async function parseLinkedInPDF(file: File): Promise<any> {
  try {
    const text = await extractTextFromPDF(file)
    return extractLinkedInData(text)
  } catch (error) {
    console.error('Error parsing LinkedIn PDF:', error)
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

function extractLinkedInData(text: string): any {
  const lines = text.split('\n').filter(line => line.trim())

  const personalInfo = extractPersonalInfo(text)
  const experiences = extractLinkedInExperiences(text)
  const education = extractLinkedInEducation(text)
  const skills = extractLinkedInSkills(text)
  const certifications = extractLinkedInCertifications(text)

  return {
    personalInfo,
    experiences,
    education,
    skills,
    certifications
  }
}

function extractPersonalInfo(text: string): any {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/
  const locationRegex = /\b[A-Za-z\s]+,\s*[A-Za-z]{2}\b/

  const email = text.match(emailRegex)?.[0] || ''
  const phone = text.match(phoneRegex)?.[0] || ''
  const location = text.match(locationRegex)?.[0] || ''

  const name = extractName(text)

  return {
    name,
    email,
    phone,
    location
  }
}

function extractName(text: string): string {
  const lines = text.split('\n').filter(line => line.trim())

  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim()
    if (line.length > 0 && !line.includes('@') && !line.includes('http') && line.split(' ').length >= 2) {
      return line
    }
  }

  return ''
}

function extractLinkedInExperiences(text: string): any[] {
  const experiences: any[] = []
  const lines = text.split('\n')

  let currentExperience: any = null
  let inExperienceSection = false

  const experienceKeywords = ['experience', 'work', 'employment', 'career']

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase()

    if (experienceKeywords.some(keyword => line.includes(keyword))) {
      inExperienceSection = true
      continue
    }

    if (inExperienceSection && ['education', 'skills', 'certifications', 'licenses'].some(keyword => line.includes(keyword))) {
      inExperienceSection = false
      if (currentExperience) {
        experiences.push(currentExperience)
        currentExperience = null
      }
      continue
    }

    if (inExperienceSection) {
      const originalLine = lines[i].trim()
      if (originalLine.length > 0) {
        const dateRegex = /\b(19|20)\d{2}\b|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/gi
        const hasDate = dateRegex.test(originalLine)

        if (!currentExperience) {
          currentExperience = {
            company: '',
            role: '',
            employment_type: 'full-time',
            location: '',
            is_remote: false,
            description: '',
            start_date: '',
            end_date: '',
            is_current: false,
            technologies: []
          }
        }

        if (hasDate && !currentExperience.start_date) {
          const dates = extractDates(originalLine)
          currentExperience.start_date = dates.start
          currentExperience.end_date = dates.end
          currentExperience.is_current = dates.is_current
        } else if (!currentExperience.company) {
          currentExperience.company = originalLine
        } else if (!currentExperience.role) {
          currentExperience.role = originalLine
        } else if (!currentExperience.description) {
          currentExperience.description = originalLine
        } else {
          currentExperience.description += ' ' + originalLine
        }
      }
    }
  }

  if (currentExperience) {
    experiences.push(currentExperience)
  }

  return experiences
}

function extractLinkedInEducation(text: string): any[] {
  const education: any[] = []
  const lines = text.split('\n')

  let currentEducation: any = null
  let inEducationSection = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase()

    if (line.includes('education')) {
      inEducationSection = true
      continue
    }

    if (inEducationSection && ['experience', 'skills', 'certifications'].some(keyword => line.includes(keyword))) {
      inEducationSection = false
      if (currentEducation) {
        education.push(currentEducation)
        currentEducation = null
      }
      continue
    }

    if (inEducationSection) {
      const originalLine = lines[i].trim()
      if (originalLine.length > 0) {
        if (!currentEducation) {
          currentEducation = {
            institution: '',
            degree: '',
            field_of_study: '',
            grade: '',
            start_date: '',
            end_date: '',
            is_current: false,
            description: ''
          }
        }

        if (!currentEducation.institution) {
          currentEducation.institution = originalLine
        } else if (!currentEducation.degree) {
          currentEducation.degree = originalLine
        } else if (!currentEducation.field_of_study) {
          currentEducation.field_of_study = originalLine
        } else {
          const dates = extractDates(originalLine)
          if (dates.start) {
            currentEducation.start_date = dates.start
            currentEducation.end_date = dates.end
            currentEducation.is_current = dates.is_current
          } else {
            currentEducation.description = originalLine
          }
        }
      }
    }
  }

  if (currentEducation) {
    education.push(currentEducation)
  }

  return education
}

function extractLinkedInSkills(text: string): string[] {
  const skills: string[] = []
  const lines = text.split('\n')

  let inSkillsSection = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase()

    if (line.includes('skills')) {
      inSkillsSection = true
      continue
    }

    if (inSkillsSection && ['experience', 'education', 'certifications'].some(keyword => line.includes(keyword))) {
      inSkillsSection = false
      continue
    }

    if (inSkillsSection) {
      const originalLine = lines[i].trim()
      if (originalLine.length > 0 && originalLine.length < 50) {
        skills.push(originalLine)
      }
    }
  }

  return skills
}

function extractLinkedInCertifications(text: string): any[] {
  const certifications: any[] = []
  const lines = text.split('\n')

  let inCertificationsSection = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase()

    if (line.includes('certifications') || line.includes('licenses')) {
      inCertificationsSection = true
      continue
    }

    if (inCertificationsSection && ['experience', 'education', 'skills'].some(keyword => line.includes(keyword))) {
      inCertificationsSection = false
      continue
    }

    if (inCertificationsSection) {
      const originalLine = lines[i].trim()
      if (originalLine.length > 0) {
        const certification = {
          name: originalLine,
          issuing_organization: '',
          issue_date: '',
          expiration_date: '',
          credential_id: '',
          credential_url: ''
        }
        certifications.push(certification)
      }
    }
  }

  return certifications
}

function extractDates(text: string): { start: string; end: string; is_current: boolean } {
  const dateRegex = /\b(19|20)\d{2}\b|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/gi
  const matches = text.match(dateRegex) || []

  if (matches.length >= 2) {
    return {
      start: matches[0] || '',
      end: matches[1]?.toLowerCase() === 'present' ? '' : (matches[1] || ''),
      is_current: matches[1]?.toLowerCase() === 'present' || false
    }
  } else if (matches.length === 1) {
    return {
      start: matches[0] || '',
      end: '',
      is_current: text.toLowerCase().includes('present')
    }
  }

  return {
    start: '',
    end: '',
    is_current: false
  }
}

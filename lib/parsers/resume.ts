import pdf from 'pdf-parse';

interface ResumeData {
    experiences: Array<{
        company: string;
        role: string;
        start_date: string;
        end_date: string | null;
        is_current: boolean;
        description: string;
        location?: string;
    }>;
    education: Array<{
        institution: string;
        degree: string;
        field_of_study?: string;
        start_date?: string;
        end_date?: string;
        grade?: string;
    }>;
    skills: string[];
    projects: Array<{
        title: string;
        description: string;
        technologies?: string[];
    }>;
    certifications: Array<{
        name: string;
        issuing_organization: string;
        issue_date?: string;
    }>;
    contact: {
        email?: string;
        phone?: string;
        linkedin?: string;
        github?: string;
    };
}

export async function parseResumePDF(buffer: Buffer): Promise<ResumeData> {
    try {
        const data = await pdf(buffer);
        const text = data.text;

        return {
            experiences: extractExperiences(text),
            education: extractEducation(text),
            skills: extractSkills(text),
            projects: extractProjects(text),
            certifications: extractCertifications(text),
            contact: extractContact(text)
        };
    } catch (error) {
        console.error('Error parsing resume PDF:', error);
        throw new Error('Failed to parse resume PDF');
    }
}

function extractExperiences(text: string) {
    const experiences: any[] = [];
    const sections = text.split(/(?:EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|PROFESSIONAL EXPERIENCE)/i);

    if (sections.length < 2) return experiences;

    const experienceSection = sections[1].split(/(?:EDUCATION|SKILLS|PROJECTS)/i)[0];
    const lines = experienceSection.split('\n').filter(line => line.trim());

    let currentExp: any = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Detect company/role pattern
        if (line.match(/^[A-Z][A-Za-z\s&,.-]+$/)) {
            if (currentExp) {
                experiences.push(currentExp);
            }

            currentExp = {
                company: line,
                role: lines[i + 1]?.trim() || '',
                start_date: '',
                end_date: null,
                is_current: false,
                description: ''
            };

            // Extract dates
            const dateMatch = lines[i + 2]?.match(/(\w+\s+\d{4})\s*[-–]\s*(\w+\s+\d{4}|Present|Current)/i);
            if (dateMatch) {
                currentExp.start_date = dateMatch[1];
                currentExp.end_date = dateMatch[2].match(/Present|Current/i) ? null : dateMatch[2];
                currentExp.is_current = dateMatch[2].match(/Present|Current/i) !== null;
                i += 2;
            }
        } else if (currentExp && line.startsWith('•') || line.startsWith('-')) {
            currentExp.description += line.replace(/^[•-]\s*/, '') + '\n';
        }
    }

    if (currentExp) {
        experiences.push(currentExp);
    }

    return experiences;
}

function extractEducation(text: string) {
    const education: any[] = [];
    const sections = text.split(/(?:EDUCATION)/i);

    if (sections.length < 2) return education;

    const educationSection = sections[1].split(/(?:EXPERIENCE|SKILLS|PROJECTS)/i)[0];
    const lines = educationSection.split('\n').filter(line => line.trim());

    let currentEdu: any = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.match(/University|College|Institute|School/i)) {
            if (currentEdu) {
                education.push(currentEdu);
            }

            currentEdu = {
                institution: line,
                degree: lines[i + 1]?.trim() || '',
                field_of_study: '',
                start_date: '',
                end_date: ''
            };

            const dateMatch = lines[i + 2]?.match(/(\d{4})\s*[-–]\s*(\d{4}|Present)/i);
            if (dateMatch) {
                currentEdu.start_date = dateMatch[1];
                currentEdu.end_date = dateMatch[2];
                i += 2;
            }
        }
    }

    if (currentEdu) {
        education.push(currentEdu);
    }

    return education;
}

function extractSkills(text: string) {
    const skills: string[] = [];
    const sections = text.split(/(?:SKILLS|TECHNICAL SKILLS)/i);

    if (sections.length < 2) return skills;

    const skillsSection = sections[1].split(/(?:EXPERIENCE|EDUCATION|PROJECTS)/i)[0];

    // Common skill patterns
    const skillMatches = skillsSection.match(/(?:JavaScript|TypeScript|Python|Java|C\+\+|React|Node\.js|Angular|Vue|SQL|MongoDB|AWS|Docker|Kubernetes|Git|HTML|CSS|TailwindCSS|Next\.js|Express|Django|Flask|PostgreSQL|Redis|GraphQL|REST|API|CI\/CD|Agile|Scrum)/gi);

    if (skillMatches) {
        skills.push(...Array.from(new Set(skillMatches)));
    }

    return skills;
}

function extractProjects(text: string) {
    const projects: any[] = [];
    const sections = text.split(/(?:PROJECTS|PERSONAL PROJECTS)/i);

    if (sections.length < 2) return projects;

    const projectsSection = sections[1].split(/(?:EXPERIENCE|EDUCATION|SKILLS)/i)[0];
    const lines = projectsSection.split('\n').filter(line => line.trim());

    let currentProject: any = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line && !line.startsWith('•') && !line.startsWith('-')) {
            if (currentProject) {
                projects.push(currentProject);
            }

            currentProject = {
                title: line,
                description: '',
                technologies: []
            };
        } else if (currentProject && (line.startsWith('•') || line.startsWith('-'))) {
            currentProject.description += line.replace(/^[•-]\s*/, '') + '\n';
        }
    }

    if (currentProject) {
        projects.push(currentProject);
    }

    return projects;
}

function extractCertifications(text: string) {
    const certifications: any[] = [];
    const sections = text.split(/(?:CERTIFICATIONS|CERTIFICATES)/i);

    if (sections.length < 2) return certifications;

    const certsSection = sections[1].split(/(?:EXPERIENCE|EDUCATION|SKILLS|PROJECTS)/i)[0];
    const lines = certsSection.split('\n').filter(line => line.trim());

    for (const line of lines) {
        if (line.trim() && !line.startsWith('•')) {
            const parts = line.split(/[-–]/);
            certifications.push({
                name: parts[0]?.trim() || line,
                issuing_organization: parts[1]?.trim() || '',
                issue_date: parts[2]?.trim() || ''
            });
        }
    }

    return certifications;
}

function extractContact(text: string) {
    const contact: any = {};

    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) contact.email = emailMatch[0];

    const phoneMatch = text.match(/(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) contact.phone = phoneMatch[0];

    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
    if (linkedinMatch) contact.linkedin = 'https://' + linkedinMatch[0];

    const githubMatch = text.match(/github\.com\/[\w-]+/i);
    if (githubMatch) contact.github = 'https://' + githubMatch[0];

    return contact;
}

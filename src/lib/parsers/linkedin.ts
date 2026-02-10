const PDFParser = require("pdf2json");

interface LinkedInData {
    experiences: Array<{
        company: string;
        company_logo_url?: string;
        role: string;
        employment_type?: string;
        location?: string;
        is_remote: boolean;
        description: string;
        start_date: string;
        end_date: string | null;
        is_current: boolean;
    }>;
    education: Array<{
        institution: string;
        degree: string;
        field_of_study?: string;
        start_date?: string;
        end_date?: string;
    }>;
    certifications: Array<{
        name: string;
        issuing_organization: string;
        issue_date?: string;
        credential_url?: string;
    }>;
    skills: string[];
}

export async function parseLinkedInPDF(buffer: Buffer): Promise<LinkedInData> {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(this, 1);

        pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
            const text = pdfParser.getRawTextContent();

            resolve({
                experiences: extractLinkedInExperiences(text),
                education: extractLinkedInEducation(text),
                certifications: extractLinkedInCertifications(text),
                skills: extractLinkedInSkills(text)
            });
        });

        pdfParser.parseBuffer(buffer);
    });
}

function extractLinkedInExperiences(text: string) {
    const experiences: any[] = [];

    // LinkedIn PDFs typically have a specific format
    const experienceSection = text.split(/Experience/i)[1]?.split(/Education|Skills|Certifications/i)[0];

    if (!experienceSection) return experiences;

    const lines = experienceSection.split('\n').filter(line => line.trim());
    let currentExp: any = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Role usually comes first in LinkedIn format
        if (line && !line.match(/^\d+\s+(year|month|yr|mo)/i) && !line.startsWith('•')) {
            if (currentExp && currentExp.role) {
                experiences.push(currentExp);
            }

            currentExp = {
                role: line,
                company: lines[i + 1]?.trim() || '',
                employment_type: '',
                location: '',
                is_remote: false,
                description: '',
                start_date: '',
                end_date: null,
                is_current: false
            };

            // Extract employment type and dates
            const dateLocationLine = lines[i + 2];
            if (dateLocationLine) {
                const dateMatch = dateLocationLine.match(/(\w+\s+\d{4})\s*[-–]\s*(\w+\s+\d{4}|Present)/i);
                if (dateMatch) {
                    currentExp.start_date = dateMatch[1];
                    currentExp.end_date = dateMatch[2].match(/Present/i) ? null : dateMatch[2];
                    currentExp.is_current = dateMatch[2].match(/Present/i) !== null;
                }

                if (dateLocationLine.match(/Remote/i)) {
                    currentExp.is_remote = true;
                }

                const locationMatch = dateLocationLine.match(/([A-Z][a-z]+(?:,\s*[A-Z]{2})?)/);
                if (locationMatch) {
                    currentExp.location = locationMatch[1];
                }
            }

            i += 2;
        } else if (currentExp && line.startsWith('•')) {
            currentExp.description += line.replace(/^•\s*/, '') + '\n';
        }
    }

    if (currentExp && currentExp.role) {
        experiences.push(currentExp);
    }

    return experiences;
}

function extractLinkedInEducation(text: string) {
    const education: any[] = [];

    const educationSection = text.split(/Education/i)[1]?.split(/Experience|Skills|Certifications/i)[0];

    if (!educationSection) return education;

    const lines = educationSection.split('\n').filter(line => line.trim());
    let currentEdu: any = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line && !line.match(/^\d{4}/)) {
            if (currentEdu) {
                education.push(currentEdu);
            }

            currentEdu = {
                institution: line,
                degree: lines[i + 1]?.trim() || '',
                field_of_study: lines[i + 2]?.trim() || '',
                start_date: '',
                end_date: ''
            };

            const dateMatch = lines[i + 3]?.match(/(\d{4})\s*[-–]\s*(\d{4})/);
            if (dateMatch) {
                currentEdu.start_date = dateMatch[1];
                currentEdu.end_date = dateMatch[2];
                i += 3;
            }
        }
    }

    if (currentEdu) {
        education.push(currentEdu);
    }

    return education;
}

function extractLinkedInCertifications(text: string) {
    const certifications: any[] = [];

    const certsSection = text.split(/Licenses & Certifications|Certifications/i)[1]?.split(/Experience|Education|Skills/i)[0];

    if (!certsSection) return certifications;

    const lines = certsSection.split('\n').filter(line => line.trim());

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line && !line.match(/Issued|Credential/i)) {
            certifications.push({
                name: line,
                issuing_organization: lines[i + 1]?.trim() || '',
                issue_date: lines[i + 2]?.match(/Issued\s+(\w+\s+\d{4})/i)?.[1] || '',
                credential_url: lines[i + 3]?.match(/(https?:\/\/[^\s]+)/)?.[1] || ''
            });
            i += 3;
        }
    }

    return certifications;
}

function extractLinkedInSkills(text: string) {
    const skills: string[] = [];

    const skillsSection = text.split(/Skills/i)[1]?.split(/Experience|Education|Certifications/i)[0];

    if (!skillsSection) return skills;

    const lines = skillsSection.split('\n').filter(line => line.trim());

    for (const line of lines) {
        if (line.trim() && !line.match(/Endorsements/i)) {
            skills.push(line.trim());
        }
    }

    return skills;
}

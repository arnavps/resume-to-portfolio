const PDFParser = require("pdf2json");

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

import { geminiFlash } from '@/lib/ai/gemini';

export async function parseResumePDF(buffer: Buffer): Promise<ResumeData> {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1); // 1 = text only

        pdfParser.on("pdfParser_dataError", (errData: any) => {
            console.error(errData.parserError);
            reject(errData.parserError);
        });

        pdfParser.on("pdfParser_dataReady", async (pdfData: any) => {
            try {
                const text = pdfParser.getRawTextContent();
                const resumeData = await extractResumeWithAI(text);
                resolve(resumeData);
            } catch (error) {
                console.error("AI Parsing failed, falling back to manual or returning empty", error);
                // Fallback can be implemented here if needed, or just reject
                reject(error);
            }
        });

        pdfParser.parseBuffer(buffer);
    });
}

async function extractResumeWithAI(text: string): Promise<ResumeData> {
    const prompt = `
    You are an expert resume parser. Extract the following information from the resume text provided below.
    Return the result as a strictly valid JSON object matching this TypeScript interface:

    interface ResumeData {
        experiences: Array<{
            company: string;
            role: string;
            start_date: string; // Format YYYY-MM-DD or YYYY-MM if possible, otherwise raw string
            end_date: string | null; // null if current
            is_current: boolean;
            description: string; // Summarized bullet points
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
        skills: string[]; // List of technical skills, languages, tools
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

    RESUME TEXT:
    ${text}
    
    RETURN ONLY JSON. DO NOT INCLUDE MARKDOWN FORMATTING like \`\`\`json.
    `;

    const result = await geminiFlash.generateContent(prompt);
    const responseText = result.response.text();

    // Clean up markdown if present (Flash sometimes adds it despite instructions)
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(jsonStr);
}

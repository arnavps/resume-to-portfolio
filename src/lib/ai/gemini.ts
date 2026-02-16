import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

const createRetryingModel = (modelName: string, config: any) => {
    const model = genAI.getGenerativeModel({
        model: modelName,
        ...config
    });

    return {
        ...model,
        generateContent: async (prompt: any) => {
            let attempt = 0;
            const maxAttempts = 10; // Increased to handle long waits

            while (attempt < maxAttempts) {
                try {
                    return await model.generateContent(prompt);
                } catch (error: any) {
                    // Check for 429 or 503 (service unavailable)
                    if (error.status === 429 || error.message?.includes('429') || error.status === 503) {
                        attempt++;
                        if (attempt === maxAttempts) throw error;

                        let delay = Math.pow(2, attempt) * 1000;

                        // Parse retryDelay from error message if available
                        // Example: "retryDelay":"35s" || "retryDelay": "35.59s"
                        const match = error.message?.match(/"retryDelay":"(\d+\.?\d*)s"/);
                        if (match && match[1]) {
                            const serverDelay = parseFloat(match[1]) * 1000;
                            if (serverDelay > delay) {
                                delay = serverDelay + 1000; // Add buffer
                            }
                        }

                        // Cap delay at 60s to avoid indefinite hangs
                        if (delay > 60000) delay = 60000;

                        console.warn(`Gemini API error (${error.status || 'unknown'}). Retrying attempt ${attempt}/${maxAttempts} in ${delay}ms...`);

                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                    throw error;
                }
            }
        }
    } as any; // Type casting to satisfy basic usage
};

export const geminiPro = createRetryingModel('gemini-2.0-flash-001', { // 2.0 Flash as "Pro" tier equivalent for now, or just use 2.0-flash-001 if available
    safetySettings,
    generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
    },
});

export const geminiFlash = createRetryingModel('gemini-2.0-flash-lite-001', { // Reverting to 2.0-flash-lite
    safetySettings,
    generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
    },
});

// Fact-checking with grounding
export async function generateWithGrounding(prompt: string, groundingData: any) {
    const fullPrompt = `
${prompt}

GROUNDING DATA (Use this to verify facts):
${JSON.stringify(groundingData, null, 2)}

Instructions:
1. Generate content based on the prompt
2. Verify all facts against the grounding data
3. Include a confidence score (0-1) for each generated section
4. Flag any information that cannot be verified
5. Return response in JSON format
`;

    const result = await geminiPro.generateContent(fullPrompt);
    return result.response.text();
}

// Project narrative generation
export async function generateProjectNarrative(projectData: any) {
    const prompt = `
You are an expert technical writer helping developers showcase their work.

Analyze this GitHub project and create a compelling narrative:

Project: ${projectData.name}
Description: ${projectData.description || 'No description provided'}
Languages: ${Object.keys(projectData.languages || {}).join(', ')}
Stars: ${projectData.stargazers_count || 0}
Forks: ${projectData.forks_count || 0}
README Excerpt: ${projectData.readme?.substring(0, 1000) || 'No README'}
Key Files: ${projectData.keyFiles?.map((f: any) => f.path).join(', ') || 'None'}
Topics: ${projectData.topics?.join(', ') || 'None'}

Generate:
1. short_description: A compelling 1-2 sentence hook (30-50 words)
2. long_description: Detailed narrative covering:
   - The problem it solves
   - Key technical decisions and why
   - Interesting implementation details
   - Impact or learnings
   (200-300 words, first-person)
3. technical_highlights: Array of 3-5 bullet points
4. skills_demonstrated: Array of technical skills shown
5. confidence_score: Your confidence in this analysis (0-1)
6. missing_context: Array of questions/gaps in information

Use a professional yet conversational tone. Focus on storytelling.
Write in first person ("I built", "I implemented").

Return ONLY valid JSON in this exact format:
{
  "short_description": "...",
  "long_description": "...",
  "technical_highlights": ["...", "..."],
  "skills_demonstrated": ["...", "..."],
  "confidence_score": 0.85,
  "missing_context": ["..."]
}
`;

    try {
        const result = await geminiPro.generateContent(prompt);
        const text = result.response.text();

        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found in response');

        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
    } catch (error) {
        console.error('Error generating project narrative:', error);
        throw error;
    }
}

// Career narrative generation
export async function generateCareerNarrative(data: {
    experiences: any[];
    projects: any[];
    skills: any[];
    education: any[];
}) {
    const prompt = `
You are a professional career coach and storyteller.

Create a compelling "About Me" section based on this professional data:

EXPERIENCE:
${JSON.stringify(data.experiences, null, 2)}

TOP PROJECTS:
${JSON.stringify(data.projects.slice(0, 5), null, 2)}

SKILLS:
${data.skills.map((s: any) => s.skill_name).join(', ')}

EDUCATION:
${JSON.stringify(data.education, null, 2)}

Create a narrative (150-200 words) that:
- Opens with a strong hook about their unique value
- Shows professional evolution and growth
- Highlights 2-3 key achievements or strengths
- Demonstrates passion and expertise
- Ends with current focus or aspirations
- Uses first person, active voice
- Feels authentic and human (not robotic)

Also generate:
1. hero_tagline: A punchy one-liner for the hero section (8-12 words)
2. meta_description: SEO-optimized description (150-160 chars)
3. confidence_score: Your confidence (0-1)

Return ONLY valid JSON:
{
  "about_me": "...",
  "hero_tagline": "...",
  "meta_description": "...",
  "confidence_score": 0.9
}
`;

    try {
        const result = await geminiPro.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found in response');
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error generating career narrative:', error);
        throw error;
    }
}

// Code quality analysis
export async function analyzeCodeQuality(repoFiles: any[], languages: string[]) {
    const codeSnippets = repoFiles
        .filter((f: any) => f.content)
        .slice(0, 5)
        .map((f: any) => `// ${f.path}\n${f.content.substring(0, 500)}`)
        .join('\n\n---\n\n');

    const prompt = `
You are a senior software engineer conducting a code review.

Analyze these code samples:

Languages: ${languages.join(', ')}

Code Samples:
${codeSnippets}

Evaluate:
1. Code quality and cleanliness
2. Best practices adherence
3. Architecture patterns
4. Testing approach (if visible)
5. Documentation quality

Return JSON:
{
  "quality_score": 7.5,
  "strengths": ["...", "..."],
  "patterns_used": ["...", "..."],
  "recommendations": ["...", "..."],
  "confidence_score": 0.8
}

Score from 1-10. Be fair but constructive.
`;

    try {
        const result = await geminiFlash.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found');
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error analyzing code quality:', error);
        return {
            quality_score: 6.0,
            strengths: [],
            patterns_used: [],
            recommendations: [],
            confidence_score: 0.3
        };
    }
}

// ATS Optimization
export async function optimizeForATS(content: string, targetRole: string = 'Software Engineer') {
    const prompt = `
You are an ATS (Applicant Tracking System) expert and recruiter.

Analyze this portfolio content for ATS optimization targeting "${targetRole}" roles:

${content}

Evaluate:
1. Keyword optimization (industry-standard terms)
2. Content structure and formatting
3. Action verbs and quantifiable achievements
4. Skill coverage for the role
5. Overall recruiter appeal

Return JSON:
{
  "overall_score": 75,
  "keyword_score": 80,
  "formatting_score": 70,
  "content_score": 75,
  "missing_keywords": ["Docker", "CI/CD", "..."],
  "suggestions": [
    {
      "priority": "high",
      "category": "keywords",
      "suggestion": "Add more DevOps-related keywords",
      "examples": ["Docker", "Kubernetes"]
    }
  ],
  "strong_points": ["...", "..."],
  "confidence_score": 0.9
}

Scores are 0-100. Be specific and actionable.
`;

    try {
        const result = await geminiPro.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found');
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error optimizing for ATS:', error);
        throw error;
    }
}

// AI Coaching
export async function generateCoachingSuggestions(portfolioData: any) {
    const prompt = `
You are a career coach specializing in developer portfolios.

Review this portfolio and provide actionable improvement suggestions:

${JSON.stringify(portfolioData, null, 2)}

Focus on:
1. Content gaps (missing projects, skills, experience details)
2. Storytelling improvements
3. Visual presentation suggestions
4. SEO and discoverability
5. Recruiter appeal

Return JSON:
{
  "priority_actions": [
    {
      "priority": "high",
      "category": "content",
      "title": "Add project demos",
      "description": "...",
      "effort": "medium",
      "impact": "high"
    }
  ],
  "content_score": 7.5,
  "completeness": 0.75,
  "overall_feedback": "..."
}
`;

    try {
        const result = await geminiPro.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found');
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error generating coaching:', error);
        throw error;
    }
}

// Batch generation with confidence tracking
export async function generateMultiple(tasks: Array<{ type: string; data: any }>) {
    const results = await Promise.allSettled(
        tasks.map(async (task) => {
            switch (task.type) {
                case 'project':
                    return await generateProjectNarrative(task.data);
                case 'career':
                    return await generateCareerNarrative(task.data);
                case 'code-quality':
                    return await analyzeCodeQuality(task.data.files, task.data.languages);
                case 'ats':
                    return await optimizeForATS(task.data.content, task.data.role);
                default:
                    throw new Error(`Unknown task type: ${task.type}`);
            }
        })
    );

    return results.map((result, index) => ({
        type: tasks[index].type,
        status: result.status,
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null
    }));
}

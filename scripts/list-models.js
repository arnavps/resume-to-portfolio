const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });
if (!process.env.GEMINI_API_KEY) {
    require('dotenv').config({ path: '.env' });
}

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY not found in .env.local");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy init to get access to client if needed, but actually we use the client directly usually? 
        // Wait, SDK doesn't expose listModels directly on genAI instance in all versions?
        // Let's check documentation pattern or just try to use the direct API via fetch if SDK is obscure.
        // Actually, newer SDKs might not have listModels helper easily accessible without digging.
        // Let's use simple fetch to be sure.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                console.log(`- ${m.name}`);
                if (m.supportedGenerationMethods) {
                    console.log(`  Methods: ${m.supportedGenerationMethods.join(', ')}`);
                }
            });
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();

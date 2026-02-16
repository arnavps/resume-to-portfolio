const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });
if (!process.env.GEMINI_API_KEY) {
    require('dotenv').config({ path: '.env' });
}

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        fs.writeFileSync('models_output.txt', "No API key found.");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    let output = "Fetching available models...\n";

    const candidates = [
        "gemini-2.0-flash-lite-001",
        "gemini-2.0-flash-001",
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash-002",
        "gemini-1.5-flash-8b",
        "gemini-1.5-pro",
        "gemini-1.5-pro-001",
        "gemini-1.5-pro-latest",
        "gemini-1.5-pro-002",
        "gemini-1.0-pro",
        "gemini-pro"
    ];

    for (const modelName of candidates) {
        output += `\nTesting: ${modelName}\n`;
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test");
            output += `✅ SUCCESS: ${modelName}\n`;
        } catch (error) {
            output += `❌ FAILED: ${modelName} - ${error.message.split('\n')[0]}\n`;
        }
    }

    fs.writeFileSync('models_output.txt', output);
    console.log("Done. Check models_output.txt");
}

listModels();

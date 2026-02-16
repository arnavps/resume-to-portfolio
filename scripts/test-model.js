const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });
if (!process.env.GEMINI_API_KEY) {
    require('dotenv').config({ path: '.env' });
}

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}`);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key found.");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    try {
        const result = await model.generateContent("Hello! Are you working?");
        console.log(`Success! Response: ${result.response.text()}`);
    } catch (error) {
        console.error(`Error with ${modelName}:`, error.message);
    }
}

testModel("gemini-2.0-flash-001");
testModel("gemini-2.0-pro"); // Just in case
testModel("gemini-2.0-flash");

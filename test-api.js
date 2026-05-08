// 测试 Gemini API 连接
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// 手动读取 .env.local 文件
function loadEnv() {
  try {
    const content = fs.readFileSync(".env.local", "utf-8");
    const lines = content.split("\n");
    for (const line of lines) {
      if (line.trim() && !line.startsWith("#")) {
        const [key, value] = line.split("=");
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      }
    }
  } catch (error) {
    console.error("Warning: Could not read .env.local:", error.message);
  }
}

async function testGeminiAPI() {
  loadEnv();
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("ERROR: GEMINI_API_KEY environment variable is not set");
    process.exit(1);
  }

  console.log("Testing Gemini API connection...");
  console.log("API Key length:", apiKey.length);
  console.log("API Key starts with:", apiKey.substring(0, 10) + "...");

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    console.log("\nSending test request...");
    const result = await model.generateContent("Hello, Gemini!");
    const response = result.response;
    const text = response.text();

    console.log("\n✅ SUCCESS! Gemini API is working correctly.");
    console.log("Response:", text);
  } catch (error) {
    console.error("\n❌ FAILED! Error connecting to Gemini API:");
    console.error("Error message:", error.message);
    
    if (error.message.includes("API key")) {
      console.error("\nPossible issues:");
      console.error("1. API key is invalid or not configured");
      console.error("2. API key does not have permission to access Gemini API");
      console.error("3. Gemini API is not enabled in Google Cloud Console");
    } else if (error.message.includes("fetch")) {
      console.error("\nPossible issues:");
      console.error("1. Network connection issue");
      console.error("2. Firewall blocking access to Google API");
      console.error("3. Proxy configuration required");
    } else if (error.message.includes("quota")) {
      console.error("\nPossible issues:");
      console.error("1. API quota exceeded");
      console.error("2. Billing not enabled");
    }
  }
}

testGeminiAPI();

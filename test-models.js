const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBXkqivcwJG1N-ZCJzN_2gfzhvT2wjWMb0");

const modelsToTest = [
  "gemini-pro",
  "gemini-pro-vision",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-2.0-flash-exp",
];

async function testModels() {
  for (const modelName of modelsToTest) {
    console.log(`\nTesting model: ${modelName}`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello, give me a short response");
      console.log(`✅ Success! Model ${modelName} works.`);
    } catch (error) {
      console.log(`❌ Failed: ${error.message.split('\n')[0]}`);
    }
  }
}

testModels();
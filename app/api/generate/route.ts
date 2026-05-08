import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SCRIPT_GENERATION_PROMPT } from "@/lib/prompts";
import { mockScript, mockImages } from "@/lib/mockData";
import type { Script } from "@/lib/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true";

async function generateScript(topic: string): Promise<Script> {
  if (USE_MOCK_DATA) {
    console.log("[DEBUG] Using mock script data");
    return {
      ...mockScript,
      topic: topic,
    };
  }

  const prompt = SCRIPT_GENERATION_PROMPT.replace("{topic}", topic);
  const fullPrompt = `You are a professional scriptwriter for faceless TikTok and YouTube Shorts videos. Always output valid JSON.

${prompt}`;

  console.log("[DEBUG] Generating script with prompt length:", fullPrompt.length);
  console.log("[DEBUG] Using model: gemini-1.5-pro");

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        temperature: 0.8,
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    
    console.log("[DEBUG] Response received from Gemini");
    
    const content = response.text();

    if (!content) {
      throw new Error("No content generated from Gemini");
    }

    console.log("[DEBUG] Script generated successfully");
    return JSON.parse(content);
  } catch (error: any) {
    console.error("[ERROR] generateScript failed:", error.message);
    console.error("[ERROR] Error details:", JSON.stringify(error, null, 2));
    throw error;
  }
}

async function generateImage(prompt: string, index: number): Promise<string> {
  if (USE_MOCK_DATA) {
    console.log("[DEBUG] Using mock image data");
    return mockImages[index] || "";
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
  });

  const result = await model.generateContent(prompt);
  const response = result.response;

  const imagePart = response.candidates?.[0]?.content?.parts?.find(
    (part) => part.inlineData?.mimeType?.startsWith("image/")
  );

  if (imagePart?.inlineData) {
    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
  }

  throw new Error("No image generated from Gemini");
}

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();

    if (!topic || topic.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid topic (at least 3 characters)", code: "INVALID_TOPIC" },
        { status: 400 }
      );
    }

    if (!USE_MOCK_DATA && (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.length < 10)) {
      return NextResponse.json(
        { success: false, error: "API key not configured properly. Please check your .env.local file.", code: "MISSING_API_KEY" },
        { status: 500 }
      );
    }

    const script = await generateScript(topic.trim());

    const images: string[] = [];
    for (let i = 0; i < script.scenes.length; i++) {
      const scene = script.scenes[i];
      try {
        const image = await generateImage(scene.image_prompt, i);
        images.push(image);
      } catch (error) {
        console.error(`Failed to generate image for scene ${scene.scene_number}:`, error);
        images.push("");
      }
    }

    return NextResponse.json({
      success: true,
      data: { script, images },
    });
  } catch (error: any) {
    console.error("Generation error:", error);
    
    let errorMessage = error.message || "Generation failed";
    let errorCode = error.code || "UNKNOWN_ERROR";
    
    if (errorMessage.includes("fetch failed") || errorMessage.includes("network")) {
      errorMessage = "Network error. Switching to demo mode with mock data.";
      errorCode = "NETWORK_ERROR";
      
      console.log("[DEBUG] Falling back to mock data due to network error");
      return NextResponse.json({
        success: true,
        data: {
          script: { ...mockScript, topic: "Demo: Mindfulness in Daily Life" },
          images: mockImages,
        },
        warning: "Using demo data due to network issues. Connect to a different network to use real AI generation.",
      });
    } else if (errorMessage.includes("API key") || errorMessage.includes("permission")) {
      errorMessage = "API key error. Please check your GEMINI_API_KEY in .env.local and ensure it has sufficient permissions.";
      errorCode = "API_KEY_ERROR";
    } else if (errorMessage.includes("quota") || errorMessage.includes("rate limit")) {
      errorMessage = "Rate limit exceeded. Please try again later or check your API quota.";
      errorCode = "RATE_LIMIT";
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        code: errorCode,
      },
      { status: 500 }
    );
  }
}

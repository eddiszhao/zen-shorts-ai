"use client";

import { useState } from "react";
import { Sparkles, Zap, AlertCircle } from "lucide-react";
import TopicInput from "@/components/TopicInput";
import GenerateButton from "@/components/GenerateButton";
import LoadingState from "@/components/LoadingState";
import ScriptDisplay from "@/components/ScriptDisplay";
import ImageGallery from "@/components/ImageGallery";
import DownloadButton from "@/components/DownloadButton";
import { validateTopic } from "@/lib/utils";
import type { Script } from "@/lib/types";

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<"idle" | "script" | "images">("idle");
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [script, setScript] = useState<Script | null>(null);
  const [images, setImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!validateTopic(topic)) {
      setError("Please enter a valid topic (at least 3 characters)");
      return;
    }

    setError(null);
    setWarning(null);
    setIsLoading(true);
    setCurrentStep("script");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Generation failed");
      }

      if (data.warning) {
        setWarning(data.warning);
      }

      setCurrentStep("images");
      setScript(data.data.script);
      setImages(data.data.images);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setScript(null);
      setImages([]);
    } finally {
      setIsLoading(false);
      setCurrentStep("idle");
    }
  };

  const handleReset = () => {
    setTopic("");
    setScript(null);
    setImages([]);
    setError(null);
    setWarning(null);
    setIsLoading(false);
    setCurrentStep("idle");
  };

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-6 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-foreground via-accent to-orange-300 bg-clip-text text-transparent">
              ZenShorts AI
            </h1>
            <p className="text-xl text-foreground/70 font-light">
              Create Your Zen Moment
            </p>
          </div>

          <p className="text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into 30-second faceless video content.
            <br />
            Powered by AI, designed for TikTok & YouTube Shorts.
          </p>
        </header>

        {!script && !isLoading && (
          <section className="space-y-8 animate-slide-up">
            <TopicInput value={topic} onChange={setTopic} disabled={isLoading} />

            {error && (
              <div className="max-w-2xl mx-auto glass-card rounded-xl p-4 border-red-500/50">
                <div className="flex items-center gap-3 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <GenerateButton
                onClick={handleGenerate}
                disabled={!topic.trim()}
                loading={isLoading}
              />
            </div>

            <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                What you get:
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>30-second English script with emotional hooks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>4 cinematic scenes split for optimal pacing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>4 AI-generated high-resolution images (1024x1024)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>Optimized for faceless video content</span>
                </li>
              </ul>
            </div>
          </section>
        )}

        {isLoading && (
          <LoadingState step={currentStep} />
        )}

        {script && !isLoading && (
          <section className="space-y-12 animate-slide-up">
            {warning && (
              <div className="max-w-4xl mx-auto glass-card rounded-xl p-4 border-yellow-500/50">
                <div className="flex items-center gap-3 text-yellow-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>{warning}</span>
                </div>
              </div>
            )}
            
            <ScriptDisplay script={script} />
            
            {images.length > 0 && (
              <ImageGallery images={images} />
            )}

            <DownloadButton script={script} images={images} />

            <div className="flex justify-center pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 text-foreground/60 hover:text-foreground transition-colors"
              >
                ← Create another
              </button>
            </div>
          </section>
        )}

        <footer className="text-center pt-16 space-y-2">
          <p className="text-foreground/50 text-sm">
            Built with Next.js 14 & Google Gemini
          </p>
          <p className="text-foreground/30 text-xs">
            ZenShorts AI © 2024
          </p>
        </footer>
      </div>
    </main>
  );
}

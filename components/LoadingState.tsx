"use client";

import { Loader2, FileText, Image } from "lucide-react";

interface LoadingStateProps {
  step: "script" | "images";
}

export default function LoadingState({ step }: LoadingStateProps) {
  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <div className="glass-card rounded-2xl p-8 space-y-6">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
          <span className="text-lg font-medium">Generating...</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                step === "script" || step === "images"
                  ? "bg-accent text-white"
                  : "bg-secondary/30 text-foreground/50"
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{
                    width: step === "script" ? "50%" : step === "images" ? "100%" : "0%",
                  }}
                />
              </div>
              <p className="text-sm text-foreground/70 mt-1">
                {step === "script" ? "Creating your script..." : "Script ready!"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                step === "images"
                  ? "bg-accent text-white"
                  : "bg-secondary/30 text-foreground/50"
              }`}
            >
              <Image className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{
                    width: step === "images" ? "100%" : "0%",
                  }}
                />
              </div>
              <p className="text-sm text-foreground/70 mt-1">
                {step === "images" ? "Generating images..." : "Waiting..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

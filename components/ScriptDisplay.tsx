"use client";

import type { Script } from "@/lib/types";
import { Clock, FileText } from "lucide-react";

interface ScriptDisplayProps {
  script: Script;
}

export default function ScriptDisplay({ script }: ScriptDisplayProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-display font-semibold">Generated Script</h2>
        <div className="ml-auto flex items-center gap-2 text-foreground/70">
          <Clock className="w-4 h-4" />
          <span>{script.total_duration}s total</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {script.scenes.map((scene, index) => (
          <div
            key={scene.scene_number}
            className="glass-card rounded-xl p-5 space-y-3 hover:border-accent/30 transition-all duration-300"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-accent font-semibold">Scene {scene.scene_number}</span>
              <span className="text-sm text-foreground/60">{scene.duration}s</span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-foreground/50 uppercase tracking-wide">Narration</p>
              <p className="text-foreground leading-relaxed">{scene.narration}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <p className="text-sm text-foreground/50 uppercase tracking-wide">Image Prompt</p>
              <p className="text-sm text-foreground/70 italic">{scene.image_prompt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

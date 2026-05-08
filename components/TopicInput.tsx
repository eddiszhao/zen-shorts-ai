"use client";

import { Sparkles } from "lucide-react";

interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function TopicInput({ value, onChange, disabled }: TopicInputProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 bg-accent/20 blur-xl rounded-3xl" />
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter your video topic... (e.g., 'The art of mindfulness in daily life')"
            className="w-full h-32 p-6 bg-primary/80 border border-white/10 rounded-2xl text-foreground placeholder-foreground/50 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all duration-300 resize-none font-sans"
            maxLength={200}
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-foreground/50 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>{value.length}/200</span>
          </div>
        </div>
      </div>
    </div>
  );
}

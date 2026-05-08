"use client";

import { Play } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function GenerateButton({ onClick, disabled, loading }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="group relative px-8 py-4 bg-gradient-to-r from-accent to-orange-400 text-white font-semibold rounded-full shadow-lg hover:shadow-accent/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      <div className="absolute inset-0 bg-accent/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex items-center gap-3">
        <Play className="w-5 h-5" />
        <span>{loading ? "Generating..." : "Generate"}</span>
      </div>
    </button>
  );
}

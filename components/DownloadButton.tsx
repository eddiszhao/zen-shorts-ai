"use client";

import { Download, FileText, Image as ImageIcon } from "lucide-react";
import { downloadBase64Image, downloadTextFile, formatScriptAsText } from "@/lib/utils";
import type { Script } from "@/lib/types";

interface DownloadButtonProps {
  script: Script;
  images: string[];
}

export default function DownloadButton({ script, images }: DownloadButtonProps) {
  const handleDownloadScript = () => {
    const text = formatScriptAsText(script);
    downloadTextFile(text, `zenshorts-script-${Date.now()}.txt`);
  };

  const handleDownloadImages = () => {
    images.forEach((image, index) => {
      if (image) {
        setTimeout(() => {
          downloadBase64Image(image, `zenshorts-scene-${index + 1}.png`);
        }, index * 200);
      }
    });
  };

  const handleDownloadAll = () => {
    handleDownloadScript();
    setTimeout(handleDownloadImages, 300);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
      <button
        onClick={handleDownloadAll}
        className="group relative px-6 py-3 bg-accent text-white font-medium rounded-full hover:bg-accent/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-accent/30"
      >
        <div className="absolute inset-0 bg-accent/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center gap-2">
          <Download className="w-5 h-5" />
          <span>Download All</span>
        </div>
      </button>

      <button
        onClick={handleDownloadScript}
        className="group px-6 py-3 bg-secondary/50 text-foreground font-medium rounded-full hover:bg-secondary/70 transition-all duration-300 flex items-center gap-2"
      >
        <FileText className="w-5 h-5" />
        <span>Script Only</span>
      </button>

      <button
        onClick={handleDownloadImages}
        className="group px-6 py-3 bg-secondary/50 text-foreground font-medium rounded-full hover:bg-secondary/70 transition-all duration-300 flex items-center gap-2"
      >
        <ImageIcon className="w-5 h-5" />
        <span>Images Only</span>
      </button>
    </div>
  );
}

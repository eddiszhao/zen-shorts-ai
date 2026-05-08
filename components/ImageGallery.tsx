"use client";

import { Image as ImageIcon } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  onImageClick?: (index: number) => void;
}

export default function ImageGallery({ images, onImageClick }: ImageGalleryProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <ImageIcon className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-display font-semibold">Generated Images</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => onImageClick?.(index)}
            className={`relative aspect-square rounded-xl overflow-hidden group cursor-pointer ${
              image ? "" : "bg-secondary/30"
            }`}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {image ? (
              <>
                <img
                  src={image}
                  alt={`Generated image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm">Scene {index + 1}</p>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-foreground/50">
                <ImageIcon className="w-12 h-12" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

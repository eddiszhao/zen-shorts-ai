export function validateTopic(topic: string): boolean {
  const trimmed = topic.trim();
  return trimmed.length >= 3 && trimmed.length <= 200;
}

export function formatDuration(seconds: number): string {
  return `${seconds}s`;
}

export function downloadBase64Image(base64Data: string, filename: string): void {
  const link = document.createElement("a");
  link.href = base64Data;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatScriptAsText(script: any): string {
  let text = `ZenShorts AI - Video Script\n`;
  text += `Topic: ${script.topic}\n`;
  text += `Total Duration: ${script.total_duration}s\n\n`;

  script.scenes.forEach((scene: any) => {
    text += `Scene ${scene.scene_number} (${scene.duration}s)\n`;
    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `Narration: ${scene.narration}\n\n`;
    text += `Image Prompt: ${scene.image_prompt}\n\n`;
  });

  return text;
}

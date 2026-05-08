export const SCRIPT_GENERATION_PROMPT = `Create a 30-second English narration script for a faceless video, split into exactly 4 scenes. Each scene should be 7-8 seconds long.

Topic: {topic}

Requirements:
- Include emotional hooks in the opening
- Suitable for TikTok/YouTube Shorts
- Cinematic and zen aesthetic
- Each scene needs: narration, image_prompt, duration

Output format: JSON with the following structure:
{
  "topic": "the user topic",
  "total_duration": 30,
  "scenes": [
    {
      "scene_number": 1,
      "narration": "English narration text for this scene",
      "image_prompt": "Detailed image generation prompt in English",
      "duration": 7
    },
    ... (4 scenes total)
  ]
}

The image_prompt should be cinematic, zen-like, and suitable for faceless videos.`;

export interface Scene {
  scene_number: number;
  narration: string;
  image_prompt: string;
  duration: number;
}

export interface Script {
  topic: string;
  total_duration: number;
  scenes: Scene[];
}

export interface AppState {
  topic: string;
  isLoading: boolean;
  currentStep: "idle" | "script" | "images" | "complete";
  error: string | null;
  script: Script | null;
  images: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface GenerateRequest {
  topic: string;
}

export interface GenerateResponse {
  script: Script;
  images: string[];
}

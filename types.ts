
export enum AnimationRow {
  IDLE = 0,
  HAPPY_LOVE = 1,
  EXCITED_CELEBRATE = 2,
  SLEEPY_SNORING = 3,
  WORKING = 4,
  ANGRY_SHY = 5,
  DRAGGING = 6
}

export const ANIMATION_LABELS: Record<AnimationRow, { title: string; desc: string }> = {
  [AnimationRow.IDLE]: { title: "Idle", desc: "Breathing & Blinking" },
  [AnimationRow.HAPPY_LOVE]: { title: "Happy / Love", desc: "Heart expressions" },
  [AnimationRow.EXCITED_CELEBRATE]: { title: "Excited", desc: "Celebration & Joy" },
  [AnimationRow.SLEEPY_SNORING]: { title: "Sleepy", desc: "Closed eyes breathing" },
  [AnimationRow.WORKING]: { title: "Working", desc: "Using tools/screens" },
  [AnimationRow.ANGRY_SHY]: { title: "Angry / Shy", desc: "Surprised or upset" },
  [AnimationRow.DRAGGING]: { title: "Dragging", desc: "Motion / Being pulled" }
};

export interface SpriteConfig {
  columns: number;
  rows: number;
  fps: number;
  chromaKey: string;
  threshold: number;
}

export type GenModel = 'gemini-3-pro-image-preview' | 'gemini-2.5-flash-image' | 'custom';

export interface ModelConfig {
  type: GenModel;
  customUrl?: string;
  customApiKey?: string;
  customModelName?: string;
}

export const MODEL_DETAILS: Record<GenModel, { name: string; desc: string; badge: string; accent: string }> = {
  'gemini-3-pro-image-preview': {
    name: 'Gemini 3 Pro',
    desc: 'Highest fidelity 2K sprites. Requires Gemini API key.',
    badge: 'HQ',
    accent: 'indigo'
  },
  'gemini-2.5-flash-image': {
    name: 'Gemini 2.5 Flash',
    desc: 'Fast, efficient 1K sprites. Standard key required.',
    badge: 'FAST',
    accent: 'pink'
  },
  'custom': {
    name: 'Custom Provider',
    desc: 'Use your own API endpoint (OpenAI, Local, etc.)',
    badge: 'DIY',
    accent: 'emerald'
  }
};

// Shared TypeScript types for AashishOS

export interface Project {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  tech_stack: string[];
  status: "active" | "in-progress" | "planned";
  github_url?: string;
  live_url?: string;
  image_url?: string;
  featured: boolean;
  created_at: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "locked";
  category: string;
  xp_reward: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked_at?: string;
  created_at: string;
}

export interface LogbookEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  week: string;
  created_at: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export interface Skill {
  name: string;
  category: string;
  level: "beginner" | "learning" | "intermediate" | "advanced";
  color: string;
  size: number;
  description: string;
}

export interface JourneyLevel {
  level: number;
  title: string;
  description: string;
  date: string;
  xp: number;
  unlocked: boolean;
  icon: string;
}

export interface AppWindow {
  id: string;
  title: string;
  icon: string;
  component: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

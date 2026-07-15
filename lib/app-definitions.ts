export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  mobile?: boolean;
}

export const APP_DEFINITIONS: Record<string, AppDefinition> = {
  about: {
    id: "about",
    name: "About",
    icon: "👨‍💻",
    description: "Personal profile & background",
    color: "#4fc3f7",
  },
  projects: {
    id: "projects",
    name: "Projects",
    icon: "🧪",
    description: "Featured work & experiments",
    color: "#64b5f6",
  },
  skills: {
    id: "skills",
    name: "Skills",
    icon: "🪐",
    description: "Technical skill galaxy",
    color: "#90caf9",
  },
  missions: {
    id: "missions",
    name: "Missions",
    icon: "🎯",
    description: "Active goals & progress",
    color: "#4ade80",
  },
  journey: {
    id: "journey",
    name: "Journey",
    icon: "⚔️",
    description: "Level-up progression",
    color: "#fbbf24",
  },
  logbook: {
    id: "logbook",
    name: "Logbook",
    icon: "📖",
    description: "Activity timeline",
    color: "#f472b6",
  },
  achievements: {
    id: "achievements",
    name: "Achievements",
    icon: "🏆",
    description: "Unlocked milestones",
    color: "#c084fc",
  },
  ai: {
    id: "ai",
    name: "AI Core",
    icon: "🤖",
    description: "Ask Aashish AI anything",
    color: "#4fc3f7",
    mobile: true,
  },
  contact: {
    id: "contact",
    name: "Contact",
    icon: "📡",
    description: "Send a transmission",
    color: "#22d3ee",
    mobile: true,
  },
};

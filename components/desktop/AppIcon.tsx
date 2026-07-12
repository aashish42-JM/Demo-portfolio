"use client";

import { motion } from "framer-motion";
import { AppWindow } from "@/types";

interface AppIconProps {
  app: AppWindow;
  onOpen: (id: string) => void;
  index: number;
}

const APP_DESCRIPTIONS: Record<string, string> = {
  about: "Learn about my background",
  projects: "View my development projects",
  skills: "Explore my technical skills",
  missions: "See my current goals",
  journey: "Follow my career path",
  logbook: "Read my development logs",
  achievements: "View my achievements",
  ai: "Ask me anything about my portfolio",
  contact: "Get in touch with me",
};

export default function AppIcon({ app, onOpen, index }: AppIconProps) {
    return (
      <motion.button
        id={`app-icon-${app.id}`}
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: index * 0.07, type: "spring", stiffness: 300, damping: 25 }}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onOpen(app.id)}
        className="flex flex-col items-center gap-2 p-3 rounded-xl group cursor-pointer w-32 focus:outline-none relative"
      >
        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0, y: -10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-[rgba(79,195,247,0.3)] text-[#90caf9]/90 font-mono text-xs z-20 pointer-events-none"
        >
          {APP_DESCRIPTIONS[app.id] || "Open app"}
        </motion.div>

        {/* Icon container */}
        <div className="relative">
          <div className="w-20 h-20 rounded-xl flex items-center justify-center text-5xl
                     bg-gradient-to-br from-[rgba(79,195,247,0.12)] to-[rgba(17,34,64,0.8)]
                     border border-[rgba(79,195,247,0.2)]
                     group-hover:border-[rgba(79,195,247,0.6)]
                     group-hover:shadow-[0_0_40px_rgba(79,195,247,0.45)]
                     transition-all duration-300 backdrop-blur-md">
            {app.icon}
          </div>

        {/* Active indicator */}
        {app.isOpen && !app.isMinimized && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#4fc3f7] shadow-[0_0_10px_#4fc3f7]" />
        )}
      </div>

      {/* Label */}
        <span
          className="font-mono text-xs text-[#90caf9]/70 group-hover:text-[#4fc3f7] transition-colors
                     text-center leading-tight max-w-[120px] truncate"
        >
          {app.title}
        </span>
    </motion.button>
  );
}

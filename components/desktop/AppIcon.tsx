"use client";

import { motion } from "framer-motion";
import { AppWindow } from "@/types";

interface AppIconProps {
  app: AppWindow;
  onOpen: (id: string) => void;
  index: number;
}

export default function AppIcon({ app, onOpen, index }: AppIconProps) {
  return (
    <motion.button
      id={`app-icon-${app.id}`}
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.12, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onOpen(app.id)}
      className="flex flex-col items-center gap-2 p-2 rounded-xl group cursor-pointer w-24 focus:outline-none"
    >
      {/* Icon container */}
      <div className="relative">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
                     bg-gradient-to-br from-[rgba(79,195,247,0.15)] to-[rgba(17,34,64,0.8)]
                     border border-[rgba(79,195,247,0.2)] 
                     group-hover:border-[rgba(79,195,247,0.5)]
                     group-hover:shadow-[0_0_20px_rgba(79,195,247,0.25)]
                     transition-all duration-300 backdrop-blur-sm"
        >
          {app.icon}
        </div>

        {/* Active indicator */}
        {app.isOpen && !app.isMinimized && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#4fc3f7] shadow-[0_0_6px_#4fc3f7]" />
        )}
      </div>

      {/* Label */}
      <span
        className="font-mono text-[10px] text-[#90caf9]/70 group-hover:text-[#4fc3f7] transition-colors
                   text-center leading-tight max-w-[80px] truncate"
      >
        {app.title}
      </span>
    </motion.button>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppWindow } from "@/types";

interface TaskbarProps {
  apps: AppWindow[];
  onAppClick: (id: string) => void;
}

export default function Taskbar({ apps, onAppClick }: TaskbarProps) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const openApps = apps.filter((a) => a.isOpen);

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 h-12 glass-strong border-t border-[rgba(79,195,247,0.15)] z-50
                 flex items-center px-4 gap-2"
    >
      {/* OS Logo */}
      <div className="flex items-center gap-2 pr-3 border-r border-[rgba(79,195,247,0.15)]">
        <div className="w-5 h-5 rounded-full bg-[#4fc3f7] shadow-[0_0_8px_#4fc3f7] animate-pulse-slow" />
        <span className="font-mono text-xs text-[#4fc3f7] tracking-widest font-bold">
          AashishOS
        </span>
      </div>

      {/* Open apps */}
      <div className="flex items-center gap-1 flex-1 overflow-x-auto">
        {openApps.map((app) => (
          <motion.button
            key={app.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onAppClick(app.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs transition-all
                       ${
                         app.isMinimized
                           ? "bg-[rgba(79,195,247,0.08)] text-[#64b5f6]/60 border border-[rgba(79,195,247,0.1)]"
                           : "bg-[rgba(79,195,247,0.15)] text-[#4fc3f7] border border-[rgba(79,195,247,0.3)]"
                       }`}
          >
            <span className="text-sm">{app.icon}</span>
            <span className="hidden sm:inline max-w-[80px] truncate">{app.title.replace(".exe", "")}</span>
          </motion.button>
        ))}
      </div>

      {/* Clock */}
      <div className="flex flex-col items-end pl-3 border-l border-[rgba(79,195,247,0.15)]">
        <span className="font-mono text-xs text-[#4fc3f7] font-bold">{time}</span>
        <span className="font-mono text-[10px] text-[#64b5f6]/60">{date}</span>
      </div>
    </motion.div>
  );
}

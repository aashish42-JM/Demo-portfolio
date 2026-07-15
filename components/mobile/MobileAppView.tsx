"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface MobileAppViewProps {
  app: {
    id: string;
    title: string;
    icon: string;
    component: string;
    color?: string;
  };
  onClose: () => void;
  children: React.ReactNode;
}

export default function MobileAppView({ app, onClose, children }: MobileAppViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 30 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 z-30 flex flex-col bg-[#050816]"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 px-4 h-[52px] shrink-0"
        style={{
          background: "rgba(10,25,47,0.85)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          borderBottom: "1px solid rgba(79,195,247,0.15)",
        }}
      >
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-xl
                   active:bg-[rgba(79,195,247,0.15)]
                   transition-colors"
        >
          <ChevronLeft size={20} className="text-[#4fc3f7]" />
        </button>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-lg shrink-0">{app.icon}</span>
          <span className="font-mono text-xs text-[#64b5f6]/90 tracking-wider truncate">
            {app.title.replace(".exe", "")}
          </span>
        </div>

        <div className="w-2 h-2 rounded-full bg-[#4fc3f7]/70 animate-pulse shrink-0" />
      </div>

      {/* App content */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
        style={{ paddingBottom: "calc(82px + env(safe-area-inset-bottom, 0px))" }}
      >
        {children}
      </div>
    </motion.div>
  );
}

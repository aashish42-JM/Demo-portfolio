"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface MobileAppViewProps {
  app: {
    id: string;
    title: string;
    icon: string;
    component: string;
  };
  onClose: () => void;
  children: React.ReactNode;
}

export default function MobileAppView({ app, onClose, children }: MobileAppViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-40 flex flex-col bg-[#050816] safe-top"
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 px-4 h-14 shrink-0 glass-strong border-b border-[rgba(79,195,247,0.18)]">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-xl
                   hover:bg-[rgba(79,195,247,0.1)] active:bg-[rgba(79,195,247,0.2)]
                   transition-colors"
        >
          <ChevronLeft size={22} className="text-[#4fc3f7]" />
        </button>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xl shrink-0">{app.icon}</span>
          <span className="font-mono text-sm text-[#64b5f6]/90 tracking-wider truncate">
            {app.title.replace(".exe", "")}
          </span>
        </div>

        <div className="w-2.5 h-2.5 rounded-full bg-[#4fc3f7]/70 animate-pulse shrink-0" />
      </div>

      {/* App content */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </motion.div>
  );
}

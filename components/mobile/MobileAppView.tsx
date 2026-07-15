"use client";

import { motion } from "framer-motion";

interface MobileAppViewProps {
  title: string;
  icon: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function MobileAppView({ title, icon, onClose, children }: MobileAppViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 12 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 z-40 flex flex-col"
      style={{
        background: "linear-gradient(180deg, rgba(5,8,22,0.97) 0%, rgba(10,25,47,0.97) 100%)",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Title bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex items-center px-4 py-3 shrink-0"
        style={{
          borderBottom: "1px solid rgba(79,195,247,0.06)",
          background: "rgba(5,8,22,0.5)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-xl active:bg-white/5 transition-colors mr-3"
        >
          <span className="text-[#4fc3f7] text-lg">‹</span>
        </button>

        <span className="text-lg mr-2">{icon}</span>

        <span className="font-mono text-[13px] text-[#90caf9]/80 tracking-wide">
          {title}
        </span>
      </motion.div>

      {/* App content */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

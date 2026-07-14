"use client";

import { motion } from "framer-motion";
import { AppWindow } from "@/types";

interface MobileLauncherProps {
  apps: AppWindow[];
  onOpenApp: (id: string) => void;
}

export default function MobileLauncher({ apps, onOpenApp }: MobileLauncherProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <p className="font-mono text-xs text-[#4fc3f7]/40 tracking-[0.2em] uppercase">
          Welcome to AashishOS
        </p>
      </motion.div>

      {/* App grid - 2 cols on small, 3 on larger */}
      <div className="grid grid-cols-3 gap-3 max-w-[360px] mx-auto">
        {apps.map((app, index) => (
          <motion.button
            key={app.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 25 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onOpenApp(app.id)}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all"
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
                          bg-gradient-to-br from-[rgba(79,195,247,0.12)] to-[rgba(17,34,64,0.8)]
                          border border-[rgba(79,195,247,0.2)]
                          active:border-[rgba(79,195,247,0.5)]
                          active:shadow-[0_0_20px_rgba(79,195,247,0.3)]
                          transition-all duration-200">
              {app.icon}
            </div>

            {/* Label */}
            <span className="font-mono text-[10px] text-[#90caf9]/70 text-center leading-tight max-w-[80px] truncate">
              {app.title.replace(".exe", "")}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

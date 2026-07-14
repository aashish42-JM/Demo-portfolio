"use client";

import { motion } from "framer-motion";

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: "home", icon: "🚀", label: "Home" },
  { id: "apps", icon: "📱", label: "Apps" },
  { id: "ai", icon: "🤖", label: "AI" },
  { id: "contact", icon: "📡", label: "Contact" },
];

export default function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <motion.nav
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-[rgba(79,195,247,0.18)] safe-bottom"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all min-w-[60px]"
            >
              <motion.div
                animate={isActive ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative"
              >
                <span className="text-2xl">{item.icon}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute -inset-2 rounded-full bg-[#4fc3f7]/15"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.div>
              <span
                className={`font-mono text-[10px] transition-colors ${
                  isActive ? "text-[#4fc3f7]" : "text-[#64b5f6]/50"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 w-8 h-0.5 rounded-full bg-[#4fc3f7] shadow-[0_0_8px_rgba(79,195,247,0.6)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}

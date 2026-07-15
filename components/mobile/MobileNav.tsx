"use client";

import { motion, AnimatePresence } from "framer-motion";

interface MobileNavProps {
  activeTab: "home" | "ai" | "contact";
  onTabChange: (tab: "home" | "ai" | "contact") => void;
  onFloatAITap?: () => void;
}

const TABS = [
  { id: "home" as const, label: "Home", icon: "◈" },
  { id: "ai" as const, label: "AI Core", icon: "◉" },
  { id: "contact" as const, label: "Contact", icon: "◇" },
];

export default function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="flex justify-center pb-3 pt-1 px-5">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-1 px-2 py-2 rounded-3xl relative"
          style={{
            background: "linear-gradient(135deg, rgba(17,34,64,0.65) 0%, rgba(5,8,22,0.75) 100%)",
            backdropFilter: "blur(24px) saturate(1.4)",
            WebkitBackdropFilter: "blur(24px) saturate(1.4)",
            border: "1px solid rgba(79,195,247,0.1)",
            boxShadow: `
              0 -2px 20px rgba(79,195,247,0.06),
              0 4px 24px rgba(0,0,0,0.4),
              inset 0 1px 0 rgba(255,255,255,0.04)
            `,
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const isAI = tab.id === "ai";

            return (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center justify-center outline-none"
                style={{
                  width: isAI ? 64 : 60,
                  height: 52,
                }}
                whileTap={{ scale: 0.92 }}
              >
                {/* Active glow for center AI button */}
                {isAI && isActive && (
                  <motion.div
                    layoutId="navAIGlow"
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: "radial-gradient(ellipse at center, rgba(79,195,247,0.15) 0%, transparent 70%)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Active indicator pill */}
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute rounded-2xl"
                    style={{
                      inset: isAI ? "-2px" : "0px",
                      border: isAI ? "1px solid rgba(79,195,247,0.25)" : "1px solid rgba(79,195,247,0.15)",
                      background: isAI
                        ? "rgba(79,195,247,0.08)"
                        : "rgba(79,195,247,0.05)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <span
                  className="relative z-10 transition-colors duration-300"
                  style={{
                    fontSize: isAI ? 22 : 18,
                    color: isActive ? "#4fc3f7" : "rgba(144,202,249,0.35)",
                    textShadow: isActive && isAI ? "0 0 12px rgba(79,195,247,0.5)" : "none",
                  }}
                >
                  {tab.icon}
                </span>

                {/* Label */}
                <span
                  className="relative z-10 font-mono mt-1 transition-colors duration-300"
                  style={{
                    fontSize: 8,
                    letterSpacing: "0.1em",
                    color: isActive ? "#90caf9" : "rgba(144,202,249,0.25)",
                  }}
                >
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

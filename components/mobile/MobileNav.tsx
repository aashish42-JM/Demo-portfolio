"use client";

import { motion } from "framer-motion";

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "◈" },
  { id: "core", label: "AI Core", icon: "◉", isCore: true },
  { id: "contact", label: "Contact", icon: "◇" },
];

export default function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28, delay: 0.3 }}
        className="pointer-events-auto w-[calc(100%-32px)] max-w-[380px] mb-3"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="relative rounded-[24px] border border-[rgba(79,195,247,0.18)] backdrop-blur-2xl overflow-hidden"
          style={{
            background: "rgba(10,25,47,0.75)",
            boxShadow: "0 -2px 30px rgba(79,195,247,0.08), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(79,195,247,0.1)",
          }}
        >
          {/* Top glow line */}
          <div className="absolute top-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-[rgba(79,195,247,0.4)] to-transparent" />

          <div className="flex items-center justify-around h-[64px] px-2 relative">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id || (item.id === "core" && activeTab === "galaxy");
              const isCore = item.isCore;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className="relative flex flex-col items-center justify-center gap-[3px] rounded-2xl transition-all duration-200"
                  style={{
                    width: isCore ? 72 : 68,
                    height: 52,
                  }}
                >
                  {/* Active background glow */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: isCore
                          ? "rgba(79,195,247,0.15)"
                          : "rgba(79,195,247,0.08)",
                        border: "1px solid rgba(79,195,247,0.2)",
                        boxShadow: isCore
                          ? "0 0 20px rgba(79,195,247,0.2), inset 0 0 15px rgba(79,195,247,0.1)"
                          : "0 0 12px rgba(79,195,247,0.1)",
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Icon */}
                  <motion.span
                    animate={isActive ? { scale: isCore ? 1.25 : 1.1, y: -1 } : { scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="relative z-10 leading-none"
                    style={{
                      fontSize: isCore ? "24px" : "18px",
                      color: isActive ? "#4fc3f7" : "rgba(100,181,246,0.35)",
                      textShadow: isActive && isCore ? "0 0 12px rgba(79,195,247,0.6)" : "none",
                    }}
                  >
                    {item.icon}
                  </motion.span>

                  {/* Label */}
                  <span
                    className="font-mono relative z-10 leading-none transition-colors duration-200"
                    style={{
                      fontSize: isCore ? "9px" : "8px",
                      color: isActive ? "#4fc3f7" : "rgba(100,181,246,0.3)",
                    }}
                  >
                    {item.label}
                  </span>

                  {/* Active dot */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -bottom-[1px] w-1 h-1 rounded-full bg-[#4fc3f7]"
                      style={{ boxShadow: "0 0 6px rgba(79,195,247,0.8)" }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Core glow effect */}
                  {isCore && isActive && (
                    <motion.div
                      className="absolute inset-[-4px] rounded-2xl pointer-events-none"
                      animate={{
                        boxShadow: [
                          "0 0 15px rgba(79,195,247,0.15)",
                          "0 0 25px rgba(79,195,247,0.25)",
                          "0 0 15px rgba(79,195,247,0.15)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom glow reflection */}
          <div className="absolute bottom-0 left-[25%] right-[25%] h-[1px] bg-gradient-to-r from-transparent via-[rgba(79,195,247,0.15)] to-transparent" />
        </div>
      </motion.nav>
    </div>
  );
}

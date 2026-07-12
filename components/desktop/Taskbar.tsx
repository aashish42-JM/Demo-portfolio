"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppWindow } from "@/types";

interface TaskbarProps {
  apps: AppWindow[];
  onAppClick: (id: string) => void;
  startMenuOpen: boolean;
  setStartMenuOpen: (open: boolean) => void;
  openApp: (id: string) => void;
  setShutDownState: (state: "idle" | "confirming" | "shutdown" | "reboot") => void;
}

const MENU_ITEMS = [
  { id: "about", icon: "👤", label: "About Me" },
  { id: "projects", icon: "🧪", label: "Projects" },
  { id: "skills", icon: "🌌", label: "Skills" },
  { id: "journey", icon: "⚔", label: "Journey" },
  { id: "achievements", icon: "🏆", label: "Achievements" },
  { id: "ai", icon: "🤖", label: "AI Assistant" },
  { id: "contact", icon: "📧", label: "Contact" },
];

const QUICK_ACTIONS = [
  { icon: "🌐", label: "GitHub", href: "https://github.com/aashish42-JM" },
  { icon: "💼", label: "LinkedIn", href: "#" },
  { icon: "✉", label: "Email", href: "mailto:aashish@example.com" },
  { icon: "📄", label: "Download Resume", href: "#" },
];

const POWER_OPTIONS = [
  { icon: "⚙️", label: "Settings" },
  { icon: "🌙", label: "Toggle Dark Mode" },
  { icon: "🔄", label: "Restart UI" },
  { icon: "⏻", label: "Shutdown" },
];

export default function Taskbar({
  apps,
  onAppClick,
  startMenuOpen,
  setStartMenuOpen,
  openApp,
  setShutDownState,
}: TaskbarProps) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const startMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        startMenuRef.current &&
        !startMenuRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('[data-start-button="true"]')
      ) {
        setStartMenuOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('[data-notifications-button="true"]')
      ) {
        setNotificationsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setStartMenuOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setStartMenuOpen]);

  const filteredMenuItems = MENU_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openApps = apps.filter((a) => a.isOpen);

  return (
    <>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 h-14 glass-strong border-t border-[rgba(79,195,247,0.18)] z-50 flex items-center px-6 gap-4 shadow-[0_-5px_30px_rgba(79,195,247,0.1)]"
      >
        {/* Start Button */}
        <button
          data-start-button="true"
          onClick={() => {
            setStartMenuOpen(!startMenuOpen);
            setNotificationsOpen(false);
          }}
          className="flex items-center gap-3 pr-4 pl-3 py-2 rounded-xl border border-transparent hover:border-[rgba(79,195,247,0.3)] hover:bg-[rgba(79,195,247,0.1)] transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4fc3f7] to-[#38bdf8] shadow-[0_0_15px_rgba(79,195,247,0.5)] animate-pulse-slow flex items-center justify-center">
            <span className="text-lg">🚀</span>
          </div>
          <span className="font-mono text-xs text-[#4fc3f7] tracking-wide font-bold">
            AashishOS
          </span>
        </button>

        {/* Open Apps */}
        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          {openApps.map((app) => (
            <motion.button
              key={app.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.08, y: -2 }}
              onClick={() => onAppClick(app.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm transition-all ${
                app.isMinimized
                  ? "bg-[rgba(79,195,247,0.08)] text-[#64b5f6]/70 border border-[rgba(79,195,247,0.1)]"
                  : "bg-[rgba(79,195,247,0.2)] text-[#4fc3f7] border border-[rgba(79,195,247,0.4)] shadow-[0_0_20px_rgba(79,195,247,0.2)]"
              }`}
            >
              <span className="text-lg">{app.icon}</span>
              <span className="hidden sm:inline max-w-[100px] truncate">
                {app.title.replace(".exe", "")}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Notifications */}
        <button
          data-notifications-button="true"
          onClick={() => {
            setNotificationsOpen(!notificationsOpen);
            setStartMenuOpen(false);
          }}
          className="relative p-2 rounded-xl border border-transparent hover:border-[rgba(79,195,247,0.3)] hover:bg-[rgba(79,195,247,0.1)] transition-all"
        >
          <span className="text-lg">🔔</span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#4fc3f7] rounded-full text-[10px] flex items-center justify-center text-black font-bold shadow-[0_0_8px_rgba(79,195,247,0.8)]">
            2
          </div>
        </button>

        {/* Clock */}
        <div className="flex flex-col items-end pl-4 border-l border-[rgba(79,195,247,0.15)]">
          <span className="font-mono text-sm text-[#4fc3f7] font-bold">{time}</span>
          <span className="font-mono text-[10px] text-[#64b5f6]/60">{date}</span>
        </div>
      </motion.div>

      {/* Start Menu */}
      <AnimatePresence>
        {startMenuOpen && (
          <motion.div
            ref={startMenuRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-16 left-6 z-40 w-96 glass-strong rounded-3xl border border-[rgba(79,195,247,0.3)] shadow-[0_0_60px_rgba(79,195,247,0.2)] backdrop-blur-xl overflow-hidden"
          >
            {/* Search Bar */}
            <div className="p-4 border-b border-[rgba(79,195,247,0.15)]">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/30 border border-[rgba(79,195,247,0.2)]">
                <span className="text-[#4fc3f7]/60">🔍</span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search AashishOS..."
                  className="w-full bg-transparent border-none outline-none text-white/80 font-mono text-sm placeholder-[#64b5f6]/40"
                  autoFocus
                />
              </div>
            </div>

            {/* User Header */}
            <div className="p-6 border-b border-[rgba(79,195,247,0.15)]">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4fc3f7]/30 to-[#1e3a8a]/50 border border-[rgba(79,195,247,0.3)] flex items-center justify-center text-3xl">
                    👤
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#050816] shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                </div>
                <div>
                  <p className="text-[#4fc3f7]/60 font-mono text-xs mb-1">Welcome back,</p>
                  <h2 className="text-white font-semibold text-lg mb-1">Aashish Timalsina</h2>
                  <p className="text-[#64b5f6]/70 font-mono text-xs">BSc CSIT Student • AI Developer</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-4 max-h-72 overflow-y-auto">
              {filteredMenuItems.map((item, idx) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    openApp(item.id);
                    setStartMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-[rgba(79,195,247,0.1)] border border-transparent hover:border-[rgba(79,195,247,0.2)] transition-all"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-white/80 font-mono text-sm">{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Quick Actions & Power */}
            <div className="p-4 border-t border-[rgba(79,195,247,0.15)]">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {QUICK_ACTIONS.map((action, idx) => (
                    <a
                      key={idx}
                      href={action.href}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-xl bg-[rgba(79,195,247,0.1)] border border-[rgba(79,195,247,0.2)] flex items-center justify-center hover:scale-105 hover:shadow-[0_0_20px_rgba(79,195,247,0.3)] transition-all"
                    >
                      <span className="text-lg">{action.icon}</span>
                    </a>
                  ))}
                </div>

                <div className="flex gap-1">
                  {POWER_OPTIONS.slice(0, -1).map((option, idx) => (
                    <button
                      key={idx}
                      className="w-10 h-10 rounded-xl bg-[rgba(79,195,247,0.08)] border border-[rgba(79,195,247,0.15)] flex items-center justify-center hover:bg-[rgba(79,195,247,0.15)] hover:scale-105 transition-all"
                      title={option.label}
                    >
                      <span className="text-lg">{option.icon}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setStartMenuOpen(false);
                      setShutDownState("confirming");
                    }}
                    className="w-10 h-10 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] flex items-center justify-center hover:bg-[rgba(239,68,68,0.2)] hover:scale-105 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all"
                    title="Shutdown"
                  >
                    <span className="text-lg">⏻</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Panel */}
      <AnimatePresence>
        {notificationsOpen && (
          <motion.div
            ref={notificationsRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-16 right-6 z-40 w-80 glass-strong rounded-3xl border border-[rgba(79,195,247,0.3)] shadow-[0_0_60px_rgba(79,195,247,0.2)] backdrop-blur-xl overflow-hidden"
          >
            <div className="p-4 border-b border-[rgba(79,195,247,0.15)]">
              <h3 className="text-white font-semibold font-mono text-lg">Notifications</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="p-4 rounded-2xl bg-[rgba(79,195,247,0.08)] border border-[rgba(79,195,247,0.2)]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">🏆</span>
                  <p className="text-white/90 font-semibold text-sm">New Achievement Unlocked</p>
                </div>
                <p className="text-[#64b5f6]/70 text-xs font-mono">Portfolio v1.0 Deployed</p>
                <p className="text-[#4fc3f7]/40 text-[10px] font-mono mt-1">Just now</p>
              </div>
              <div className="p-4 rounded-2xl bg-[rgba(79,195,247,0.08)] border border-[rgba(79,195,247,0.2)]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">💬</span>
                  <p className="text-white/90 font-semibold text-sm">AI Assistant Ready</p>
                </div>
                <p className="text-[#64b5f6]/70 text-xs font-mono">Ask me anything about Aashish</p>
                <p className="text-[#4fc3f7]/40 text-[10px] font-mono mt-1">5 minutes ago</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

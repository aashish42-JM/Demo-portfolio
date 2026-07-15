"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MISSIONS, JOURNEY_LEVELS, PERSONAL } from "@/lib/data";

const ROTATING_MESSAGES = [
  "Tap the AI Core",
  "Enter the Aashish Galaxy",
  "Explore the AI Universe",
  "Everything begins from the Core",
  "Tap to access the Aashish Galaxy",
];

export default function HomeDashboard() {
  const [time, setTime] = useState<Date | null>(null);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const completedMissions = MISSIONS.filter((m) => m.status === "completed").length;
  const totalXP = JOURNEY_LEVELS.filter((l) => l.unlocked).reduce((acc, l) => acc + l.xp, 0);
  const maxXP = JOURNEY_LEVELS.reduce((acc, l) => acc + l.xp, 0);
  const currentLevel = JOURNEY_LEVELS.filter((l) => l.unlocked).length;

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center overflow-hidden"
      style={{ paddingBottom: "calc(140px + env(safe-area-inset-bottom, 0px))" }}
    >
      {/* Top section: time + status */}
      <div className="w-full px-5 pt-8 pb-4">
        {/* Time */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-5"
        >
          {time && (
            <>
              <div className="font-mono text-[38px] font-light text-white tracking-wider leading-none">
                {formatTime(time)}
              </div>
              <div className="font-mono text-[10px] text-[#4fc3f7]/40 tracking-[0.2em] uppercase mt-2">
                {formatDate(time)}
              </div>
            </>
          )}
        </motion.div>

        {/* Status cards row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-2.5"
        >
          {/* AI Core Status */}
          <div className="flex-1 glass rounded-xl px-3 py-2.5 border border-[rgba(79,195,247,0.15)]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)]" />
              <span className="font-mono text-[8px] text-[#64b5f6]/60 uppercase tracking-wider">AI Core</span>
            </div>
            <span className="font-mono text-[10px] text-[#90caf9]/80">Online</span>
          </div>

          {/* System Status */}
          <div className="flex-1 glass rounded-xl px-3 py-2.5 border border-[rgba(79,195,247,0.15)]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4fc3f7] shadow-[0_0_6px_rgba(79,195,247,0.7)]" />
              <span className="font-mono text-[8px] text-[#64b5f6]/60 uppercase tracking-wider">System</span>
            </div>
            <span className="font-mono text-[10px] text-[#90caf9]/80">v1.0</span>
          </div>

          {/* Level */}
          <div className="flex-1 glass rounded-xl px-3 py-2.5 border border-[rgba(79,195,247,0.15)]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.7)]" />
              <span className="font-mono text-[8px] text-[#64b5f6]/60 uppercase tracking-wider">Level</span>
            </div>
            <span className="font-mono text-[10px] text-[#90caf9]/80">{currentLevel}/{JOURNEY_LEVELS.length}</span>
          </div>
        </motion.div>
      </div>

      {/* Center: Orb area (spacer + rotating message) */}
      <div className="flex-1 flex flex-col items-center justify-end pb-4">
        {/* Rotating prompt message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-4 h-5"
        >
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] text-[#4fc3f7]/50 tracking-[0.15em] text-center"
          >
            {ROTATING_MESSAGES[msgIndex]}
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom widgets */}
      <div className="w-full px-5 pb-2">
        {/* Mission progress */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-xl px-4 py-3 border border-[rgba(79,195,247,0.12)] mb-2.5"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9px] text-[#4fc3f7]/50 uppercase tracking-wider">Mission Progress</span>
            <span className="font-mono text-[9px] text-[#90caf9]/60">{completedMissions}/{MISSIONS.length}</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#4fc3f7] to-[#90caf9]"
              initial={{ width: 0 }}
              animate={{ width: `${(completedMissions / MISSIONS.length) * 100}%` }}
              transition={{ delay: 1, duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* XP bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-xl px-4 py-3 border border-[rgba(79,195,247,0.12)]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9px] text-[#4fc3f7]/50 uppercase tracking-wider">Total XP</span>
            <span className="font-mono text-[9px] text-yellow-400/70">{totalXP.toLocaleString()} / {maxXP.toLocaleString()}</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400/80 to-yellow-300/60"
              initial={{ width: 0 }}
              animate={{ width: `${(totalXP / maxXP) * 100}%` }}
              transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

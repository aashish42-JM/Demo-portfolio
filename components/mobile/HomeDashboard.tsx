"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MISSIONS, JOURNEY_LEVELS, PROJECTS, PERSONAL } from "@/lib/data";

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
  const activeMissions = MISSIONS.filter((m) => m.status === "active").length;
  const totalXP = JOURNEY_LEVELS.filter((l) => l.unlocked).reduce((acc, l) => acc + l.xp, 0);
  const maxXP = JOURNEY_LEVELS.reduce((acc, l) => acc + l.xp, 0);
  const currentLevel = JOURNEY_LEVELS.filter((l) => l.unlocked).length;
  const activeProjects = PROJECTS.filter((p) => p.status === "active").length;

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ paddingBottom: "calc(70px + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-4">
        {/* Time + Date with glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-5 rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(17,34,64,0.6) 0%, rgba(10,25,47,0.5) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(79,195,247,0.15)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(79,195,247,0.1)",
          }}
        >
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-8 h-[1px] bg-gradient-to-r from-[#4fc3f7]/50 to-transparent" />
          <div className="absolute top-0 left-0 w-[1px] h-8 bg-gradient-to-b from-[#4fc3f7]/50 to-transparent" />
          <div className="absolute top-0 right-0 w-8 h-[1px] bg-gradient-to-l from-[#4fc3f7]/50 to-transparent" />
          <div className="absolute top-0 right-0 w-[1px] h-8 bg-gradient-to-b from-[#4fc3f7]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-8 h-[1px] bg-gradient-to-r from-[#4fc3f7]/30 to-transparent" />
          <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-gradient-to-l from-[#4fc3f7]/30 to-transparent" />

          <div className="px-5 py-5 text-center">
            <div className="font-mono text-[42px] font-light text-white tracking-[0.05em] leading-none mb-2"
              style={{ textShadow: "0 0 30px rgba(79,195,247,0.3)" }}
            >
              {time ? formatTime(time) : "--:--:--"}
            </div>
            <div className="font-mono text-[11px] text-[#4fc3f7]/50 tracking-[0.15em] uppercase">
              {time ? formatDate(time) : ""}
            </div>
          </div>

          {/* Bottom glow line */}
          <div className="absolute bottom-0 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[rgba(79,195,247,0.3)] to-transparent" />
        </motion.div>

        {/* System status cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-3 gap-2 mb-4"
        >
          <StatusCard
            label="AI Core"
            value="Online"
            dotColor="bg-green-400"
            dotShadow="rgba(74,222,128,0.7)"
            delay={0.4}
          />
          <StatusCard
            label="System"
            value="v1.0"
            dotColor="bg-[#4fc3f7]"
            dotShadow="rgba(79,195,247,0.7)"
            delay={0.5}
          />
          <StatusCard
            label="Level"
            value={`${currentLevel}/${JOURNEY_LEVELS.length}`}
            dotColor="bg-yellow-400"
            dotShadow="rgba(250,204,21,0.7)"
            delay={0.6}
          />
        </motion.div>

        {/* Mission + Projects row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-2 mb-4"
        >
          <MiniWidget
            icon="🎯"
            label="Missions"
            value={`${completedMissions}/${MISSIONS.length}`}
            sub={`${activeMissions} active`}
            delay={0.55}
          />
          <MiniWidget
            icon="🧪"
            label="Projects"
            value={`${activeProjects}`}
            sub="active labs"
            delay={0.6}
          />
        </motion.div>

        {/* Progress section with glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative rounded-2xl overflow-hidden mb-4"
          style={{
            background: "linear-gradient(135deg, rgba(17,34,64,0.5) 0%, rgba(10,25,47,0.4) 100%)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(79,195,247,0.12)",
          }}
        >
          <div className="px-4 py-3.5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-[9px] text-[#4fc3f7]/60 uppercase tracking-[0.15em]">Mission Progress</span>
              <span className="font-mono text-[9px] text-[#90caf9]/70">{completedMissions}/{MISSIONS.length}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #4fc3f7, #90caf9)" }}
                initial={{ width: 0 }}
                animate={{ width: `${(completedMissions / MISSIONS.length) * 100}%` }}
                transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative rounded-2xl overflow-hidden mb-4"
          style={{
            background: "linear-gradient(135deg, rgba(17,34,64,0.5) 0%, rgba(10,25,47,0.4) 100%)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(79,195,247,0.12)",
          }}
        >
          <div className="px-4 py-3.5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-[9px] text-[#4fc3f7]/60 uppercase tracking-[0.15em]">Total XP</span>
              <span className="font-mono text-[9px] text-yellow-400/80">{totalXP.toLocaleString()} / {maxXP.toLocaleString()}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #fbbf24, #f59e0b)" }}
                initial={{ width: 0 }}
                animate={{ width: `${(totalXP / maxXP) * 100}%` }}
                transition={{ delay: 1.2, duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Current Focus / Active Mission */}
        {MISSIONS.filter((m) => m.status === "active").length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="relative rounded-2xl overflow-hidden mb-4"
            style={{
              background: "linear-gradient(135deg, rgba(17,34,64,0.5) 0%, rgba(10,25,47,0.4) 100%)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(79,195,247,0.12)",
            }}
          >
            <div className="px-4 py-3.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4fc3f7] animate-pulse" />
                <span className="font-mono text-[9px] text-[#4fc3f7]/60 uppercase tracking-[0.15em]">Current Focus</span>
              </div>
              <p className="font-mono text-[11px] text-[#90caf9]/80 leading-relaxed">
                {MISSIONS.filter((m) => m.status === "active")[0]?.title}
              </p>
              <p className="font-mono text-[9px] text-[#64b5f6]/50 mt-1">
                {MISSIONS.filter((m) => m.status === "active")[0]?.description?.slice(0, 80)}...
              </p>
            </div>
          </motion.div>
        )}

        {/* Quick info / Bio teaser */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(17,34,64,0.4) 0%, rgba(10,25,47,0.3) 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(79,195,247,0.1)",
          }}
        >
          <div className="px-4 py-3.5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[14px]">👨‍💻</span>
              <span className="font-mono text-[9px] text-[#4fc3f7]/60 uppercase tracking-[0.15em]">Operator</span>
            </div>
            <p className="font-mono text-[11px] text-[#90caf9]/70 leading-relaxed">
              {PERSONAL.name}
            </p>
            <p className="font-mono text-[9px] text-[#64b5f6]/45 mt-1">
              {PERSONAL.title}
            </p>
          </div>
        </motion.div>

        {/* Rotating prompt at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-4 text-center"
        >
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[10px] text-[#4fc3f7]/35 tracking-[0.12em]"
          >
            {ROTATING_MESSAGES[msgIndex]}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatusCard({
  label,
  value,
  dotColor,
  dotShadow,
  delay,
}: {
  label: string;
  value: string;
  dotColor: string;
  dotShadow: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="rounded-xl px-3 py-2.5"
      style={{
        background: "linear-gradient(135deg, rgba(17,34,64,0.5) 0%, rgba(10,25,47,0.4) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(79,195,247,0.12)",
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} style={{ boxShadow: `0 0 6px ${dotShadow}` }} />
        <span className="font-mono text-[7px] text-[#64b5f6]/50 uppercase tracking-wider">{label}</span>
      </div>
      <span className="font-mono text-[10px] text-[#90caf9]/85">{value}</span>
    </motion.div>
  );
}

function MiniWidget({
  icon,
  label,
  value,
  sub,
  delay,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="rounded-xl px-3 py-3"
      style={{
        background: "linear-gradient(135deg, rgba(17,34,64,0.5) 0%, rgba(10,25,47,0.4) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(79,195,247,0.12)",
      }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-[12px]">{icon}</span>
        <span className="font-mono text-[7px] text-[#64b5f6]/50 uppercase tracking-wider">{label}</span>
      </div>
      <div className="font-mono text-[14px] text-white font-medium leading-none mb-0.5">{value}</div>
      <div className="font-mono text-[8px] text-[#64b5f6]/45">{sub}</div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { MISSIONS } from "@/lib/data";
import { CheckCircle2, Circle, Lock, Zap, Target } from "lucide-react";

export default function MissionDashboard() {
  const active = MISSIONS.filter((m) => m.status === "active");
  const completed = MISSIONS.filter((m) => m.status === "completed");
  const totalXP = completed.reduce((acc, m) => acc + m.xp_reward, 0);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-6 sm:space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Mission Dashboard</h1>
            <p className="font-mono text-xs sm:text-sm text-[#64b5f6]/70">
              {completed.length}/{MISSIONS.length} missions completed
            </p>
          </div>
          <div className="glass neon-border rounded-2xl px-6 sm:px-8 py-4 sm:py-5 text-center w-full sm:w-auto">
            <div className="font-mono text-[10px] sm:text-xs text-[#4fc3f7]/70 uppercase tracking-widest mb-2 sm:mb-3">EARNED XP</div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Zap size={20} className="text-yellow-400 sm:hidden" />
              <Zap size={24} className="text-yellow-400 hidden sm:block" />
              <span className="font-mono text-2xl sm:text-3xl font-bold text-yellow-400">
                {totalXP.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs font-mono text-[#64b5f6]/70 mb-4">
            <span>Overall Progress</span>
            <span>{Math.round((completed.length / MISSIONS.length) * 100)}%</span>
          </div>
          <div className="h-5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full xp-bar"
              initial={{ width: 0 }}
              animate={{ width: `${(completed.length / MISSIONS.length) * 100}%` }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Active Missions */}
        <div>
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Target size={20} className="text-[#4fc3f7] sm:hidden" />
            <Target size={24} className="text-[#4fc3f7] hidden sm:block" />
            <h2 className="font-mono text-xs sm:text-sm text-[#4fc3f7]/80 uppercase tracking-widest">
              Active Missions ({active.length})
            </h2>
          </div>
          <div className="space-y-4 sm:space-y-6 mt-4">
            {active.map((mission, i) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="mission-card glass p-4 sm:p-6 rounded-2xl border border-[rgba(79,195,247,0.15)]"
              >
                <div className="flex items-start gap-3 sm:gap-5">
                  <Circle size={22} className="text-[#4fc3f7]/40 shrink-0 mt-1 sm:hidden" />
                  <Circle size={28} className="text-[#4fc3f7]/40 shrink-0 mt-1 hidden sm:block" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <h3 className="font-bold text-base sm:text-xl text-white">{mission.title}</h3>
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <Zap size={14} className="text-yellow-400 sm:hidden" />
                        <Zap size={18} className="text-yellow-400 hidden sm:block" />
                        <span className="font-mono text-xs sm:text-sm text-yellow-400">+{mission.xp_reward} XP</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#64b5f6]/70 mt-2 sm:mt-3 leading-relaxed">
                      {mission.description}
                    </p>
                    <span className="inline-block mt-3 sm:mt-4 text-[10px] sm:text-xs font-mono px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[rgba(79,195,247,0.1)] border border-[rgba(79,195,247,0.2)] text-[#90caf9]/80">
                      {mission.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Completed Missions */}
        <div>
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <CheckCircle2 size={20} className="text-green-400 sm:hidden" />
            <CheckCircle2 size={24} className="text-green-400 hidden sm:block" />
            <h2 className="font-mono text-xs sm:text-sm text-green-400/80 uppercase tracking-widest">
              Completed ({completed.length})
            </h2>
          </div>
          <div className="space-y-4 sm:space-y-6 mt-4">
            {completed.map((mission, i) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-start gap-3 sm:gap-5 p-4 sm:p-6 rounded-2xl border border-green-400/10 bg-green-400/5">
                <CheckCircle2 size={22} className="text-green-400 shrink-0 mt-1 sm:hidden" />
                <CheckCircle2 size={28} className="text-green-400 shrink-0 mt-1 hidden sm:block" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 sm:gap-4">
                    <h3 className="font-bold text-base sm:text-xl text-green-400/80">{mission.title}</h3>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <Zap size={14} className="text-yellow-400 sm:hidden" />
                      <Zap size={18} className="text-yellow-400 hidden sm:block" />
                      <span className="font-mono text-xs sm:text-sm text-yellow-400">{mission.xp_reward} XP</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-white/40 mt-2 sm:mt-3">{mission.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

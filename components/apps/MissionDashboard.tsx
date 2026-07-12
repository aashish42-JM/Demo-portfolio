"use client";

import { motion } from "framer-motion";
import { MISSIONS } from "@/lib/data";
import { CheckCircle2, Circle, Lock, Zap, Target } from "lucide-react";

export default function MissionDashboard() {
  const active = MISSIONS.filter((m) => m.status === "active");
  const completed = MISSIONS.filter((m) => m.status === "completed");
  const totalXP = completed.reduce((acc, m) => acc + m.xp_reward, 0);

  return (
    <div className="p-8 h-full overflow-y-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mission Dashboard</h1>
          <p className="font-mono text-sm text-[#64b5f6]/70">
            {completed.length}/{MISSIONS.length} missions completed
          </p>
        </div>
        <div className="glass neon-border rounded-2xl px-6 py-4 text-center">
          <div className="font-mono text-xs text-[#4fc3f7]/70 uppercase tracking-widest mb-2">EARNED XP</div>
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-yellow-400" />
            <span className="font-mono text-2xl font-bold text-yellow-400">
              {totalXP.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs font-mono text-[#64b5f6]/70 mb-3">
          <span>Overall Progress</span>
          <span>{Math.round((completed.length / MISSIONS.length) * 100)}%</span>
        </div>
        <div className="h-4 bg-white/5 rounded-full overflow-hidden">
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
        <div className="flex items-center gap-3 mb-4">
          <Target size={22} className="text-[#4fc3f7]" />
          <h2 className="font-mono text-sm text-[#4fc3f7]/80 uppercase tracking-widest">
            Active Missions ({active.length})
          </h2>
        </div>
        <div className="space-y-4">
          {active.map((mission, i) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="mission-card glass p-5 rounded-2xl border border-[rgba(79,195,247,0.15)] 
                         hover:border-[rgba(79,195,247,0.35)]"
            >
              <div className="flex items-start gap-4">
                <Circle size={24} className="text-[#4fc3f7]/40 shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-lg text-white">{mission.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <Zap size={16} className="text-yellow-400" />
                      <span className="font-mono text-sm text-yellow-400">+{mission.xp_reward} XP</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#64b5f6]/70 mt-2 leading-relaxed">
                    {mission.description}
                  </p>
                  <span className="inline-block mt-3 text-xs font-mono px-3 py-1.5 rounded-full bg-[rgba(79,195,247,0.1)] border border-[rgba(79,195,247,0.2)] text-[#90caf9]/80">
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
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 size={22} className="text-green-400" />
          <h2 className="font-mono text-sm text-green-400/80 uppercase tracking-widest">
            Completed ({completed.length})
          </h2>
        </div>
        <div className="space-y-4">
          {completed.map((mission, i) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-start gap-4 p-5 rounded-2xl border border-green-400/10 bg-green-400/5"
            >
              <CheckCircle2 size={24} className="text-green-400 shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold text-lg text-green-400/80">{mission.title}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <Zap size={16} className="text-yellow-400" />
                    <span className="font-mono text-sm text-yellow-400">{mission.xp_reward} XP</span>
                  </div>
                </div>
                <p className="text-sm text-white/40 mt-2">{mission.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { JOURNEY_LEVELS } from "@/lib/data";
import { Lock, CheckCircle, Circle, Zap } from "lucide-react";

export default function JourneyApp() {
  const totalXP = JOURNEY_LEVELS.filter((l) => l.unlocked).reduce((acc, l) => acc + l.xp, 0);
  const maxXP = JOURNEY_LEVELS.reduce((acc, l) => acc + l.xp, 0);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Developer Journey</h1>
            <p className="font-mono text-sm text-[#64b5f6]/70">RPG Leveling System</p>
          </div>
          <div className="glass rounded-2xl px-8 py-6 text-right neon-border">
            <div className="font-mono text-xs text-[#4fc3f7]/70 uppercase tracking-widest mb-3">TOTAL XP</div>
            <div className="font-mono text-3xl font-bold text-[#4fc3f7]">
              {totalXP.toLocaleString()}
              <span className="text-sm text-[#64b5f6]/70 ml-3">/ {maxXP.toLocaleString()}</span>
            </div>
            {/* XP bar */}
            <div className="h-2 bg-white/10 rounded-full mt-4 w-56">
              <motion.div
                className="h-full xp-bar"
                initial={{ width: 0 }}
                animate={{ width: `${(totalXP / maxXP) * 100}%` }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-11 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#4fc3f7]/70 via-[#4fc3f7]/30 to-transparent" />

          <div className="space-y-8">
            {JOURNEY_LEVELS.map((lvl, index) => (
              <motion.div
                key={lvl.level}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex gap-8 ${!lvl.unlocked ? "opacity-50" : ""}`}
              >
                {/* Level indicator */}
                <div className="shrink-0 flex flex-col items-center" style={{ width: 88 }}>
                  <div
                    className={`relative w-20 h-20 rounded-3xl flex flex-col items-center justify-center
                                border text-5xl z-10 shadow-xl transition-all
                                ${
                                  lvl.unlocked
                                    ? "bg-gradient-to-br from-[rgba(79,195,247,0.25)] to-[rgba(17,34,64,0.9)] border-[rgba(79,195,247,0.5)] shadow-[0_0_25px_rgba(79,195,247,0.25)]"
                                    : "bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.15)]"
                                }`}
                  >
                    <div>{lvl.icon}</div>
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`flex-1 glass p-6 rounded-2xl border transition-all
                              ${
                                lvl.unlocked
                                  ? "border-[rgba(79,195,247,0.25)] hover:border-[rgba(79,195,247,0.5)]"
                                  : "border-[rgba(255,255,255,0.08)]"
                              }`}
                >
                  <div className="flex items-start justify-between gap-6 mb-4">
                    <div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-sm text-[#4fc3f7]/70 uppercase tracking-widest">LEVEL {lvl.level}</span>
                        {lvl.unlocked ? (
                          <CheckCircle size={20} className="text-green-400" />
                        ) : (
                          <Lock size={20} className="text-white/40" />
                        )}
                      </div>
                      <h3 className="font-bold text-2xl text-white mt-2">{lvl.title}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-sm text-[#64b5f6]/70">{lvl.date}</div>
                      <div className="flex items-center gap-3 mt-3 justify-end">
                        <Zap size={18} className="text-yellow-400" />
                        <span className="font-mono text-sm text-yellow-400">{lvl.xp} XP</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#64b5f6]/80 leading-relaxed">{lvl.description}</p>

                  {!lvl.unlocked && (
                    <div className="mt-5 flex items-center gap-3">
                      <Lock size={16} className="text-white/40" />
                      <span className="font-mono text-xs text-white/40">
                        This chapter is yet to be written...
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { JOURNEY_LEVELS } from "@/lib/data";
import { Lock, CheckCircle, Circle, Zap } from "lucide-react";

export default function JourneyApp() {
  const totalXP = JOURNEY_LEVELS.filter((l) => l.unlocked).reduce((acc, l) => acc + l.xp, 0);
  const maxXP = JOURNEY_LEVELS.reduce((acc, l) => acc + l.xp, 0);

  return (
    <div className="p-8 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Developer Journey</h1>
          <p className="font-mono text-sm text-[#64b5f6]/70">RPG Leveling System</p>
        </div>
        <div className="glass rounded-2xl px-6 py-4 text-right neon-border">
          <div className="font-mono text-xs text-[#4fc3f7]/70 uppercase tracking-widest mb-2">TOTAL XP</div>
          <div className="font-mono text-2xl font-bold text-[#4fc3f7]">
            {totalXP.toLocaleString()}
            <span className="text-sm text-[#64b5f6]/70 ml-2">/ {maxXP.toLocaleString()}</span>
          </div>
          {/* XP bar */}
          <div className="h-2 bg-white/10 rounded-full mt-3 w-48">
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
        <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#4fc3f7]/70 via-[#4fc3f7]/30 to-transparent" />

        <div className="space-y-6">
          {JOURNEY_LEVELS.map((lvl, index) => (
            <motion.div
              key={lvl.level}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex gap-6 ${!lvl.unlocked ? "opacity-50" : ""}`}
            >
              {/* Level indicator */}
              <div className="shrink-0 flex flex-col items-center" style={{ width: 72 }}>
                <div
                  className={`relative w-18 h-18 rounded-3xl flex flex-col items-center justify-center
                              border text-4xl z-10 shadow-xl transition-all
                              ${
                                lvl.unlocked
                                  ? "bg-gradient-to-br from-[rgba(79,195,247,0.25)] to-[rgba(17,34,64,0.9)] border-[rgba(79,195,247,0.5)] shadow-[0_0_25px_rgba(79,195,247,0.25)]"
                                  : "bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.15)]"
                              }`}
                style={{width: '72px', height: '72px'}}
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
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-[#4fc3f7]/70 uppercase tracking-widest">LEVEL {lvl.level}</span>
                      {lvl.unlocked ? (
                        <CheckCircle size={18} className="text-green-400" />
                      ) : (
                        <Lock size={18} className="text-white/40" />
                      )}
                    </div>
                    <h3 className="font-bold text-xl text-white mt-1.5">{lvl.title}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-sm text-[#64b5f6]/70">{lvl.date}</div>
                    <div className="flex items-center gap-2 mt-2 justify-end">
                      <Zap size={16} className="text-yellow-400" />
                      <span className="font-mono text-sm text-yellow-400">{lvl.xp} XP</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#64b5f6]/80 leading-relaxed">{lvl.description}</p>

                {!lvl.unlocked && (
                  <div className="mt-4 flex items-center gap-2">
                    <Lock size={14} className="text-white/40" />
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
  );
}

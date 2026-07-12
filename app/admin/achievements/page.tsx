"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ACHIEVEMENTS } from "@/lib/data";
import { Achievement } from "@/types";
import { Trophy, Lock, Unlock } from "lucide-react";

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);

  const toggleUnlock = (id: string) => {
    setAchievements((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, unlocked_at: a.unlocked_at ? undefined : new Date().toISOString() }
          : a
      )
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Achievements</h1>
        <p className="font-mono text-xs text-[#64b5f6]/60">
          {achievements.filter((a) => a.unlocked_at).length} / {achievements.length} unlocked
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {achievements.map((achievement, i) => {
          const isUnlocked = !!achievement.unlocked_at;
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className={`glass p-4 rounded-xl border ${
                isUnlocked ? "border-yellow-400/30 bg-yellow-400/5" : "border-white/5 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-2xl">{achievement.icon}</span>
                <button
                  onClick={() => toggleUnlock(achievement.id)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    isUnlocked
                      ? "border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                      : "border-white/10 text-white/30 hover:text-white/60"
                  }`}
                  title={isUnlocked ? "Lock" : "Unlock"}
                >
                  {isUnlocked ? <Unlock size={12} /> : <Lock size={12} />}
                </button>
              </div>
              <h3 className={`font-bold text-sm mb-1 ${isUnlocked ? "text-yellow-400/90" : "text-white/40"}`}>
                {achievement.title}
              </h3>
              <p className="text-[10px] text-[#64b5f6]/50 leading-relaxed">{achievement.description}</p>
              {isUnlocked && achievement.unlocked_at && (
                <div className="font-mono text-[9px] text-yellow-400/40 mt-2">
                  {new Date(achievement.unlocked_at).toLocaleDateString()}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

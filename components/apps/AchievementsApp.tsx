"use client";

import { motion } from "framer-motion";
import { ACHIEVEMENTS } from "@/lib/data";
import { Trophy } from "lucide-react";

export default function AchievementsApp() {
  const unlocked = ACHIEVEMENTS.filter((a) => a.unlocked_at);

  return (
    <div className="p-8 h-full overflow-y-auto space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <Trophy className="text-yellow-400" size={28} />
        <div>
          <h1 className="text-2xl font-bold text-white">Achievements</h1>
          <p className="font-mono text-sm text-[#64b5f6]/70">
            {unlocked.length}/{ACHIEVEMENTS.length} unlocked
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {ACHIEVEMENTS.map((achievement, index) => {
          const isUnlocked = !!achievement.unlocked_at;
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.07, type: "spring", stiffness: 300 }}
              className={`glass p-6 rounded-2xl border text-center transition-all hover:scale-105
                          ${
                            isUnlocked
                              ? "border-yellow-400/35 bg-yellow-400/8 hover:border-yellow-400/55 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]"
                              : "border-white/8 opacity-40"
                          }`}
            >
              <div
                className={`text-5xl mb-3 ${isUnlocked ? "" : "grayscale opacity-30"}`}
              >
                {achievement.icon}
              </div>
              <h3
                className={`font-bold text-lg mb-2 ${isUnlocked ? "text-yellow-400/95" : "text-white/35"}`}
              >
                {achievement.title}
              </h3>
              <p className={`text-sm leading-relaxed ${isUnlocked ? "text-[#64b5f6]/80" : "text-white/25"}`}>
                {achievement.description}
              </p>
              {isUnlocked && achievement.unlocked_at && (
                <div className="mt-4 font-mono text-xs text-yellow-400/60">
                  UNLOCKED{" "}
                  {new Date(achievement.unlocked_at).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              )}
              {!isUnlocked && (
                <div className="mt-4 font-mono text-xs text-white/25">🔒 LOCKED</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

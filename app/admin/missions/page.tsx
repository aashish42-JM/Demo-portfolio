"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MISSIONS } from "@/lib/data";
import { Mission } from "@/types";
import { CheckCircle2, Circle, Plus, Trash2, Zap } from "lucide-react";

export default function AdminMissions() {
  const [missions, setMissions] = useState<Mission[]>(MISSIONS);

  const toggleStatus = (id: string) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "completed" ? "active" : "completed" }
          : m
      )
    );
  };

  const deleteMission = (id: string) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Mission Dashboard</h1>
        <p className="font-mono text-xs text-[#64b5f6]/60">{missions.length} missions · {missions.filter(m=>m.status==="completed").length} completed</p>
      </div>

      {["active", "completed"].map((statusGroup) => (
        <div key={statusGroup}>
          <h2 className={`font-mono text-xs uppercase tracking-wider mb-3 flex items-center gap-2 ${statusGroup === "completed" ? "text-green-400/70" : "text-[#4fc3f7]/70"}`}>
            {statusGroup === "completed" ? <CheckCircle2 size={12} /> : <Circle size={12} />}
            {statusGroup} ({missions.filter(m => m.status === statusGroup).length})
          </h2>
          <div className="space-y-2">
            {missions.filter((m) => m.status === statusGroup).map((mission, i) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`glass p-4 rounded-xl border flex items-start gap-3 ${
                  statusGroup === "completed" ? "border-green-400/10 bg-green-400/5" : "border-[rgba(79,195,247,0.15)]"
                }`}
              >
                <button onClick={() => toggleStatus(mission.id)} className="shrink-0 mt-0.5">
                  {mission.status === "completed" ? (
                    <CheckCircle2 size={16} className="text-green-400" />
                  ) : (
                    <Circle size={16} className="text-[#4fc3f7]/40" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`font-bold text-sm ${mission.status === "completed" ? "text-green-400/80 line-through" : "text-white"}`}>
                      {mission.title}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <Zap size={10} className="text-yellow-400" />
                      <span className="font-mono text-[10px] text-yellow-400">{mission.xp_reward} XP</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#64b5f6]/60 mt-0.5">{mission.description}</p>
                </div>
                <button onClick={() => deleteMission(mission.id)} className="p-1.5 rounded-lg text-red-500/40 hover:text-red-400 transition-colors shrink-0">
                  <Trash2 size={12} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

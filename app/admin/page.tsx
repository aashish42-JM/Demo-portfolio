"use client";

import { motion } from "framer-motion";
import { Beaker, Target, Trophy, BookOpen, Users, TrendingUp } from "lucide-react";
import { PROJECTS, MISSIONS, ACHIEVEMENTS, LOGBOOK_ENTRIES } from "@/lib/data";
import Link from "next/link";

const STATS = [
  { label: "Projects", value: PROJECTS.length, icon: Beaker, color: "text-[#4fc3f7]", href: "/admin/projects" },
  { label: "Active Missions", value: MISSIONS.filter((m) => m.status === "active").length, icon: Target, color: "text-yellow-400", href: "/admin/missions" },
  { label: "Achievements", value: ACHIEVEMENTS.filter((a) => a.unlocked_at).length, icon: Trophy, color: "text-green-400", href: "/admin/achievements" },
  { label: "Log Entries", value: LOGBOOK_ENTRIES.length, icon: BookOpen, color: "text-purple-400", href: "/admin/logs" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="font-mono text-xs text-[#64b5f6]/60">
          Manage your AashishOS portfolio content
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="glass p-4 rounded-xl border border-[rgba(79,195,247,0.15)] hover:border-[rgba(79,195,247,0.3)] transition-all cursor-pointer"
              >
                <Icon size={20} className={`${stat.color} mb-2`} />
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="font-mono text-xs text-[#64b5f6]/60 mt-0.5">{stat.label}</div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Quick status */}
      <div className="glass p-5 rounded-xl border border-[rgba(79,195,247,0.15)]">
        <h2 className="font-mono text-sm text-[#4fc3f7]/80 mb-4 flex items-center gap-2">
          <TrendingUp size={14} />
          Quick Status
        </h2>
        <div className="space-y-2">
          {[
            { label: "XP Earned", value: `${MISSIONS.filter(m=>m.status==="completed").reduce((a,m)=>a+m.xp_reward,0).toLocaleString()} XP`, color: "text-yellow-400" },
            { label: "Missions Done", value: `${MISSIONS.filter(m=>m.status==="completed").length} / ${MISSIONS.length}`, color: "text-green-400" },
            { label: "Featured Projects", value: `${PROJECTS.filter(p=>p.featured).length}`, color: "text-[#4fc3f7]" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="font-mono text-xs text-[#64b5f6]/60">{item.label}</span>
              <span className={`font-mono text-sm font-bold ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="glass p-5 rounded-xl border border-[rgba(79,195,247,0.1)]">
        <h2 className="font-mono text-sm text-[#4fc3f7]/60 mb-3">// How to update content</h2>
        <div className="space-y-2 text-xs text-[#64b5f6]/70 font-mono">
          <p>1. Edit <code className="text-[#4fc3f7]">lib/data.ts</code> for static data (projects, skills, missions)</p>
          <p>2. Navigate the sidebar to manage each section</p>
          <p>3. With Supabase connected, data syncs to the DB automatically</p>
          <p>4. Redeploy on Vercel to push updates live</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FolderOpen, Beaker, Target, BookOpen, Trophy, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: Beaker },
  { href: "/admin/missions", label: "Missions", icon: Target },
  { href: "/admin/achievements", label: "Achievements", icon: Trophy },
  { href: "/admin/logs", label: "Logbook", icon: BookOpen },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const pathname = usePathname();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side gate — real auth via Supabase Auth in production
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "aashish2024")) {
      setAuthed(true);
      setError("");
    } else {
      setError("Access denied. Invalid credentials.");
    }
  };

  if (!authed) {
    return (
      <div className="fixed inset-0 boot-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,195,247,0.06)_0%,transparent_70%)]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong neon-border rounded-2xl p-8 w-full max-w-sm relative"
        >
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[rgba(79,195,247,0.1)] border border-[rgba(79,195,247,0.3)] flex items-center justify-center mx-auto mb-3">
              <FolderOpen size={20} className="text-[#4fc3f7]" />
            </div>
            <h1 className="font-mono text-lg font-bold text-white">Admin Panel</h1>
            <p className="font-mono text-xs text-[#64b5f6]/60 mt-1">AashishOS v1.0 — Restricted Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-mono text-xs text-[#4fc3f7]/60 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-3 py-2 rounded-lg bg-black/30 border border-[rgba(79,195,247,0.2)]
                           text-white placeholder-[#64b5f6]/30 text-sm font-mono
                           focus:outline-none focus:border-[rgba(79,195,247,0.5)]"
              />
            </div>
            {error && (
              <p className="font-mono text-xs text-red-400">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-2 rounded-lg font-mono text-sm bg-[rgba(79,195,247,0.15)] 
                         border border-[rgba(79,195,247,0.3)] text-[#4fc3f7]
                         hover:bg-[rgba(79,195,247,0.25)] transition-all"
            >
              Access System
            </button>
          </form>

          <p className="text-center font-mono text-[10px] text-white/20 mt-4">
            Default password: aashish2024 (change in .env)
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex bg-[#050816]">
      {/* Sidebar */}
      <div className="w-56 glass-strong border-r border-[rgba(79,195,247,0.15)] flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-[rgba(79,195,247,0.1)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[rgba(79,195,247,0.15)] border border-[rgba(79,195,247,0.3)] flex items-center justify-center">
              <span className="text-sm">⚙️</span>
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-[#4fc3f7]">Admin Panel</div>
              <div className="font-mono text-[9px] text-[#64b5f6]/50">AashishOS</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-mono text-xs transition-all
                            ${
                              isActive
                                ? "bg-[rgba(79,195,247,0.15)] border border-[rgba(79,195,247,0.3)] text-[#4fc3f7]"
                                : "text-[#64b5f6]/60 hover:text-[#90caf9] hover:bg-[rgba(79,195,247,0.05)]"
                            }`}
              >
                <Icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[rgba(79,195,247,0.1)]">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-xs text-[#64b5f6]/60 hover:text-[#90caf9] transition-colors"
          >
            <span>← Back to OS</span>
          </Link>
          <button
            onClick={() => setAuthed(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-xs text-red-400/60 hover:text-red-400 transition-colors w-full mt-1"
          >
            <LogOut size={12} />
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  );
}

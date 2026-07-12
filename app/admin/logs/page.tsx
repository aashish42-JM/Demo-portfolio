"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LOGBOOK_ENTRIES } from "@/lib/data";
import { LogbookEntry } from "@/types";
import { Plus, Trash2, BookOpen } from "lucide-react";

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export default function AdminLogs() {
  const [entries, setEntries] = useState<LogbookEntry[]>(LOGBOOK_ENTRIES);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", tags: "", week: "" });

  const handleAdd = () => {
    if (!form.title || !form.content) return;
    const now = new Date();
    const newEntry: LogbookEntry = {
      id: String(Date.now()),
      title: form.title,
      content: form.content,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      week: form.week || `Week ${getWeekNumber(now)}, ${now.getFullYear()}`,
      created_at: now.toISOString(),
    };
    setEntries((prev) => [newEntry, ...prev]);
    setIsAdding(false);
    setForm({ title: "", content: "", tags: "", week: "" });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Developer Logbook</h1>
          <p className="font-mono text-xs text-[#64b5f6]/60">{entries.length} entries</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs bg-[rgba(79,195,247,0.15)] border border-[rgba(79,195,247,0.3)] text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.25)] transition-all"
        >
          <Plus size={14} />
          Add Entry
        </button>
      </div>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-5 rounded-xl border border-[rgba(79,195,247,0.3)] space-y-3"
        >
          <h3 className="font-mono text-sm text-[#4fc3f7]">New Log Entry</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] text-[#4fc3f7]/60 block mb-1">Title</label>
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="What did you learn?" className="w-full px-3 py-2 rounded-lg bg-black/30 border border-[rgba(79,195,247,0.2)] text-white text-xs font-mono focus:outline-none focus:border-[rgba(79,195,247,0.4)]" />
            </div>
            <div>
              <label className="font-mono text-[10px] text-[#4fc3f7]/60 block mb-1">Week</label>
              <input value={form.week} onChange={(e) => setForm((p) => ({ ...p, week: e.target.value }))} placeholder="Week 28, 2024" className="w-full px-3 py-2 rounded-lg bg-black/30 border border-[rgba(79,195,247,0.2)] text-white text-xs font-mono focus:outline-none focus:border-[rgba(79,195,247,0.4)]" />
            </div>
          </div>
          <div>
            <label className="font-mono text-[10px] text-[#4fc3f7]/60 block mb-1">Content</label>
            <textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} placeholder="Write your learning notes..." rows={3} className="w-full px-3 py-2 rounded-lg bg-black/30 border border-[rgba(79,195,247,0.2)] text-white text-xs font-mono resize-none focus:outline-none focus:border-[rgba(79,195,247,0.4)]" />
          </div>
          <div>
            <label className="font-mono text-[10px] text-[#4fc3f7]/60 block mb-1">Tags (comma separated)</label>
            <input value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} placeholder="React, JavaScript, AI" className="w-full px-3 py-2 rounded-lg bg-black/30 border border-[rgba(79,195,247,0.2)] text-white text-xs font-mono focus:outline-none focus:border-[rgba(79,195,247,0.4)]" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 rounded-lg font-mono text-xs bg-[rgba(79,195,247,0.2)] border border-[rgba(79,195,247,0.4)] text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.3)] transition-all">Save Entry</button>
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-lg font-mono text-xs border border-white/10 text-white/50 hover:text-white transition-all">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {entries.map((entry, i) => (
          <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="glass p-4 rounded-xl border border-[rgba(79,195,247,0.15)] flex items-start gap-3">
            <BookOpen size={14} className="text-[#4fc3f7]/50 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-bold text-sm text-white">{entry.title}</h3>
                <span className="font-mono text-[10px] text-[#64b5f6]/40">{entry.week}</span>
              </div>
              <p className="text-xs text-[#64b5f6]/60 mb-2 line-clamp-2">{entry.content}</p>
              <div className="flex flex-wrap gap-1">
                {entry.tags.map((t) => <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[rgba(79,195,247,0.08)] text-[#90caf9]/60">{t}</span>)}
              </div>
            </div>
            <button onClick={() => setEntries((prev) => prev.filter((e) => e.id !== entry.id))} className="p-1.5 rounded-lg text-red-500/40 hover:text-red-400 transition-colors shrink-0">
              <Trash2 size={12} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

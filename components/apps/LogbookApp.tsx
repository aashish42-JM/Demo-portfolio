"use client";

import { motion } from "framer-motion";
import { LOGBOOK_ENTRIES } from "@/lib/data";
import { BookOpen, Tag, Calendar } from "lucide-react";

export default function LogbookApp() {
  return (
    <div className="p-8 h-full overflow-y-auto space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <BookOpen className="text-[#4fc3f7]" size={28} />
        <div>
          <h1 className="text-2xl font-bold text-white">Developer Logbook</h1>
          <p className="font-mono text-sm text-[#64b5f6]/70">Daily learning · Weekly progress · Future roadmap</p>
        </div>
      </div>

      {/* Roadmap teaser */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass p-6 rounded-2xl border border-[#4fc3f7]/25 bg-[#4fc3f7]/8"
      >
        <div className="font-mono text-sm text-[#4fc3f7]/70 mb-4 uppercase tracking-widest">
          // Next Chapter
        </div>
        <div className="flex flex-wrap gap-3">
          {["Master React", "Deploy with Vercel", "Learn TypeScript deeply", "Build ML model", "Open source contribution"].map(
            (goal) => (
              <span
                key={goal}
                className="text-sm font-mono px-4 py-2 rounded-full bg-[rgba(79,195,247,0.15)] border border-[rgba(79,195,247,0.25)] text-[#90caf9]"
              >
                → {goal}
              </span>
            )
          )}
        </div>
      </motion.div>

      {/* Log entries */}
      {LOGBOOK_ENTRIES.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass p-6 rounded-2xl border border-[rgba(79,195,247,0.15)] hover:border-[rgba(79,195,247,0.35)] transition-all"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="font-bold text-lg text-white">{entry.title}</h3>
            <div className="flex items-center gap-2 shrink-0 text-[#64b5f6]/60">
              <Calendar size={14} />
              <span className="font-mono text-xs">{entry.week}</span>
            </div>
          </div>

          <p className="text-sm text-[#64b5f6]/80 leading-relaxed mb-4">{entry.content}</p>

          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full 
                           bg-[rgba(79,195,247,0.1)] border border-[rgba(79,195,247,0.2)] text-[#90caf9]/80"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Write more CTA */}
      <div className="text-center py-6">
        <p className="font-mono text-sm text-white/30">More entries coming soon...</p>
        <div className="flex justify-center mt-4">
          <div className="w-16 h-px bg-[rgba(79,195,247,0.3)]" />
        </div>
      </div>
    </div>
  );
}

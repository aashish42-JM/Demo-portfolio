"use client";

import { motion } from "framer-motion";
import { LOGBOOK_ENTRIES } from "@/lib/data";
import { BookOpen, Tag, Calendar } from "lucide-react";

export default function LogbookApp() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-5 sm:space-y-8">
        <div className="flex items-center gap-3 sm:gap-5">
          <BookOpen className="text-[#4fc3f7]" size={28} />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Developer Logbook</h1>
            <p className="font-mono text-xs sm:text-sm text-[#64b5f6]/70">Daily learning · Weekly progress · Future roadmap</p>
          </div>
        </div>

        {/* Roadmap teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass p-4 sm:p-6 rounded-2xl border border-[#4fc3f7]/25 bg-[#4fc3f7]/8"
        >
          <div className="font-mono text-xs sm:text-sm text-[#4fc3f7]/70 mb-4 sm:mb-5 uppercase tracking-widest">
            // Next Chapter
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {["Master React", "Deploy with Vercel", "Learn TypeScript deeply", "Build ML model", "Open source contribution"].map(
              (goal) => (
                <span
                  key={goal}
                  className="text-xs sm:text-sm font-mono px-3 sm:px-5 py-2 sm:py-3 rounded-full bg-[rgba(79,195,247,0.15)] border border-[rgba(79,195,247,0.25)] text-[#90caf9]"
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
            className="glass p-4 sm:p-6 rounded-2xl border border-[rgba(79,195,247,0.15)] hover:border-[rgba(79,195,247,0.35)] transition-all"
          >
            <div className="flex items-start justify-between gap-3 sm:gap-5 mb-3 sm:mb-4">
              <h3 className="font-bold text-lg sm:text-xl text-white">{entry.title}</h3>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-[#64b5f6]/60">
                <Calendar size={14} className="sm:hidden" />
                <Calendar size={16} className="hidden sm:block" />
                <span className="font-mono text-[10px] sm:text-xs">{entry.week}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#64b5f6]/80 leading-relaxed mb-4 sm:mb-5">{entry.content}</p>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs font-mono px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full
                             bg-[rgba(79,195,247,0.1)] border border-[rgba(79,195,247,0.2)] text-[#90caf9]/80"
                >
                  <Tag size={12} className="sm:hidden" />
                  <Tag size={14} className="hidden sm:block" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Write more CTA */}
        <div className="text-center py-6 sm:py-8">
          <p className="font-mono text-xs sm:text-sm text-white/30">More entries coming soon...</p>
          <div className="flex justify-center mt-4 sm:mt-5">
            <div className="w-16 sm:w-20 h-px bg-[rgba(79,195,247,0.3)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

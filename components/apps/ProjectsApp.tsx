"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, GitFork, ChevronDown, ChevronUp, Beaker, Zap } from "lucide-react";
import { PROJECTS } from "@/lib/data";
import { Project } from "@/types";

export default function ProjectsApp() {
  const [expanded, setExpanded] = useState<string | null>("1");

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-5 sm:space-y-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <Beaker className="text-[#4fc3f7]" size={28} />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Research Labs</h1>
            <p className="font-mono text-xs sm:text-sm text-[#64b5f6]/70">
              {PROJECTS.length} active projects in the lab
            </p>
          </div>
        </div>

        {PROJECTS.map((project, index) => (
          <LabCard
            key={project.id}
            project={project}
            index={index}
            isExpanded={expanded === project.id}
            onToggle={() => setExpanded(expanded === project.id ? null : project.id)}
          />
        ))}
      </div>
    </div>
  );
}

function LabCard({
  project,
  index,
  isExpanded,
  onToggle,
}: {
  project: Project;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const statusColors = {
    active: "text-green-400 bg-green-400/10 border-green-400/30",
    "in-progress": "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    planned: "text-[#64b5f6] bg-[#64b5f6]/10 border-[#64b5f6]/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="lab-card"
    >
      <button
        onClick={onToggle}
        className="w-full p-4 sm:p-6 flex items-start gap-4 sm:gap-6 text-left"
      >
        {/* Lab number */}
        <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[rgba(79,195,247,0.12)] border border-[rgba(79,195,247,0.25)] flex items-center justify-center font-mono text-xs sm:text-base text-[#4fc3f7] font-bold">
          L{String(index + 1).padStart(2, "0")}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2 sm:mb-3">
            <h2 className="font-bold text-base sm:text-xl text-white">{project.title}</h2>
            <span
              className={`shrink-0 text-[10px] sm:text-xs font-mono px-3 sm:px-5 py-1 sm:py-2 rounded-full border ${statusColors[project.status]}`}
            >
              {project.status}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64b5f6]/80 leading-loose mb-3 sm:mb-4">{project.description}</p>

          {/* Tech stack preview */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {project.tech_stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-xs sm:text-sm font-mono px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[rgba(79,195,247,0.1)] text-[#90caf9]/80"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="text-xs sm:text-sm font-mono px-2.5 sm:px-4 py-1.5 sm:py-2 text-[#64b5f6]/60">
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 text-[#64b5f6]/50 mt-1">
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-[rgba(79,195,247,0.12)] pt-4 sm:pt-6 space-y-4 sm:space-y-6">
              {/* Description */}
              <p className="text-sm sm:text-base text-[#90caf9]/85 leading-loose">
                {project.long_description}
              </p>

              {/* Full tech stack */}
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Zap size={16} className="text-[#4fc3f7] sm:hidden" />
                  <Zap size={20} className="text-[#4fc3f7] hidden sm:block" />
                  <span className="font-mono text-xs sm:text-sm text-[#4fc3f7]/70 uppercase tracking-widest">Tech Stack</span>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {project.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs sm:text-sm font-mono px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[rgba(79,195,247,0.12)] border border-[rgba(79,195,247,0.2)] text-[#90caf9]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-mono text-xs sm:text-sm
                               bg-[rgba(79,195,247,0.12)] border border-[rgba(79,195,247,0.25)]
                               text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.2)] transition-all"
                  >
                    <GitFork size={16} />
                    Source Code
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-mono text-xs sm:text-sm
                               bg-[rgba(79,195,247,0.18)] border border-[rgba(79,195,247,0.35)]
                               text-white hover:bg-[rgba(79,195,247,0.28)] transition-all"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

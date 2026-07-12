"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, GitFork, ChevronDown, ChevronUp, Beaker, Zap } from "lucide-react";
import { PROJECTS } from "@/lib/data";
import { Project } from "@/types";

export default function ProjectsApp() {
  const [expanded, setExpanded] = useState<string | null>("1");

  return (
    <div className="p-8 h-full overflow-y-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Beaker className="text-[#4fc3f7]" size={28} />
        <div>
          <h1 className="text-2xl font-bold text-white">Research Labs</h1>
          <p className="font-mono text-sm text-[#64b5f6]/70">
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
        className="w-full p-6 flex items-start gap-6 text-left"
      >
        {/* Lab number */}
        <div className="shrink-0 w-14 h-14 rounded-xl bg-[rgba(79,195,247,0.12)] border border-[rgba(79,195,247,0.25)] flex items-center justify-center font-mono text-sm text-[#4fc3f7] font-bold">
          L{String(index + 1).padStart(2, "0")}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="font-bold text-white text-lg">{project.title}</h2>
            <span
              className={`shrink-0 text-xs font-mono px-4 py-1.5 rounded-full border ${statusColors[project.status]}`}
            >
              {project.status}
            </span>
          </div>
          <p className="text-sm text-[#64b5f6]/80 leading-relaxed mb-3">{project.description}</p>

          {/* Tech stack preview */}
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[rgba(79,195,247,0.1)] text-[#90caf9]/80"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="text-xs font-mono px-3 py-1.5 text-[#64b5f6]/60">
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
            <div className="px-6 pb-6 border-t border-[rgba(79,195,247,0.12)] pt-5 space-y-5">
              {/* Description */}
              <p className="text-base text-[#90caf9]/85 leading-relaxed">
                {project.long_description}
              </p>

              {/* Full tech stack */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={18} className="text-[#4fc3f7]" />
                  <span className="font-mono text-sm text-[#4fc3f7]/70 uppercase tracking-widest">Tech Stack</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-sm font-mono px-4 py-2 rounded-lg bg-[rgba(79,195,247,0.12)] border border-[rgba(79,195,247,0.2)] text-[#90caf9]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-3">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-sm
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
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-sm
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

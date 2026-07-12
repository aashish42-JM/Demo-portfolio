"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/data";
import { Project } from "@/types";
import { Plus, Edit, Trash2, ExternalLink, GitFork } from "lucide-react";

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    tech_stack: "",
    github_url: "",
    live_url: "",
    status: "active" as const,
  });

  const handleAdd = () => {
    if (!form.title || !form.description) return;
    const newProject: Project = {
      id: String(Date.now()),
      title: form.title,
      description: form.description,
      tech_stack: form.tech_stack.split(",").map((t) => t.trim()),
      github_url: form.github_url,
      live_url: form.live_url,
      status: form.status,
      featured: false,
      created_at: new Date().toISOString(),
    };
    setProjects((prev) => [...prev, newProject]);
    setIsAdding(false);
    setForm({ title: "", description: "", tech_stack: "", github_url: "", live_url: "", status: "active" });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Projects Lab</h1>
          <p className="font-mono text-xs text-[#64b5f6]/60">{projects.length} projects</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs
                     bg-[rgba(79,195,247,0.15)] border border-[rgba(79,195,247,0.3)] text-[#4fc3f7]
                     hover:bg-[rgba(79,195,247,0.25)] transition-all"
        >
          <Plus size={14} />
          Add Project
        </button>
      </div>

      {/* Add form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-5 rounded-xl border border-[rgba(79,195,247,0.3)] space-y-3"
        >
          <h3 className="font-mono text-sm text-[#4fc3f7]">New Project</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "title", placeholder: "Project title", label: "Title" },
              { key: "status", placeholder: "active", label: "Status" },
              { key: "github_url", placeholder: "GitHub URL", label: "GitHub" },
              { key: "live_url", placeholder: "Live URL", label: "Live URL" },
            ].map((f) => (
              <div key={f.key}>
                <label className="font-mono text-[10px] text-[#4fc3f7]/60 block mb-1">{f.label}</label>
                <input
                  value={(form as any)[f.key]}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-[rgba(79,195,247,0.2)]
                             text-white text-xs font-mono focus:outline-none focus:border-[rgba(79,195,247,0.4)]"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="font-mono text-[10px] text-[#4fc3f7]/60 block mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Project description"
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-[rgba(79,195,247,0.2)]
                         text-white text-xs font-mono resize-none focus:outline-none focus:border-[rgba(79,195,247,0.4)]"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] text-[#4fc3f7]/60 block mb-1">Tech Stack (comma separated)</label>
            <input
              value={form.tech_stack}
              onChange={(e) => setForm((p) => ({ ...p, tech_stack: e.target.value }))}
              placeholder="React, Node.js, PostgreSQL"
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-[rgba(79,195,247,0.2)]
                         text-white text-xs font-mono focus:outline-none focus:border-[rgba(79,195,247,0.4)]"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 rounded-lg font-mono text-xs bg-[rgba(79,195,247,0.2)] border border-[rgba(79,195,247,0.4)] text-[#4fc3f7] hover:bg-[rgba(79,195,247,0.3)] transition-all">
              Save Project
            </button>
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-lg font-mono text-xs border border-white/10 text-white/50 hover:text-white transition-all">
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Project list */}
      <div className="space-y-3">
        {projects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass p-4 rounded-xl border border-[rgba(79,195,247,0.15)] flex items-start gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-sm text-white">{p.title}</h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  p.status === "active" ? "text-green-400 border-green-400/30 bg-green-400/10" : "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                }`}>{p.status}</span>
              </div>
              <p className="text-xs text-[#64b5f6]/60 mb-2">{p.description}</p>
              <div className="flex flex-wrap gap-1">
                {p.tech_stack.map((t) => (
                  <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[rgba(79,195,247,0.08)] text-[#90caf9]/60">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-[rgba(79,195,247,0.15)] text-[#64b5f6]/60 hover:text-[#4fc3f7] transition-colors"><GitFork size={12} /></a>}
              {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-[rgba(79,195,247,0.15)] text-[#64b5f6]/60 hover:text-[#4fc3f7] transition-colors"><ExternalLink size={12} /></a>}
              <button onClick={() => setProjects((prev) => prev.filter((x) => x.id !== p.id))} className="p-2 rounded-lg border border-red-500/20 text-red-500/50 hover:text-red-400 hover:border-red-500/40 transition-colors">
                <Trash2 size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

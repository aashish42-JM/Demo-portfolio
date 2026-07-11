"use client";

import { motion } from "framer-motion";
import { MapPin, GraduationCap, Github, Linkedin, Mail, Phone, Globe, Target, Eye } from "lucide-react";
import { PERSONAL } from "@/lib/data";

export default function AboutApp() {
  return (
    <div className="p-6 h-full overflow-y-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-5"
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4fc3f7] to-[#0a192f] flex items-center justify-center text-4xl border border-[rgba(79,195,247,0.3)] shadow-[0_0_30px_rgba(79,195,247,0.2)]">
            👨‍💻
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#050816] flex items-center justify-center">
            <span className="text-[8px]">✓</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white mb-1">{PERSONAL.name}</h1>
          <p className="text-sm text-[#4fc3f7] font-mono mb-3">{PERSONAL.title}</p>
          <div className="flex flex-wrap gap-2">
            <Chip icon={<MapPin size={10} />} text={PERSONAL.location} />
            <Chip icon={<GraduationCap size={10} />} text="BSc CSIT" />
            <Chip icon={<span className="text-[10px]">🎓</span>} text={PERSONAL.college} />
          </div>
        </div>
      </motion.div>

      {/* Bio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-4 rounded-xl border border-[rgba(79,195,247,0.15)]"
      >
        <h2 className="font-mono text-xs text-[#4fc3f7]/60 uppercase tracking-wider mb-3">
          // Who I Am
        </h2>
        <p className="text-[#90caf9]/80 text-sm leading-relaxed">{PERSONAL.bio}</p>
      </motion.div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 gap-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="glass p-4 rounded-xl border border-[rgba(79,195,247,0.15)]"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target size={14} className="text-[#4fc3f7]" />
            <h3 className="font-mono text-xs text-[#4fc3f7]/70 uppercase tracking-wider">Mission</h3>
          </div>
          <p className="text-sm text-white/80 italic">"{PERSONAL.mission}"</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-4 rounded-xl border border-[rgba(79,195,247,0.15)]"
        >
          <div className="flex items-center gap-2 mb-2">
            <Eye size={14} className="text-[#4fc3f7]" />
            <h3 className="font-mono text-xs text-[#4fc3f7]/70 uppercase tracking-wider">Vision</h3>
          </div>
          <p className="text-sm text-white/80 italic">"{PERSONAL.vision}"</p>
        </motion.div>
      </div>

      {/* Socials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass p-4 rounded-xl border border-[rgba(79,195,247,0.15)]"
      >
        <h2 className="font-mono text-xs text-[#4fc3f7]/60 uppercase tracking-wider mb-3">
          // Connect
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <SocialLink href={PERSONAL.github} icon={<Github size={14} />} label="GitHub" value="aashish42-JM" />
          <SocialLink href={PERSONAL.linkedin} icon={<Linkedin size={14} />} label="LinkedIn" value="aashish-timalsina" />
          <SocialLink href={`mailto:${PERSONAL.email}`} icon={<Mail size={14} />} label="Email" value={PERSONAL.email} />
          <SocialLink href={PERSONAL.portfolio} icon={<Globe size={14} />} label="Portfolio" value="netlify.app" />
        </div>
      </motion.div>

      {/* Resume download */}
      <motion.a
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-mono text-sm
                   bg-gradient-to-r from-[#4fc3f7]/20 to-[#64b5f6]/20 
                   border border-[#4fc3f7]/40 text-[#4fc3f7]
                   hover:from-[#4fc3f7]/30 hover:to-[#64b5f6]/30 hover:border-[#4fc3f7]/60
                   transition-all duration-300"
      >
        📄 Download Resume
      </motion.a>
    </div>
  );
}

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[rgba(79,195,247,0.1)] border border-[rgba(79,195,247,0.2)] text-[#90caf9] text-xs font-mono">
      {icon}
      {text}
    </span>
  );
}

function SocialLink({
  href,
  icon,
  label,
  value,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 p-3 rounded-lg bg-[rgba(79,195,247,0.05)] 
                 border border-[rgba(79,195,247,0.1)] hover:border-[rgba(79,195,247,0.3)]
                 hover:bg-[rgba(79,195,247,0.1)] transition-all duration-200 group"
    >
      <span className="text-[#4fc3f7] group-hover:scale-110 transition-transform">{icon}</span>
      <div className="min-w-0">
        <div className="font-mono text-[10px] text-[#64b5f6]/50 uppercase">{label}</div>
        <div className="font-mono text-xs text-[#90caf9] truncate">{value}</div>
      </div>
    </a>
  );
}

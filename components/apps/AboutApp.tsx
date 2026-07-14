"use client";

import { motion } from "framer-motion";
import { MapPin, GraduationCap, GitFork, Link, Mail, Globe, Target, Eye } from "lucide-react";
import { PERSONAL } from "@/lib/data";

export default function AboutApp() {
  return (
    <div className="h-full flex flex-col">
      {/* Scrollable content area with custom scrollbar */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-6 sm:space-y-10 scrollbar-thin scrollbar-thumb-[#4fc3f7]/40 scrollbar-track-transparent hover:scrollbar-thumb-[#4fc3f7]/60 transition-all duration-300">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10"
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-br from-[#4fc3f7] to-[#0a192f] flex items-center justify-center border border-[rgba(79,195,247,0.3)] shadow-[0_0_40px_rgba(79,195,247,0.25)] overflow-hidden">
              <img
                src="/images/profile.jpg"
                alt="Aashish Timalsina"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-green-500 border-4 border-[#050816] flex items-center justify-center">
              <span className="text-[11px]">✓</span>
            </div>
          </div>

          <div className="flex-1 min-w-0 pt-2 text-center sm:text-left">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">{PERSONAL.name}</h1>
            <p className="text-base sm:text-lg text-[#4fc3f7] font-mono mb-4 sm:mb-6">{PERSONAL.title}</p>
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start">
              <Chip icon={<MapPin size={15} />} text={PERSONAL.location} />
              <Chip icon={<GraduationCap size={15} />} text="BSc CSIT" />
              <Chip icon={<span className="text-[15px]">🎓</span>} text={PERSONAL.college} />
            </div>
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-4 sm:p-6 rounded-2xl border border-[rgba(79,195,247,0.15)]"
        >
          <h2 className="font-mono text-xs sm:text-sm text-[#4fc3f7]/70 uppercase tracking-widest mb-4 sm:mb-5">
            // Who I Am
          </h2>
          <p className="text-[#90caf9]/90 text-sm sm:text-base leading-loose">{PERSONAL.bio}</p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="glass p-6 rounded-2xl border border-[rgba(79,195,247,0.15)] hover:shadow-[0_0_30px_rgba(79,195,247,0.15)] transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-5">
              <Target size={22} className="text-[#4fc3f7]" />
              <h3 className="font-mono text-sm text-[#4fc3f7]/80 uppercase tracking-widest">Mission</h3>
            </div>
            <p className="text-base text-white/85 italic leading-loose">"{PERSONAL.mission}"</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-2xl border border-[rgba(79,195,247,0.15)] hover:shadow-[0_0_30px_rgba(79,195,247,0.15)] transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-5">
              <Eye size={22} className="text-[#4fc3f7]" />
              <h3 className="font-mono text-sm text-[#4fc3f7]/80 uppercase tracking-widest">Vision</h3>
            </div>
            <p className="text-base text-white/85 italic leading-loose">"{PERSONAL.vision}"</p>
          </motion.div>
        </div>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass p-4 sm:p-6 rounded-2xl border border-[rgba(79,195,247,0.15)]"
        >
          <h2 className="font-mono text-xs sm:text-sm text-[#4fc3f7]/70 uppercase tracking-widest mb-4 sm:mb-6">
            // Connect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
            <SocialLink href={PERSONAL.github} icon={<GitFork size={19} />} label="GitHub" value="aashish42-JM" />
            <SocialLink href={PERSONAL.linkedin} icon={<Link size={19} />} label="LinkedIn" value="aashish-timalsina" />
            <SocialLink href={`mailto:${PERSONAL.email}`} icon={<Mail size={19} />} label="Email" value={PERSONAL.email} />
            <SocialLink href={PERSONAL.portfolio} icon={<Globe size={19} />} label="Portfolio" value="netlify.app" />
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
          className="flex items-center justify-center gap-3 mx-auto max-w-md w-full py-4 sm:py-5 rounded-2xl font-mono text-sm sm:text-base
                     bg-gradient-to-r from-[#4fc3f7]/25 to-[#64b5f6]/25 
                     border border-[#4fc3f7]/50 text-[#4fc3f7]
                     hover:from-[#4fc3f7]/35 hover:to-[#64b5f6]/35 hover:border-[#4fc3f7]/70 hover:shadow-[0_0_30px_rgba(79,195,247,0.25)]
                     transition-all duration-300"
        >
          📄 Download Resume
        </motion.a>
      </div>
    </div>
  );
}

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(79,195,247,0.12)] border border-[rgba(79,195,247,0.25)] text-[#90caf9] text-sm font-mono">
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
      className="flex items-center gap-4 p-4 rounded-xl bg-[rgba(79,195,247,0.07)] 
                 border border-[rgba(79,195,247,0.15)] hover:border-[rgba(79,195,247,0.4)]
                 hover:bg-[rgba(79,195,247,0.12)] transition-all duration-200 group"
    >
      <span className="text-[#4fc3f7] group-hover:scale-110 transition-transform">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-xs text-[#64b5f6]/60 uppercase tracking-wider">{label}</div>
        <div className="font-mono text-sm text-[#90caf9] truncate">{value}</div>
      </div>
    </a>
  );
}

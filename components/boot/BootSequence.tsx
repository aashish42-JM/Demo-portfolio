"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_STEPS = [
  { text: "Initializing AashishOS v1.0...", delay: 0 },
  { text: "Loading kernel modules...", delay: 600 },
  { text: "Mounting file system...", delay: 1100 },
  { text: "Loading skills database...", delay: 1600 },
  { text: "Loading projects lab...", delay: 2100 },
  { text: "Connecting AI Core (Groq)...", delay: 2600 },
  { text: "Calibrating skill galaxy...", delay: 3100 },
  { text: "Starting mission dashboard...", delay: 3600 },
  { text: "System ready. Welcome, visitor.", delay: 4100 },
];

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    BOOT_STEPS.forEach((step, index) => {
      setTimeout(() => {
        setVisibleSteps((prev) => [...prev, index]);
        setProgress(Math.round(((index + 1) / BOOT_STEPS.length) * 100));
        if (index === BOOT_STEPS.length - 1) {
          setDone(true);
          setTimeout(onComplete, 1200);
        }
      }, step.delay);
    });
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 boot-screen flex flex-col items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(79,195,247,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79,195,247,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,195,247,0.08)_0%,transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Logo */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-[#4fc3f7] shadow-[0_0_12px_#4fc3f7]" />
            <h1 className="font-mono text-3xl font-bold text-glow text-[#4fc3f7] tracking-widest">
              AASHISH<span className="text-white">OS</span>
            </h1>
            <div className="w-3 h-3 rounded-full bg-[#4fc3f7] shadow-[0_0_12px_#4fc3f7]" />
          </div>
          <p className="font-mono text-xs text-[#64b5f6]/60 tracking-[0.3em] uppercase">
            Version 1.0.0 — Built by Aashish Timalsina
          </p>
        </motion.div>

        {/* Terminal box */}
        <div className="terminal relative scanlines">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#4fc3f7]/20">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-2 font-mono text-xs text-[#4fc3f7]/50">boot.log</span>
          </div>

          <div className="space-y-1 min-h-[220px]">
            {BOOT_STEPS.map((step, index) => (
              <AnimatePresence key={index}>
                {visibleSteps.includes(index) && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-[#90caf9]/60 text-xs font-mono shrink-0 mt-0.5">
                      [{String(index + 1).padStart(2, "0")}]
                    </span>
                    <span
                      className={`font-mono text-sm ${
                        index === BOOT_STEPS.length - 1
                          ? "text-green-400 font-bold"
                          : "text-[#4fc3f7]"
                      } ${index === visibleSteps.length - 1 && !done ? "typewriter-cursor" : ""}`}
                    >
                      {step.text}
                      {index === visibleSteps.length - 1 && !done && (
                        <span className="ml-1 inline-block w-2 h-4 bg-[#4fc3f7] align-middle animate-pulse" />
                      )}
                    </span>
                    {index < BOOT_STEPS.length - 1 && visibleSteps.includes(index) && (
                      <span className="ml-auto text-green-400/70 text-xs font-mono shrink-0">OK</span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-xs text-[#64b5f6]/60">System Load</span>
            <span className="font-mono text-xs text-[#4fc3f7]">{progress}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full xp-bar"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Enter hint */}
        <AnimatePresence>
          {done && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
              className="text-center font-mono text-sm text-[#4fc3f7]/60 mt-8"
            >
              Entering desktop environment...
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

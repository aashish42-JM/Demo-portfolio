"use client";

import { motion } from "framer-motion";

interface AICoreOrbProps {
  onTap?: () => void;
  size?: number;
}

export default function AICoreOrb({ onTap, size = 180 }: AICoreOrbProps) {
  return (
    <motion.button
      type="button"
      onClick={onTap}
      whileTap={{ scale: 0.92 }}
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label="AI Core"
    >
      {/* Outermost glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 1.7,
          height: size * 1.7,
          background:
            "radial-gradient(circle, rgba(79,195,247,0.1) 0%, transparent 55%)",
        }}
      />

      {/* Breathing glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.4,
          height: size * 1.4,
          background:
            "radial-gradient(circle, rgba(79,195,247,0.18) 0%, rgba(79,195,247,0.05) 45%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orbit ring 1 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.18,
          height: size * 1.18,
          border: "1px solid rgba(79,195,247,0.14)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Orbit ring 2 — dashed */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.32,
          height: size * 1.32,
          border: "1px dashed rgba(79,195,247,0.07)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Main orb body — SOLID */}
      <div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background:
            "radial-gradient(circle at 38% 32%, rgba(79,195,247,0.35) 0%, rgba(10,25,47,0.85) 45%, rgba(5,8,22,0.97) 100%)",
          boxShadow: `
            inset 0 0 ${size * 0.2}px rgba(79,195,247,0.2),
            0 0 ${size * 0.3}px rgba(79,195,247,0.22),
            0 0 ${size * 0.55}px rgba(79,195,247,0.12),
            0 0 ${size * 0.85}px rgba(79,195,247,0.05)
          `,
          border: "1px solid rgba(79,195,247,0.15)",
        }}
      />

      {/* Inner highlight */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.45,
          height: size * 0.45,
          background:
            "radial-gradient(circle, rgba(79,195,247,0.2) 0%, transparent 70%)",
          top: "18%",
          left: "26%",
        }}
      />

      {/* Core text — bold, bright, solid */}
      <div className="relative z-10 flex flex-col items-center pointer-events-none select-none">
        <div
          className="font-mono font-bold tracking-[0.2em] text-[#4fc3f7]"
          style={{
            fontSize: size * 0.18,
            textShadow:
              "0 0 10px rgba(79,195,247,0.7), 0 0 28px rgba(79,195,247,0.4), 0 0 50px rgba(79,195,247,0.18)",
          }}
        >
          AI
        </div>
        <div
          className="font-mono font-medium tracking-[0.18em] uppercase text-[#90caf9]/85"
          style={{
            fontSize: Math.max(9, size * 0.07),
            textShadow: "0 0 8px rgba(79,195,247,0.45)",
          }}
        >
          Core
        </div>
      </div>
    </motion.button>
  );
}

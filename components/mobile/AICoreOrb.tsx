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
      {/* Outermost glow halo */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 1.8,
          height: size * 1.8,
          background:
            "radial-gradient(circle, rgba(79,195,247,0.08) 0%, transparent 55%)",
        }}
      />

      {/* Outer glow — breathing */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.45,
          height: size * 1.45,
          background:
            "radial-gradient(circle, rgba(79,195,247,0.16) 0%, rgba(79,195,247,0.04) 45%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orbit ring 1 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.2,
          height: size * 1.2,
          border: "1px solid rgba(79,195,247,0.12)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Orbit ring 2 — dashed */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.35,
          height: size * 1.35,
          border: "1px dashed rgba(79,195,247,0.06)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Main orb body */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background:
            "radial-gradient(circle at 38% 32%, rgba(79,195,247,0.3) 0%, rgba(10,25,47,0.7) 50%, rgba(5,8,22,0.95) 100%)",
          boxShadow: `
            inset 0 0 ${size * 0.22}px rgba(79,195,247,0.22),
            0 0 ${size * 0.3}px rgba(79,195,247,0.2),
            0 0 ${size * 0.55}px rgba(79,195,247,0.12),
            0 0 ${size * 0.85}px rgba(79,195,247,0.05)
          `,
        }}
        animate={{
          boxShadow: [
            `inset 0 0 ${size * 0.22}px rgba(79,195,247,0.22), 0 0 ${size * 0.3}px rgba(79,195,247,0.2), 0 0 ${size * 0.55}px rgba(79,195,247,0.12), 0 0 ${size * 0.85}px rgba(79,195,247,0.05)`,
            `inset 0 0 ${size * 0.28}px rgba(79,195,247,0.32), 0 0 ${size * 0.38}px rgba(79,195,247,0.28), 0 0 ${size * 0.65}px rgba(79,195,247,0.16), 0 0 ${size}px rgba(79,195,247,0.07)`,
            `inset 0 0 ${size * 0.22}px rgba(79,195,247,0.22), 0 0 ${size * 0.3}px rgba(79,195,247,0.2), 0 0 ${size * 0.55}px rgba(79,195,247,0.12), 0 0 ${size * 0.85}px rgba(79,195,247,0.05)`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Inner specular highlight */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.48,
          height: size * 0.48,
          background:
            "radial-gradient(circle, rgba(79,195,247,0.2) 0%, transparent 70%)",
          top: "18%",
          left: "26%",
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Core text — bold and bright */}
      <div className="relative z-10 flex flex-col items-center pointer-events-none select-none">
        <div
          className="font-mono font-semibold tracking-[0.22em] text-[#4fc3f7]"
          style={{
            fontSize: size * 0.18,
            textShadow:
              "0 0 10px rgba(79,195,247,0.7), 0 0 28px rgba(79,195,247,0.35), 0 0 50px rgba(79,195,247,0.15)",
          }}
        >
          AI
        </div>
        <div
          className="font-mono font-normal tracking-[0.18em] uppercase text-[#90caf9]/80"
          style={{
            fontSize: Math.max(8, size * 0.065),
            textShadow: "0 0 8px rgba(79,195,247,0.4)",
          }}
        >
          Core
        </div>
      </div>
    </motion.button>
  );
}

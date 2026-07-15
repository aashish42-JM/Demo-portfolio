"use client";

import { motion } from "framer-motion";
import { useCallback, useMemo } from "react";

interface AICoreOrbProps {
  onTap?: () => void;
  size?: number;
  expanded?: boolean;
}

export default function AICoreOrb({ onTap, size = 160, expanded = false }: AICoreOrbProps) {
  const r = size / 2;

  const orbitingParticles = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      angle: (i / 6) * Math.PI * 2,
      dist: r + 18 + Math.random() * 12,
      speed: 20 + Math.random() * 15,
      delay: i * 0.8,
      size: 2 + Math.random() * 2,
    })), [r]);

  const innerParticles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i / 12) * Math.PI * 2,
      dist: r * 0.3 + Math.random() * r * 0.4,
      speed: 8 + Math.random() * 12,
      size: 1 + Math.random() * 2,
    })), [r]);

  const handleTap = useCallback(() => {
    onTap?.();
  }, [onTap]);

  return (
    <motion.div
      className="relative cursor-pointer"
      style={{ width: size, height: size }}
      whileTap={{ scale: 0.92 }}
      onClick={handleTap}
    >
      {/* Outer glow halo */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(79,195,247,0.12) 0%, rgba(79,195,247,0.04) 40%, transparent 70%)`,
          transform: "scale(1.8)",
          filter: "blur(8px)",
        }}
      />

      {/* Pulsating ring 1 */}
      <motion.div
        className="absolute inset-0 rounded-full border border-[rgba(79,195,247,0.2)]"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: "scale(1.15)" }}
      />

      {/* Pulsating ring 2 */}
      <motion.div
        className="absolute inset-0 rounded-full border border-[rgba(79,195,247,0.15)]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.05, 0.2],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ transform: "scale(1.3)" }}
      />

      {/* Rotating outer ring */}
      <motion.div
        className="absolute inset-[-4px] rounded-full"
        style={{
          border: "1px solid rgba(79,195,247,0.25)",
          borderTopColor: "rgba(79,195,247,0.6)",
          borderRightColor: "transparent",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Rotating inner ring */}
      <motion.div
        className="absolute inset-[8px] rounded-full"
        style={{
          border: "1px solid rgba(79,195,247,0.1)",
          borderBottomColor: "rgba(79,195,247,0.4)",
          borderLeftColor: "transparent",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Main sphere body */}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{
          inset: "14px",
          background: `radial-gradient(circle at 35% 30%,
            rgba(100,181,246,0.4) 0%,
            rgba(79,195,247,0.25) 20%,
            rgba(17,34,64,0.9) 55%,
            rgba(5,8,22,0.95) 100%)`,
          boxShadow: `
            inset 0 0 30px rgba(79,195,247,0.3),
            inset 0 0 60px rgba(79,195,247,0.1),
            0 0 40px rgba(79,195,247,0.3),
            0 0 80px rgba(79,195,247,0.15),
            0 0 120px rgba(79,195,247,0.08)
          `,
        }}
      >
        {/* Inner galaxy texture */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 25%, rgba(79,195,247,0.35) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 70%, rgba(100,181,246,0.2) 0%, transparent 45%),
              radial-gradient(ellipse at 50% 50%, rgba(129,140,248,0.15) 0%, transparent 60%)
            `,
          }}
        />

        {/* Energy veins */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{
            background: `
              conic-gradient(from 0deg,
                transparent 0deg,
                rgba(79,195,247,0.08) 30deg,
                transparent 60deg,
                rgba(79,195,247,0.05) 120deg,
                transparent 150deg,
                rgba(79,195,247,0.08) 210deg,
                transparent 240deg,
                rgba(79,195,247,0.05) 300deg,
                transparent 330deg,
                rgba(79,195,247,0.08) 360deg
              )
            `,
          }}
        />

        {/* Bright core center */}
        <div
          className="absolute rounded-full"
          style={{
            top: "50%",
            left: "50%",
            width: "30%",
            height: "30%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(79,195,247,0.7) 0%, rgba(79,195,247,0.2) 50%, transparent 100%)",
            filter: "blur(4px)",
          }}
        />

        {/* Specular highlight */}
        <div
          className="absolute rounded-full"
          style={{
            top: "15%",
            left: "20%",
            width: "35%",
            height: "20%",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 70%)",
            transform: "rotate(-20deg)",
            filter: "blur(3px)",
          }}
        />
      </div>

      {/* Orbiting particles */}
      {orbitingParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#4fc3f7]"
          style={{
            width: p.size,
            height: p.size,
            top: "50%",
            left: "50%",
            marginTop: -p.size / 2,
            marginLeft: -p.size / 2,
            boxShadow: `0 0 6px rgba(79,195,247,0.8)`,
          }}
          animate={{
            x: [Math.cos(p.angle) * p.dist, Math.cos(p.angle + Math.PI) * p.dist, Math.cos(p.angle + Math.PI * 2) * p.dist],
            y: [Math.sin(p.angle) * p.dist, Math.sin(p.angle + Math.PI) * p.dist, Math.sin(p.angle + Math.PI * 2) * p.dist],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: p.speed,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}

      {/* Inner floating particles */}
      {innerParticles.map((p) => (
        <motion.div
          key={`inner-${p.id}`}
          className="absolute rounded-full bg-[#90caf9]"
          style={{
            width: p.size,
            height: p.size,
            top: "50%",
            left: "50%",
            marginTop: -p.size / 2,
            marginLeft: -p.size / 2,
            opacity: 0.5,
          }}
          animate={{
            x: [Math.cos(p.angle) * p.dist, Math.cos(p.angle + Math.PI * 0.5) * p.dist, Math.cos(p.angle + Math.PI) * p.dist],
            y: [Math.sin(p.angle) * p.dist, Math.sin(p.angle + Math.PI * 0.5) * p.dist, Math.sin(p.angle + Math.PI) * p.dist],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.speed,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Energy pulse overlay (breathing) */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            "inset 0 0 20px rgba(79,195,247,0.1), 0 0 30px rgba(79,195,247,0.15)",
            "inset 0 0 35px rgba(79,195,247,0.2), 0 0 50px rgba(79,195,247,0.25)",
            "inset 0 0 20px rgba(79,195,247,0.1), 0 0 30px rgba(79,195,247,0.15)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ pointerEvents: "none" }}
      />

      {/* Tap ripple */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        initial={{ opacity: 0 }}
        whileTap={{ opacity: 1 }}
        style={{
          background: "radial-gradient(circle, rgba(79,195,247,0.3) 0%, transparent 60%)",
        }}
      />
    </motion.div>
  );
}

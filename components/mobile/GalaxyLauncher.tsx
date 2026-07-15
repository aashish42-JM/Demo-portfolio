"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import AICoreOrb from "./AICoreOrb";

interface GalaxyLauncherProps {
  onOpenApp: (id: string) => void;
  onOpenAI: () => void;
}

interface PlanetData {
  id: string;
  title: string;
  icon: string;
  color: string;
  glowColor: string;
  orbitRadius: number;
  orbitSpeed: number;
  startAngle: number;
  size: number;
}

const APPS: Omit<PlanetData, "orbitRadius" | "orbitSpeed" | "startAngle" | "size">[] = [
  { id: "about", title: "About", icon: "👨‍💻", color: "#4fc3f7", glowColor: "rgba(79,195,247,0.4)" },
  { id: "projects", title: "Projects", icon: "🧪", color: "#818cf8", glowColor: "rgba(129,140,248,0.4)" },
  { id: "skills", title: "Skills", icon: "🪐", color: "#a78bfa", glowColor: "rgba(167,139,250,0.4)" },
  { id: "journey", title: "Journey", icon: "⚔️", color: "#fbbf24", glowColor: "rgba(251,191,36,0.4)" },
  { id: "logbook", title: "Logbook", icon: "📖", color: "#34d399", glowColor: "rgba(52,211,153,0.4)" },
  { id: "missions", title: "Missions", icon: "🎯", color: "#f87171", glowColor: "rgba(248,113,113,0.4)" },
  { id: "achievements", title: "Awards", icon: "🏆", color: "#fbbf24", glowColor: "rgba(251,191,36,0.4)" },
];

export default function GalaxyLauncher({ onOpenApp, onOpenAI }: GalaxyLauncherProps) {
  const planets = useMemo<PlanetData[]>(() => {
    const baseRadius = 120;
    return APPS.map((app, i) => ({
      ...app,
      orbitRadius: baseRadius + (i % 2) * 25,
      orbitSpeed: 40 + i * 8,
      startAngle: (i / APPS.length) * Math.PI * 2,
      size: 52 + (i % 3) * 4,
    }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}
    >
      {/* Center container for orbital system */}
      <div className="relative" style={{ width: 340, height: 340 }}>
        {/* Orbit rings */}
        <div
          className="absolute rounded-full border border-[rgba(79,195,247,0.06)]"
          style={{
            width: 240,
            height: 240,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className="absolute rounded-full border border-[rgba(79,195,247,0.04)]"
          style={{
            width: 290,
            height: 290,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* AI Core Orb at center */}
        <div
          className="absolute z-20"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <AICoreOrb onTap={onOpenAI} size={110} />
        </div>

        {/* Orbiting planets */}
        {planets.map((planet) => (
          <OrbitingPlanet
            key={planet.id}
            planet={planet}
            onTap={() => onOpenApp(planet.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}

function OrbitingPlanet({
  planet,
  onTap,
}: {
  planet: PlanetData;
  onTap: () => void;
}) {
  const containerSize = 340;
  const center = containerSize / 2;

  return (
    <motion.div
      className="absolute"
      style={{
        width: planet.size,
        height: planet.size,
        top: center - planet.size / 2,
        left: center - planet.size / 2,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{ delay: 0.3 + Math.random() * 0.3, type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Orbital motion wrapper */}
      <motion.div
        className="w-full h-full"
        animate={{
          x: [
            Math.cos(planet.startAngle) * planet.orbitRadius,
            Math.cos(planet.startAngle + Math.PI * 0.5) * planet.orbitRadius,
            Math.cos(planet.startAngle + Math.PI) * planet.orbitRadius,
            Math.cos(planet.startAngle + Math.PI * 1.5) * planet.orbitRadius,
            Math.cos(planet.startAngle + Math.PI * 2) * planet.orbitRadius,
          ],
          y: [
            Math.sin(planet.startAngle) * planet.orbitRadius,
            Math.sin(planet.startAngle + Math.PI * 0.5) * planet.orbitRadius,
            Math.sin(planet.startAngle + Math.PI) * planet.orbitRadius,
            Math.sin(planet.startAngle + Math.PI * 1.5) * planet.orbitRadius,
            Math.sin(planet.startAngle + Math.PI * 2) * planet.orbitRadius,
          ],
        }}
        transition={{
          duration: planet.orbitSpeed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <motion.button
          onClick={onTap}
          whileTap={{ scale: 0.88 }}
          className="w-full h-full rounded-full flex flex-col items-center justify-center relative"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${planet.glowColor}, rgba(17,34,64,0.8) 60%, rgba(5,8,22,0.95) 100%)`,
            boxShadow: `
              0 0 20px ${planet.glowColor},
              0 0 40px ${planet.glowColor.replace("0.4", "0.15")},
              inset 0 0 15px rgba(79,195,247,0.1)
            `,
            border: `1px solid ${planet.glowColor.replace("0.4", "0.25")}`,
          }}
        >
          {/* Specular highlight */}
          <div
            className="absolute rounded-full"
            style={{
              top: "15%",
              left: "20%",
              width: "30%",
              height: "20%",
              background: "radial-gradient(ellipse, rgba(255,255,255,0.12) 0%, transparent 70%)",
              transform: "rotate(-20deg)",
              filter: "blur(2px)",
            }}
          />

          <span className="text-[18px] leading-none mb-0.5">{planet.icon}</span>
          <span
            className="font-mono text-[7px] tracking-wide leading-none"
            style={{ color: planet.color, opacity: 0.8 }}
          >
            {planet.title}
          </span>

          {/* Tiny orbiting moon */}
          <motion.div
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: planet.color,
              boxShadow: `0 0 4px ${planet.glowColor}`,
              top: "50%",
              left: "50%",
              marginTop: -3,
              marginLeft: -3,
            }}
            animate={{
              x: [Math.cos(0) * (planet.size * 0.65), Math.cos(Math.PI) * (planet.size * 0.65), Math.cos(Math.PI * 2) * (planet.size * 0.65)],
              y: [Math.sin(0) * (planet.size * 0.65), Math.sin(Math.PI) * (planet.size * 0.65), Math.sin(Math.PI * 2) * (planet.size * 0.65)],
            }}
            transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, ease: "linear" }}
          />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { APP_REGISTRY } from "@/lib/data";
import { APP_DEFINITIONS } from "@/lib/app-definitions";
import AICoreOrb from "./AICoreOrb";

interface GalaxyLauncherProps {
  onOpenApp: (appId: string) => void;
}

const ORBIT_RADIUS = 110;
const ORBIT_SPEED = 50;
const APP_SIZE = 42;

export default function GalaxyLauncher({ onOpenApp }: GalaxyLauncherProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const mobileApps = APP_REGISTRY.filter((app) => {
    const def = APP_DEFINITIONS[app.id];
    return def?.mobile !== false;
  }).slice(0, 7);

  // Auto-expand on mount
  useEffect(() => {
    const t = setTimeout(() => setExpanded(true), 350);
    return () => clearTimeout(t);
  }, []);

  const handleCoreTap = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const orbitDiameter = (ORBIT_RADIUS + APP_SIZE / 2) * 2;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col"
      style={{ paddingBottom: "calc(72px + env(safe-area-inset-bottom, 0px))" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex-none pt-14 pb-2 px-6"
      >
        <h1 className="font-mono text-[18px] font-light text-white/90 tracking-[0.08em] text-center">
          Aashish<span className="text-[#4fc3f7]">OS</span>
        </h1>
        <p className="font-mono text-[9px] text-[#90caf9]/25 text-center tracking-[0.18em] mt-1 uppercase">
          {expanded ? "Tap Core to Collapse" : "Tap Core to Explore"}
        </p>
      </motion.div>

      {/* Galaxy Container — flex centers the orbit system */}
      <div className="flex-1 relative">
        {/* Orbit ring — visual guide */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: ORBIT_RADIUS * 2 + APP_SIZE + 20,
            height: ORBIT_RADIUS * 2 + APP_SIZE + 20,
            left: "50%",
            top: "50%",
            marginLeft: -(ORBIT_RADIUS * 2 + APP_SIZE + 20) / 2,
            marginTop: -(ORBIT_RADIUS * 2 + APP_SIZE + 20) / 2,
            border: "1px solid rgba(79,195,247,0.06)",
          }}
          animate={{
            opacity: expanded ? 1 : 0,
            scale: expanded ? 1 : 0.5,
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* ─── Orbit Container — centered, rotates when expanded ─── */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: orbitDiameter,
            height: orbitDiameter,
            left: "50%",
            top: "50%",
            marginLeft: -orbitDiameter / 2,
            marginTop: -orbitDiameter / 2,
            animation: expanded ? `spin ${ORBIT_SPEED}s linear infinite` : "none",
          }}
        >
          {mobileApps.map((app, i) => {
            const angle = (i / mobileApps.length) * Math.PI * 2 - Math.PI / 2;
            const targetX = Math.cos(angle) * ORBIT_RADIUS;
            const targetY = Math.sin(angle) * ORBIT_RADIUS;
            const isSelected = selectedApp === app.id;

            return (
              <div
                key={app.id}
                className="absolute pointer-events-auto"
                style={{
                  width: APP_SIZE,
                  height: APP_SIZE,
                  left: "50%",
                  top: "50%",
                  marginLeft: -APP_SIZE / 2,
                  marginTop: -APP_SIZE / 2,
                  // Counter-rotate to keep icon upright
                  animation: expanded
                    ? `counter-spin ${ORBIT_SPEED}s linear infinite`
                    : "none",
                }}
              >
                <motion.button
                  type="button"
                  onClick={() => {
                    setSelectedApp(app.id);
                    onOpenApp(app.id);
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="outline-none"
                  style={{ width: APP_SIZE, height: APP_SIZE }}
                  animate={{
                    x: expanded ? targetX : 0,
                    y: expanded ? targetY : 0,
                    opacity: expanded ? 1 : 0,
                    scale: expanded ? 1 : 0.2,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 13,
                    delay: expanded ? i * 0.055 : (mobileApps.length - 1 - i) * 0.035,
                  }}
                >
                  {/* Planet body */}
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center transition-shadow duration-300"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${app.color}45, ${app.color}15)`,
                      boxShadow: isSelected
                        ? `0 0 24px ${app.color}80, inset 0 0 12px ${app.color}30`
                        : `0 0 10px ${app.color}30, inset 0 0 6px ${app.color}12`,
                      border: `1px solid ${app.color}${isSelected ? "80" : "30"}`,
                    }}
                  >
                    <span
                      className="text-base"
                      style={{ filter: "drop-shadow(0 0 3px rgba(0,0,0,0.5))" }}
                    >
                      {app.icon}
                    </span>
                  </div>

                  {/* Label */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 font-mono text-[7px] text-[#90caf9]/40 tracking-wider whitespace-nowrap"
                    style={{ top: APP_SIZE + 3 }}
                  >
                    {app.name}
                  </div>

                  {/* Moon */}
                  <div
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      background: `${app.color}45`,
                      boxShadow: `0 0 3px ${app.color}30`,
                      top: -6,
                      left: "50%",
                      marginLeft: -2,
                    }}
                  />
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* ─── Central AI Core — perfectly centered ─── */}
        <div
          className="absolute z-10"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <motion.div
            animate={{ scale: expanded ? 1 : 0.92 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <AICoreOrb size={76} onTap={handleCoreTap} />
          </motion.div>
        </div>
      </div>

      {/* App preview toast */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="flex-none mx-6 mb-4 px-5 py-3 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(17,34,64,0.6) 0%, rgba(10,25,47,0.5) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(79,195,247,0.12)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{APP_DEFINITIONS[selectedApp]?.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[12px] text-[#90caf9]/80 truncate">
                  {APP_DEFINITIONS[selectedApp]?.name}
                </p>
                <p className="font-mono text-[9px] text-[#4fc3f7]/30 truncate mt-0.5">
                  {APP_DEFINITIONS[selectedApp]?.description}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenApp(selectedApp);
                }}
                className="px-3 py-1.5 rounded-xl font-mono text-[9px] text-[#4fc3f7] active:bg-[#4fc3f7]/10 transition-colors"
                style={{ border: "1px solid rgba(79,195,247,0.2)" }}
              >
                Open
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

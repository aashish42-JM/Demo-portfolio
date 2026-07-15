"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MISSIONS, PERSONAL } from "@/lib/data";
import AICoreOrb from "./AICoreOrb";

const ROTATING_MESSAGES = [
  "Tap to Enter the Aashish Galaxy",
  "Everything Begins from the Core",
  "Explore the AI Universe",
  "Your Journey Starts Here",
];

interface HomeDashboardProps {
  onOpenGalaxy: () => void;
}

export default function HomeDashboard({ onOpenGalaxy }: HomeDashboardProps) {
  const [now, setNow] = useState<Date>(new Date());
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setMsgIndex((p) => (p + 1) % ROTATING_MESSAGES.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const greeting =
    now.getHours() < 12
      ? "Good Morning"
      : now.getHours() < 17
        ? "Good Afternoon"
        : "Good Evening";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col"
      style={{
        paddingBottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {/* ─── Top: Glass Panel with Time + Greeting ─── */}
      <div className="flex-none px-5 pt-12 pb-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="relative rounded-3xl px-6 py-6 text-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(17,34,64,0.35) 0%, rgba(10,25,47,0.25) 100%)",
            backdropFilter: "blur(20px) saturate(1.3)",
            WebkitBackdropFilter: "blur(20px) saturate(1.3)",
            border: "1px solid rgba(79,195,247,0.08)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          <div
            className="absolute top-0 left-1/4 right-1/4 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(79,195,247,0.15), transparent)",
            }}
          />
          <div
            className="font-mono text-[52px] font-extralight text-white leading-none tracking-tight"
            style={{ textShadow: "0 0 40px rgba(79,195,247,0.2)" }}
          >
            {hours}:{minutes}
          </div>
          <div className="font-mono text-[10px] text-[#4fc3f7]/40 tracking-[0.25em] uppercase mt-2">
            {dateStr}
          </div>
          <p className="font-mono text-[13px] text-[#90caf9]/55 mt-4 tracking-wide">
            {greeting},{" "}
            <span className="text-[#4fc3f7]/75">
              {PERSONAL.name.split(" ")[0]}
            </span>
          </p>
        </motion.div>
      </div>

      {/* ─── Center: Orb (Hero) ─── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.4,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <AICoreOrb onTap={onOpenGalaxy} size={200} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 h-5"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35 }}
              className="font-mono text-[11px] text-[#4fc3f7]/40 tracking-[0.08em] text-center"
            >
              {ROTATING_MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ─── Bottom: Status Pills ─── */}
      <div className="flex-none px-6 pb-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-3"
        >
          <Pill dot="#4ade80" text="AI Online" />
          <Pill
            dot="#4fc3f7"
            text={`${MISSIONS.filter((m) => m.status === "completed").length} Missions`}
          />
          <Pill dot="#fbbf24" text="Active" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function Pill({ dot, text }: { dot: string; text: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[9px] text-[#90caf9]/50 tracking-wide"
      style={{
        background: "rgba(17,34,64,0.35)",
        border: "1px solid rgba(79,195,247,0.06)",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: dot, boxShadow: `0 0 6px ${dot}70` }}
      />
      {text}
    </span>
  );
}

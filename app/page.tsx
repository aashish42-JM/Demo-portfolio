"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import BootSequence from "@/components/boot/BootSequence";

// Lazy load desktop to avoid SSR issues with canvas/three.js
const Desktop = dynamic(() => import("@/components/desktop/Desktop"), {
  ssr: false,
});

type Phase = "boot" | "desktop";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("boot");

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#050816]">
      <AnimatePresence mode="wait">
        {phase === "boot" && (
          <BootSequence key="boot" onComplete={() => setPhase("desktop")} />
        )}
      </AnimatePresence>

      {phase === "desktop" && <Desktop />}
    </main>
  );
}

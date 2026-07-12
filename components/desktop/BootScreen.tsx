"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface BootScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

const BOOT_MESSAGES = [
  "Initializing AashishOS...",
  "Loading Core Modules...",
  "Connecting Neural Engine...",
  "Loading Portfolio Database...",
  "Verifying System Integrity...",
  "Activating Quantum Interface...",
  "Starting AI Assistant...",
  "System Ready.",
];

export default function BootScreen({ onComplete, onSkip }: BootScreenProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [messageComplete, setMessageComplete] = useState(false);

  useEffect(() => {
    if (currentMessageIndex >= BOOT_MESSAGES.length) {
      setTimeout(onComplete, 500);
      return;
    }

    const message = BOOT_MESSAGES[currentMessageIndex];
    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex < message.length) {
        setDisplayedText(message.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(interval);
        setMessageComplete(true);
        setTimeout(() => {
          setCurrentMessageIndex((prev) => prev + 1);
          setDisplayedText("");
          setMessageComplete(false);
        }, 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentMessageIndex, onComplete]);

  const progress = ((currentMessageIndex + (messageComplete ? 1 : 0)) / BOOT_MESSAGES.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center"
    >
      {/* Subtle blue glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,195,247,0.1)_0%,transparent_70%)]" />

      {/* Skip button */}
      <button
        onClick={onSkip}
        className="absolute top-6 right-6 text-[#90caf9]/60 hover:text-[#4fc3f7] font-mono text-xs transition-colors z-10"
      >
        Skip Intro
      </button>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full mx-4">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold bg-gradient-to-r from-[#4fc3f7] to-[#90caf9] bg-clip-text text-transparent font-mono"
        >
          AashishOS
        </motion.div>

        {/* Boot messages */}
        <div className="w-full min-h-[200px] flex flex-col gap-2">
          {BOOT_MESSAGES.slice(0, currentMessageIndex).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="text-green-400 text-sm">✓</div>
              <p className="text-[#90caf9]/80 font-mono text-sm">{msg}</p>
            </motion.div>
          ))}
          {currentMessageIndex < BOOT_MESSAGES.length && (
            <div className="flex items-center gap-3">
              <div className="w-4 h-4" />
              <p className="text-[#4fc3f7] font-mono text-sm">
                {displayedText}
                <span className="animate-pulse">_</span>
              </p>
            </div>
          )}
        </div>

        {/* Loading bar */}
        <div className="w-full h-1 bg-[#1e3a5f] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-[#4fc3f7] to-[#90caf9] shadow-[0_0_10px_rgba(79,195,247,0.7)]"
          />
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AIWelcomeProps {
  onComplete: (action?: "explore" | "ask-ai" | "resume") => void;
  onSkip: () => void;
}

const WELCOME_MESSAGES = [
  { text: "Welcome to AashishOS.", delay: 0 },
  { text: "I'm AURA, your AI guide.", delay: 800 },
  { text: "This isn't just a portfolio.", delay: 1600 },
  { text: "It's an interactive operating system showcasing the work, projects, creativity and journey of Aashish Timalsina.", delay: 2400 },
  { text: "What would you like to explore?", delay: 3200 },
];

export default function AIWelcome({ onComplete, onSkip }: AIWelcomeProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const [isDissolving, setIsDissolving] = useState(false);

  useEffect(() => {
    if (isDissolving) return;
    if (currentMessageIndex >= WELCOME_MESSAGES.length) {
      setShowButtons(true);
      return;
    }

    const { text, delay } = WELCOME_MESSAGES[currentMessageIndex];
    const delayTimeout = setTimeout(() => {
      let charIndex = 0;
      const interval = setInterval(() => {
        if (charIndex < text.length) {
          setDisplayedText(text.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setCurrentMessageIndex((prev) => prev + 1);
            setDisplayedText("");
          }, 500);
        }
      }, 30);
    }, delay);

    return () => {
      clearTimeout(delayTimeout);
    };
  }, [currentMessageIndex, isDissolving]);

  const handleAction = (action?: "explore" | "ask-ai" | "resume") => {
    setIsDissolving(true);
    setTimeout(() => onComplete(action), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Holographic background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,195,247,0.15)_0%,transparent_60%)]" />

      {/* Skip button */}
      <button
        onClick={onSkip}
        className="absolute top-6 right-6 text-[#90caf9]/60 hover:text-[#4fc3f7] font-mono text-xs transition-colors z-10"
      >
        Skip Intro
      </button>

      <div className="relative z-10 flex flex-col items-center gap-12 max-w-lg w-full mx-4">
        {/* Holographic AI Orb */}
        <motion.div
          animate={isDissolving ? { scale: 0, opacity: 0 } : {
            y: [0, -10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={isDissolving ? {
            scale: { duration: 0.8 },
            opacity: { duration: 0.8 }
          } : {
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.5 },
          }}
          className="relative"
        >
          {/* Main orb */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#4fc3f7]/40 to-[#90caf9]/20 backdrop-blur-md border border-[#4fc3f7]/50 shadow-[0_0_60px_rgba(79,195,247,0.5)] flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4fc3f7]/60 to-[#90caf9]/30" />
          </div>
          {/* Orbiting particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#4fc3f7]/80"
              style={{
                left: "50%",
                top: "50%",
                marginLeft: -4,
                marginTop: -4,
              }}
              animate={{
                x: Math.cos(i * Math.PI / 4) * 70,
                y: Math.sin(i * Math.PI / 4) * 70,
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "linear",
                opacity: { duration: 2, repeat: Infinity }
              }}
            />
          ))}
        </motion.div>

        {/* Welcome message */}
        <div className="text-center">
          <motion.p
            animate={isDissolving ? { opacity: 0, y: 20 } : {}}
            className="text-[#90caf9]/90 font-mono text-lg leading-relaxed"
          >
            {displayedText}
            {!showButtons && <span className="animate-pulse">_</span>}
          </motion.p>
        </div>

        {/* Buttons */}
        {showButtons && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isDissolving ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <button
              onClick={() => handleAction("explore")}
              className="glass px-10 py-5 rounded-2xl border border-[rgba(79,195,247,0.3)] text-[#4fc3f7] font-mono text-lg hover:bg-[#4fc3f7]/10 hover:border-[rgba(79,195,247,0.6)] hover:shadow-[0_0_30px_rgba(79,195,247,0.3)] transition-all flex items-center gap-4"
            >
              <span className="text-3xl">🚀</span>
              Explore Portfolio
            </button>
            <button
              onClick={() => handleAction("ask-ai")}
              className="glass px-10 py-5 rounded-2xl border border-[rgba(79,195,247,0.3)] text-[#4fc3f7] font-mono text-lg hover:bg-[#4fc3f7]/10 hover:border-[rgba(79,195,247,0.6)] hover:shadow-[0_0_30px_rgba(79,195,247,0.3)] transition-all flex items-center gap-4"
            >
              <span className="text-3xl">🤖</span>
              Ask AI
            </button>
            <button
              onClick={() => handleAction("resume")}
              className="glass px-10 py-5 rounded-2xl border border-[rgba(79,195,247,0.3)] text-[#4fc3f7] font-mono text-lg hover:bg-[#4fc3f7]/10 hover:border-[rgba(79,195,247,0.6)] hover:shadow-[0_0_30px_rgba(79,195,247,0.3)] transition-all flex items-center gap-4"
            >
              <span className="text-3xl">📄</span>
              Resume
            </button>
            <button
              onClick={() => handleAction()}
              className="px-10 py-5 rounded-2xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-mono text-lg transition-all flex items-center gap-4"
            >
              <span className="text-3xl">⏩</span>
              Skip
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

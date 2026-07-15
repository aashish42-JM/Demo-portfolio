"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface FloatingAIButtonProps {
  onTap: () => void;
  onLongPress: () => void;
}

export default function FloatingAIButton({ onTap, onLongPress }: FloatingAIButtonProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const handlePointerDown = useCallback(() => {
    isLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress();
    }, 500);
  }, [onLongPress]);

  const handlePointerUp = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!isLongPressRef.current) {
      onTap();
    }
  }, [onTap]);

  const handlePointerLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      className="fixed z-50 flex items-center justify-center"
      style={{
        bottom: "calc(82px + env(safe-area-inset-bottom, 0px))",
        right: "20px",
        width: 52,
        height: 52,
      }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-[-6px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(79,195,247,0.2) 0%, transparent 70%)",
          filter: "blur(4px)",
        }}
      />

      {/* Pulse ring */}
      <motion.div
        className="absolute inset-[-3px] rounded-full border border-[rgba(79,195,247,0.3)]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.1, 0.4],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Button body */}
      <div
        className="relative w-full h-full rounded-full flex items-center justify-center"
        style={{
          background: "radial-gradient(circle at 35% 30%, rgba(79,195,247,0.35), rgba(17,34,64,0.9) 60%, rgba(5,8,22,0.95))",
          boxShadow: `
            0 0 20px rgba(79,195,247,0.3),
            0 0 40px rgba(79,195,247,0.12),
            inset 0 0 12px rgba(79,195,247,0.15)
          `,
          border: "1px solid rgba(79,195,247,0.3)",
        }}
      >
        {/* Rotating ring */}
        <motion.div
          className="absolute inset-[-2px] rounded-full"
          style={{
            border: "1px solid rgba(79,195,247,0.2)",
            borderTopColor: "rgba(79,195,247,0.5)",
            borderRightColor: "transparent",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Core icon */}
        <motion.div
          animate={{
            textShadow: [
              "0 0 8px rgba(79,195,247,0.6)",
              "0 0 16px rgba(79,195,247,0.8)",
              "0 0 8px rgba(79,195,247,0.6)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[20px]"
        >
          🤖
        </motion.div>
      </div>
    </motion.button>
  );
}

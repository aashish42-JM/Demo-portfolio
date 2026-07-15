"use client";

import { useRef, useCallback, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

interface FloatingAIButtonProps {
  onTap: () => void;
}

export default function FloatingAIButton({ onTap }: FloatingAIButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragRef = useRef(false);

  const handlePointerDown = useCallback(() => {
    dragRef.current = false;
  }, []);

  const handleDragStart = useCallback(() => {
    dragRef.current = true;
  }, []);

  const handleDragEnd = useCallback(() => {
    // If user dragged, don't fire tap
    setTimeout(() => {
      dragRef.current = false;
    }, 50);
  }, []);

  const handleTap = useCallback(() => {
    if (!dragRef.current) {
      onTap();
    }
  }, [onTap]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="fixed z-50"
      style={{
        bottom: "calc(82px + env(safe-area-inset-bottom, 0px))",
        right: "20px",
        x,
        y,
        touchAction: "none",
      }}
    >
      <motion.button
        type="button"
        onPointerDown={handlePointerDown}
        onClick={handleTap}
        whileTap={{ scale: 0.88 }}
        className="relative flex items-center justify-center"
        style={{ width: 56, height: 56 }}
      >
        {/* Outer glow */}
        <div
          className="absolute inset-[-8px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(79,195,247,0.22) 0%, transparent 70%)",
            filter: "blur(5px)",
          }}
        />

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-[-4px] rounded-full border border-[rgba(79,195,247,0.3)]"
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.4, 0.08, 0.4],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Button body */}
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, rgba(79,195,247,0.4), rgba(17,34,64,0.95) 60%, rgba(5,8,22,0.98))",
            boxShadow: `
              0 0 24px rgba(79,195,247,0.35),
              0 0 48px rgba(79,195,247,0.15),
              inset 0 0 14px rgba(79,195,247,0.2)
            `,
            border: "1px solid rgba(79,195,247,0.35)",
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
            className="text-[22px]"
          >
            🤖
          </motion.div>
        </div>
      </motion.button>
    </motion.div>
  );
}

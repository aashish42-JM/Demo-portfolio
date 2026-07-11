"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { AppWindow } from "@/types";

interface WindowProps {
  window: AppWindow;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, pos: { x: number; y: number }) => void;
  children: React.ReactNode;
}

export default function Window({
  window: win,
  onClose,
  onMinimize,
  onFocus,
  onMove,
  children,
}: WindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [prevPos, setPrevPos] = useState(win.position);
  const [prevSize, setPrevSize] = useState(win.size);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMaximized) return;
      onFocus(win.id);
      isDragging.current = true;
      dragOffset.current = {
        x: e.clientX - win.position.x,
        y: e.clientY - win.position.y,
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.current.x, window.innerWidth - win.size.width));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.current.y, window.innerHeight - 80));
        onMove(win.id, { x: newX, y: newY });
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [isMaximized, onFocus, onMove, win.id, win.position, win.size]
  );

  const toggleMaximize = () => {
    if (isMaximized) {
      setIsMaximized(false);
    } else {
      setPrevPos(win.position);
      setPrevSize(win.size);
      setIsMaximized(true);
    }
  };

  const currentStyle = isMaximized
    ? { top: 0, left: 0, width: "100vw", height: "calc(100vh - 48px)" }
    : {
        top: win.position.y,
        left: win.position.x,
        width: win.size.width,
        height: win.size.height,
      };

  return (
    <AnimatePresence>
      {win.isOpen && !win.isMinimized && (
        <motion.div
          ref={windowRef}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute glass-strong neon-border overflow-hidden"
          style={{
            ...currentStyle,
            zIndex: win.zIndex,
            transition: isMaximized ? "all 0.3s ease" : undefined,
          }}
          onClick={() => onFocus(win.id)}
        >
          {/* Title bar */}
          <div
            className="window-titlebar flex items-center gap-2 px-4 py-3 select-none"
            onMouseDown={handleMouseDown}
          >
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => { e.stopPropagation(); onClose(win.id); }}
                className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors flex items-center justify-center group"
                title="Close"
              >
                <X size={8} className="opacity-0 group-hover:opacity-100 text-red-900" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onMinimize(win.id); }}
                className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors flex items-center justify-center group"
                title="Minimize"
              >
                <Minus size={8} className="opacity-0 group-hover:opacity-100 text-yellow-900" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}
                className="w-3.5 h-3.5 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors flex items-center justify-center group"
                title="Maximize"
              >
                {isMaximized ? (
                  <Minimize2 size={8} className="opacity-0 group-hover:opacity-100 text-green-900" />
                ) : (
                  <Maximize2 size={8} className="opacity-0 group-hover:opacity-100 text-green-900" />
                )}
              </button>
            </div>

            {/* Title */}
            <div className="flex-1 flex items-center justify-center gap-2">
              <span className="text-lg">{win.icon}</span>
              <span className="font-mono text-xs text-[#64b5f6]/80 tracking-wider">
                {win.title}
              </span>
            </div>

            {/* Status indicator */}
            <div className="w-2 h-2 rounded-full bg-[#4fc3f7]/60 animate-pulse" />
          </div>

          {/* Content */}
          <div className="window-body" style={{ height: "calc(100% - 48px)" }}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

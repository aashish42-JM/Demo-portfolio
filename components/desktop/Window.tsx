"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { AppWindow } from "@/types";
import {
  WINDOW_CONSTRAINTS,
  clampWindowPosition,
  clampWindowSize,
  getMaximizedBounds,
} from "@/lib/windowConfig";

interface WindowProps {
  window: AppWindow;
  isFocused: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, pos: { x: number; y: number }) => void;
  onResize: (id: string, size: { width: number; height: number }) => void;
  onToggleMaximize: (id: string) => void;
  children: React.ReactNode;
}

const OPEN_TRANSITION = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };

export default function Window({
  window: win,
  isFocused,
  onClose,
  onMinimize,
  onFocus,
  onMove,
  onResize,
  onToggleMaximize,
  children,
}: WindowProps) {
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeHandle = useRef<{
    type: string;
    x: number;
    y: number;
    w: number;
    h: number;
    posX: number;
    posY: number;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => setIsScrolling(false), 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (win.isMaximized) return;
      onFocus(win.id);
      isDragging.current = true;
      dragOffset.current = {
        x: e.clientX - win.position.x,
        y: e.clientY - win.position.y,
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        const newPos = clampWindowPosition(
          {
            x: e.clientX - dragOffset.current.x,
            y: e.clientY - dragOffset.current.y,
          },
          win.size
        );
        onMove(win.id, newPos);
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [win.isMaximized, onFocus, onMove, win.id, win.position.x, win.position.y, win.size]
  );

  const startResize = useCallback(
    (e: React.MouseEvent, type: string) => {
      if (win.isMaximized) return;
      e.stopPropagation();
      onFocus(win.id);
      isResizing.current = true;
      resizeHandle.current = {
        type,
        x: e.clientX,
        y: e.clientY,
        w: win.size.width,
        h: win.size.height,
        posX: win.position.x,
        posY: win.position.y,
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current || !resizeHandle.current) return;

        const { type, x, y, w, h, posX, posY } = resizeHandle.current;
        let newWidth = w;
        let newHeight = h;
        let newX = posX;
        let newY = posY;

        const deltaX = e.clientX - x;
        const deltaY = e.clientY - y;

        if (type.includes("right")) {
          newWidth = w + deltaX;
        }
        if (type.includes("left")) {
          newWidth = w - deltaX;
          newX = posX + deltaX;
        }
        if (type.includes("bottom")) {
          newHeight = h + deltaY;
        }
        if (type.includes("top")) {
          newHeight = h - deltaY;
          newY = posY + deltaY;
        }

        const clampedSize = clampWindowSize({ width: newWidth, height: newHeight });

        if (type.includes("left")) {
          newX = posX + (w - clampedSize.width);
        }
        if (type.includes("top")) {
          newY = posY + (h - clampedSize.height);
        }

        const clampedPos = clampWindowPosition({ x: newX, y: newY }, clampedSize);
        onMove(win.id, clampedPos);
        onResize(win.id, clampedSize);
      };

      const handleMouseUp = () => {
        isResizing.current = false;
        resizeHandle.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [win.isMaximized, onFocus, onMove, onResize, win.id, win.position, win.size]
  );

  const bounds = win.isMaximized
    ? getMaximizedBounds()
    : {
        x: win.position.x,
        y: win.position.y,
        width: win.size.width,
        height: win.size.height,
      };

  return (
    <AnimatePresence>
      {win.isOpen && !win.isMinimized && (
        <motion.div
          key={win.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isFocused ? 1 : 0.88, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92, y: 60 }}
          transition={OPEN_TRANSITION}
          className={`absolute glass-strong neon-border overflow-hidden flex flex-col window-frame ${
            isFocused ? "window-focused" : "window-inactive"
          }`}
          style={{
            top: bounds.y,
            left: bounds.x,
            width: bounds.width,
            height: bounds.height,
            zIndex: win.zIndex,
            willChange: "transform, opacity",
            boxShadow: isFocused
              ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 60px rgba(79,195,247,0.15)"
              : "0 12px 28px rgba(0, 0, 0, 0.35), 0 0 30px rgba(79,195,247,0.06)",
            transition: win.isMaximized ? "top 0.25s ease, left 0.25s ease, width 0.25s ease, height 0.25s ease" : undefined,
          }}
          onMouseDown={() => onFocus(win.id)}
        >
          {/* Resize handles */}
          {!win.isMaximized && (
            <>
              <div className="absolute top-0 left-2 right-2 h-1.5 cursor-n-resize z-20" onMouseDown={(e) => startResize(e, "top")} />
              <div className="absolute bottom-0 left-2 right-2 h-1.5 cursor-s-resize z-20" onMouseDown={(e) => startResize(e, "bottom")} />
              <div className="absolute left-0 top-2 bottom-2 w-1.5 cursor-w-resize z-20" onMouseDown={(e) => startResize(e, "left")} />
              <div className="absolute right-0 top-2 bottom-2 w-1.5 cursor-e-resize z-20" onMouseDown={(e) => startResize(e, "right")} />
              <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-20" onMouseDown={(e) => startResize(e, "top-left")} />
              <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-20" onMouseDown={(e) => startResize(e, "top-right")} />
              <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-20" onMouseDown={(e) => startResize(e, "bottom-left")} />
              <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-20" onMouseDown={(e) => startResize(e, "bottom-right")} />
            </>
          )}

          {/* Title bar — always fixed */}
          <div
            className="window-titlebar flex items-center gap-2 px-5 py-3 select-none shrink-0 z-10"
            style={{ height: WINDOW_CONSTRAINTS.TITLE_BAR_HEIGHT, minHeight: WINDOW_CONSTRAINTS.TITLE_BAR_HEIGHT }}
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-2">
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
                onClick={(e) => { e.stopPropagation(); onToggleMaximize(win.id); }}
                className="w-3.5 h-3.5 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors flex items-center justify-center group"
                title={win.isMaximized ? "Restore" : "Maximize"}
              >
                {win.isMaximized ? (
                  <Minimize2 size={8} className="opacity-0 group-hover:opacity-100 text-green-900" />
                ) : (
                  <Maximize2 size={8} className="opacity-0 group-hover:opacity-100 text-green-900" />
                )}
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
              <span className="text-2xl shrink-0">{win.icon}</span>
              <span className="font-mono text-sm text-[#64b5f6]/90 tracking-wider truncate">
                {win.title}
              </span>
            </div>

            <div className="w-2.5 h-2.5 rounded-full bg-[#4fc3f7]/70 animate-pulse shrink-0" />
          </div>

          {/* Scrollable content — only this area scrolls */}
          <div
            ref={scrollRef}
            className={`window-body flex-1 min-h-0 overflow-hidden ${isScrolling ? "scrolling" : ""}`}
            onScroll={handleScroll}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

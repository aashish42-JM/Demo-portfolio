"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SKILLS } from "@/lib/data";
import { Skill } from "@/types";

interface SkillNode {
  skill: Skill;
  angle: number;
  radius: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function SkillGalaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<SkillNode[]>([]);
  const hoveredRef = useRef<Skill | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      initNodes();
    };

    const initNodes = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      nodesRef.current = SKILLS.map((skill, i) => {
        const angle = (i / SKILLS.length) * Math.PI * 2;
        const radius = 100 + (i % 3) * 80 + Math.random() * 50;
        return {
          skill,
          angle,
          radius,
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          vx: 0,
          vy: 0,
        };
      });
    };

    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.003;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw orbit rings
      [130, 200, 280].forEach((r, i) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(79,195,247,${0.06 + i * 0.03})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 12]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw center (core)
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
      grad.addColorStop(0, "rgba(79,195,247,0.7)");
      grad.addColorStop(0.5, "rgba(79,195,247,0.2)");
      grad.addColorStop(1, "rgba(79,195,247,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core text
      ctx.fillStyle = "#4fc3f7";
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("AASHISH", cx, cy - 10);
      ctx.font = "13px monospace";
      ctx.fillStyle = "rgba(79,195,247,0.7)";
      ctx.fillText("SKILLS", cx, cy + 10);

      // Animate nodes
      nodesRef.current.forEach((node, i) => {
        node.angle += 0.001 * (1 + (i % 3) * 0.3);
        node.x = cx + Math.cos(node.angle) * node.radius;
        node.y = cy + Math.sin(node.angle) * node.radius;

        const isHovered = hoveredRef.current?.name === node.skill.name;
        const planetR = (node.skill.size * 18 + (isHovered ? 6 : 0));

        // Connection line to core
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = `rgba(79,195,247,${isHovered ? 0.25 : 0.08})`;
        ctx.lineWidth = isHovered ? 2 : 0.8;
        ctx.stroke();

        // Planet glow
        if (isHovered) {
          const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, planetR * 3);
          glow.addColorStop(0, node.skill.color + "80");
          glow.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(node.x, node.y, planetR * 3, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Planet body
        const pGrad = ctx.createRadialGradient(
          node.x - planetR * 0.3,
          node.y - planetR * 0.3,
          0,
          node.x,
          node.y,
          planetR
        );
        pGrad.addColorStop(0, node.skill.color + "ee");
        pGrad.addColorStop(1, node.skill.color + "55");
        ctx.beginPath();
        ctx.arc(node.x, node.y, planetR, 0, Math.PI * 2);
        ctx.fillStyle = pGrad;
        ctx.fill();

        // Planet border
        ctx.strokeStyle = node.skill.color + (isHovered ? "ff" : "80");
        ctx.lineWidth = isHovered ? 2.5 : 1.5;
        ctx.stroke();

        // Skill name
        ctx.fillStyle = isHovered ? "#ffffff" : "rgba(255,255,255,0.85)";
        ctx.font = `${isHovered ? "bold " : ""}${Math.max(10, planetR * 0.75)}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          node.skill.name.length > 8 ? node.skill.name.substring(0, 7) + "." : node.skill.name,
          node.x,
          node.y
        );
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    let found: Skill | null = null;
    nodesRef.current.forEach((node) => {
      const dist = Math.hypot(mx - node.x, my - node.y);
      if (dist < node.skill.size * 24) {
        found = node.skill;
      }
    });
    hoveredRef.current = found;
    setHoveredSkill(found);
  };

  const levelColors = {
    beginner: "text-yellow-400",
    learning: "text-[#4fc3f7]",
    intermediate: "text-green-400",
    advanced: "text-purple-400",
  };

  return (
    <div ref={containerRef} className="relative w-full h-full p-4">
      <canvas
        ref={canvasRef}
        className="skill-canvas absolute inset-0"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          hoveredRef.current = null;
          setHoveredSkill(null);
        }}
      />

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredSkill && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 pointer-events-none glass-strong neon-border rounded-2xl p-5 w-64"
            style={{
              left: Math.min(mousePos.x + 16, (containerRef.current?.clientWidth ?? 500) - 272),
              top: Math.min(mousePos.y - 24, (containerRef.current?.clientHeight ?? 500) - 160),
            }}
          >
            <div className="font-bold text-white text-lg mb-2">{hoveredSkill.name}</div>
            <div className={`font-mono text-sm capitalize ${levelColors[hoveredSkill.level]} mb-2`}>
              ● {hoveredSkill.level}
            </div>
            <div className="text-sm text-[#64b5f6]/80 leading-relaxed">
              {hoveredSkill.description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute top-5 right-5 glass rounded-2xl p-5 text-sm space-y-2.5">
        <div className="font-mono text-xs text-[#4fc3f7]/70 uppercase tracking-widest mb-3">// Legend</div>
        {[
          { label: "Advanced", color: "text-purple-400" },
          { label: "Intermediate", color: "text-green-400" },
          { label: "Learning", color: "text-[#4fc3f7]" },
          { label: "Beginner", color: "text-yellow-400" },
        ].map((l) => (
          <div key={l.label} className={`flex items-center gap-2.5 ${l.color} font-mono`}>
            <div className="w-3.5 h-3.5 rounded-full bg-current" />
            {l.label}
          </div>
        ))}
        <div className="text-xs text-white/40 mt-3 font-mono">Hover planets to explore</div>
      </div>
    </div>
  );
}

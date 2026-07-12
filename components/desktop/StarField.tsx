"use client";

import { useRef, useEffect, useState } from "react";

interface Particle {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  life: number;
  maxLife: number;
  trail: { x: number; y: number }[];
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const lastTimeRef = useRef<number>(0);
  const rotationAngleRef = useRef<number>(0);
  const lastShootingStarRef = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleMouseLeave = () => setMousePos({ x: -1000, y: -1000 });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0, height = 0, centerX = 0, centerY = 0;

    const generateGalaxy = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      centerX = width / 2;
      centerY = height / 2;

      const particles: Particle[] = [];
      const numParticles = 6000;

      const armCount = 4;
      const armTightness = 0.18;
      const armSpread = 0.25;

      // Core stars
      for (let i = 0; i < 800; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.pow(Math.random(), 2) * Math.min(width, height) * 0.1;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        const colors = [
          "rgba(248,250,252,",
          "rgba(226,232,240,",
          "rgba(144,202,249,"
        ];
        particles.push({
          x,
          y,
          originalX: x,
          originalY: y,
          vx: 0,
          vy: 0,
          size: 0.8 + Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 0.4 + Math.random() * 0.6,
          twinkleSpeed: 0.001 + Math.random() * 0.004,
          twinkleOffset: Math.random() * Math.PI * 2
        });
      }

      // Spiral arm stars
      for (let i = 0; i < numParticles - 800; i++) {
        const arm = Math.floor(Math.random() * armCount);
        const armBaseAngle = (arm * Math.PI * 2) / armCount;

        const distance = Math.pow(Math.random(), 0.8) * Math.min(width, height) * 0.6;
        const angleVariance = (Math.random() - 0.5) * armSpread * (1 - distance / (Math.min(width, height) * 0.6));
        const angle = armBaseAngle + distance * armTightness + angleVariance;

        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        const distanceFactor = Math.max(0.08, 1 - distance / (Math.min(width, height) * 0.65));
        const size = 0.5 + Math.random() * 2.8 * distanceFactor;

        const colors = [
          "rgba(79, 195, 247,",
          "rgba(144, 202, 249,",
          "rgba(216, 180, 254,",
          "rgba(196, 181, 253,",
          "rgba(248, 250, 252,"
        ];

        particles.push({
          x,
          y,
          originalX: x,
          originalY: y,
          vx: 0,
          vy: 0,
          size,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 0.15 + Math.random() * 0.85 * distanceFactor,
          twinkleSpeed: 0.0005 + Math.random() * 0.0035,
          twinkleOffset: Math.random() * Math.PI * 2
        });
      }

      particlesRef.current = particles;
      shootingStarsRef.current = [];
    };

    generateGalaxy();
    const handleResize = () => generateGalaxy();
    window.addEventListener("resize", handleResize);

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const delta = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, width, height);

      if (!reducedMotion) {
        rotationAngleRef.current += (delta * Math.PI * 2) / (15 * 60); // 15 mins per full rotation
      }

      const cursorDist = (x1: number, y1: number, x2: number, y2: number) =>
        Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

      // Draw nebula background layers
      const drawNebula = (
        x: number,
        y: number,
        radius: number,
        color: string,
        rotate: number
      ) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotate + rotationAngleRef.current * 0.04);
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.8, radius * 0.65, -0.42, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      drawNebula(
        centerX,
        centerY,
        width * 0.48,
        "rgba(30, 58, 138, 0.16)",
        -0.38
      );
      drawNebula(
        centerX + 120,
        centerY - 60,
        width * 0.4,
        "rgba(56, 189, 248, 0.09)",
        -0.42
      );
      drawNebula(
        centerX - 90,
        centerY + 70,
        width * 0.35,
        "rgba(124, 58, 237, 0.08)",
        -0.32
      );

      // Core glow
      const coreGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        300
      );
      coreGlow.addColorStop(0, "rgba(248, 250, 252, 0.45)");
      coreGlow.addColorStop(0.12, "rgba(248, 250, 252, 0.25)");
      coreGlow.addColorStop(0.25, "rgba(79, 195, 247, 0.22)");
      coreGlow.addColorStop(0.5, "rgba(30, 58, 138, 0.1)");
      coreGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = coreGlow;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      particlesRef.current.forEach((p) => {
        const originalAngle = Math.atan2(p.originalY - centerY, p.originalX - centerX);
        const originalDistance = Math.sqrt((p.originalX - centerX) ** 2 + (p.originalY - centerY) ** 2);
        const rotatedAngle = originalAngle + rotationAngleRef.current * (1 - originalDistance / (Math.min(width, height) * 0.75));
        let targetX = centerX + Math.cos(rotatedAngle) * originalDistance;
        let targetY = centerY + Math.sin(rotatedAngle) * originalDistance;

        if (!reducedMotion && mousePos.x !== -1000) {
          const distToCursor = cursorDist(targetX, targetY, mousePos.x, mousePos.y);
          if (distToCursor < 250) {
            const force = Math.min(45, (250 - distToCursor) / 250 * 45);
            const angleToCursor = Math.atan2(mousePos.y - targetY, mousePos.x - targetX);
            targetX += Math.cos(angleToCursor) * force;
            targetY += Math.sin(angleToCursor) * force;
          }
        }

        p.x += (targetX - p.x) * 0.08;
        p.y += (targetY - p.y) * 0.08;

        const twinkle = 0.5 + 0.5 * Math.sin(currentTime * p.twinkleSpeed + p.twinkleOffset);
        const mouseProximity = !reducedMotion && mousePos.x !== -1000
          ? Math.max(0, 1 - cursorDist(p.x, p.y, mousePos.x, mousePos.y) / 230) * 0.55
          : 0;
        const finalOpacity = p.opacity * twinkle + mouseProximity;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.min(1, finalOpacity).toFixed(2).substring(2)})`;
        ctx.fill();
      });

      // Cursor gravitational glow
      if (!reducedMotion && mousePos.x !== -1000) {
        const glow = ctx.createRadialGradient(
          mousePos.x,
          mousePos.y,
          0,
          mousePos.x,
          mousePos.y,
          160
        );
        glow.addColorStop(0, "rgba(79, 195, 247, 0.15)");
        glow.addColorStop(0.35, "rgba(30, 58, 138, 0.07)");
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      // Shooting stars
      const now = currentTime;
      if (!reducedMotion && now - lastShootingStarRef.current > (6000 + Math.random() * 15000)) {
        lastShootingStarRef.current = now;
        const startX = Math.random() * width;
        const startY = Math.random() * height * 0.45;
        shootingStarsRef.current.push({
          x: startX,
          y: startY,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 1,
          speed: 22 + Math.random() * 18,
          length: 130 + Math.random() * 120,
          life: 0,
          maxLife: 1,
          trail: []
        });
      }

      shootingStarsRef.current = shootingStarsRef.current.filter(ss => {
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life += 0.016;

        if (ss.life > ss.maxLife) return false;

        ss.trail.unshift({ x: ss.x, y: ss.y });
        if (ss.trail.length > 50) ss.trail.pop();

        if (ss.trail.length > 1) {
          const trailGradient = ctx.createLinearGradient(
            ss.trail[0].x,
            ss.trail[0].y,
            ss.trail[ss.trail.length - 1].x,
            ss.trail[ss.trail.length - 1].y
          );
          trailGradient.addColorStop(0, `rgba(248, 250, 252, ${1 - ss.life})`);
          trailGradient.addColorStop(0.25, `rgba(144, 202, 249, ${1 - ss.life})`);
          trailGradient.addColorStop(1, "rgba(144, 202, 249, 0)");

          ctx.beginPath();
          ctx.moveTo(ss.trail[0].x, ss.trail[0].y);
          for (let i = 1; i < ss.trail.length; i++) {
            ctx.lineTo(ss.trail[i].x, ss.trail[i].y);
          }
          ctx.strokeStyle = trailGradient;
          ctx.lineWidth = 3.5;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 250, 252, ${1 - ss.life})`;
        ctx.fill();

        return true;
      });

      animRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = 0;
    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

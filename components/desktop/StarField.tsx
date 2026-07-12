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
      const numParticles = 7000;

      const colors = [
        "rgba(144, 202, 249,", // Light blue
        "rgba(129, 140, 248,", // Purple-blue
        "rgba(236, 72, 153,", // Pink
        "rgba(248, 113, 113,", // Red
        "rgba(167, 139, 250,", // Purple
        "rgba(74, 222, 128,", // Green
        "rgba(248, 250, 252,", // White
        "rgba(96, 165, 250,", // Blue
        "rgba(192, 132, 252,", // Violet
        "rgba(251, 146, 180," // Light pink
      ];

      // Core stars (dense center)
      for (let i = 0; i < 1500; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.pow(Math.random(), 2.5) * Math.min(width, height) * 0.15;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance * 0.6; // Elliptical

        particles.push({
          x,
          y,
          originalX: x,
          originalY: y,
          vx: 0,
          vy: 0,
          size: 0.8 + Math.random() * 3.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 0.45 + Math.random() * 0.55,
          twinkleSpeed: 0.001 + Math.random() * 0.0045,
          twinkleOffset: Math.random() * Math.PI * 2
        });
      }

      // Main elliptical galaxy
      for (let i = 0; i < numParticles - 1500; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.pow(Math.random(), 0.9) * Math.min(width, height) * 0.65;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance * 0.55; // Elliptical shape

        const distanceFactor = Math.max(0.05, 1 - distance / (Math.min(width, height) * 0.7));
        const size = 0.4 + Math.random() * 2.7 * distanceFactor;

        particles.push({
          x,
          y,
          originalX: x,
          originalY: y,
          vx: 0,
          vy: 0,
          size,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 0.12 + Math.random() * 0.88 * distanceFactor,
          twinkleSpeed: 0.0005 + Math.random() * 0.004,
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
        rotationAngleRef.current += (delta * Math.PI * 2) / (20 * 60); // 20 mins per full rotation
      }

      const cursorDist = (x1: number, y1: number, x2: number, y2: number) =>
        Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

      // Draw nebula background layers (elliptical)
      const drawNebula = (
        x: number,
        y: number,
        radius: number,
        color: string,
        rotate: number
      ) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotate + rotationAngleRef.current * 0.03);
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.6, radius * 0.6, -0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      drawNebula(
        centerX,
        centerY,
        width * 0.5,
        "rgba(30, 58, 138, 0.18)",
        -0.3
      );
      drawNebula(
        centerX + 100,
        centerY - 50,
        width * 0.42,
        "rgba(56, 189, 248, 0.1)",
        -0.38
      );
      drawNebula(
        centerX - 80,
        centerY + 60,
        width * 0.38,
        "rgba(124, 58, 237, 0.1)",
        -0.32
      );

      // Core glow
      const coreGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        320
      );
      coreGlow.addColorStop(0, "rgba(248, 250, 252, 0.5)");
      coreGlow.addColorStop(0.15, "rgba(248, 250, 252, 0.3)");
      coreGlow.addColorStop(0.3, "rgba(79, 195, 247, 0.25)");
      coreGlow.addColorStop(0.55, "rgba(124, 58, 237, 0.12)");
      coreGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = coreGlow;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      particlesRef.current.forEach((p) => {
        const originalAngle = Math.atan2(p.originalY - centerY, p.originalX - centerX);
        const originalDistance = Math.sqrt((p.originalX - centerX) ** 2 + (p.originalY - centerY) ** 2);
        const rotatedAngle = originalAngle + rotationAngleRef.current * (1 - originalDistance / (Math.min(width, height) * 0.8));
        let targetX = centerX + Math.cos(rotatedAngle) * originalDistance;
        let targetY = centerY + Math.sin(rotatedAngle) * originalDistance * 0.55; // Keep elliptical

        if (!reducedMotion && mousePos.x !== -1000) {
          const distToCursor = cursorDist(targetX, targetY, mousePos.x, mousePos.y);
          if (distToCursor < 280) {
            const force = Math.min(50, (280 - distToCursor) / 280 * 50);
            const angleToCursor = Math.atan2(mousePos.y - targetY, mousePos.x - targetX);
            targetX += Math.cos(angleToCursor) * force;
            targetY += Math.sin(angleToCursor) * force;
          }
        }

        p.x += (targetX - p.x) * 0.09;
        p.y += (targetY - p.y) * 0.09;

        const twinkle = 0.5 + 0.5 * Math.sin(currentTime * p.twinkleSpeed + p.twinkleOffset);
        const mouseProximity = !reducedMotion && mousePos.x !== -1000
          ? Math.max(0, 1 - cursorDist(p.x, p.y, mousePos.x, mousePos.y) / 250) * 0.6
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
          180
        );
        glow.addColorStop(0, "rgba(79, 195, 247, 0.18)");
        glow.addColorStop(0.4, "rgba(124, 58, 237, 0.1)");
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      // Shooting stars
      const now = currentTime;
      if (!reducedMotion && now - lastShootingStarRef.current > (5000 + Math.random() * 16000)) {
        lastShootingStarRef.current = now;
        const startX = Math.random() * width;
        const startY = Math.random() * height * 0.5;
        shootingStarsRef.current.push({
          x: startX,
          y: startY,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 1.2,
          speed: 24 + Math.random() * 20,
          length: 140 + Math.random() * 130,
          life: 0,
          maxLife: 1,
          trail: []
        });
      }

      shootingStarsRef.current = shootingStarsRef.current.filter(ss => {
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life += 0.015;

        if (ss.life > ss.maxLife) return false;

        ss.trail.unshift({ x: ss.x, y: ss.y });
        if (ss.trail.length > 60) ss.trail.pop();

        if (ss.trail.length > 1) {
          const trailColors = [
            "rgba(248,250,252,",
            "rgba(144,202,249,",
            "rgba(236,72,153,"
          ];
          const trailGradient = ctx.createLinearGradient(
            ss.trail[0].x,
            ss.trail[0].y,
            ss.trail[ss.trail.length - 1].x,
            ss.trail[ss.trail.length - 1].y
          );
          trailGradient.addColorStop(0, `${trailColors[Math.floor(Math.random()*trailColors.length)]}${1 - ss.life})`);
          trailGradient.addColorStop(0.3, "rgba(144,202,249,0)");
          trailGradient.addColorStop(1, "rgba(0,0,0,0)");

          ctx.beginPath();
          ctx.moveTo(ss.trail[0].x, ss.trail[0].y);
          for (let i = 1; i < ss.trail.length; i++) {
            ctx.lineTo(ss.trail[i].x, ss.trail[i].y);
          }
          ctx.strokeStyle = trailGradient;
          ctx.lineWidth = 4;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 5.5, 0, Math.PI * 2);
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

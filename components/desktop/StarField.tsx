"use client";

import { useRef, useEffect, useState } from "react";

// Helper to create seeded randomness for consistent galaxy
class SeededRandom {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }
}

interface Star {
  originalX: number;
  originalY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
  depth: number;
  angle: number;
  distanceFromCenter: number;
}

interface Nebula {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  color: string;
  depth: number;
}

interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  life: number;
  maxLife: number;
}

interface DustParticle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  depth: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const nebulasRef = useRef<Nebula[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const dustRef = useRef<DustParticle[]>([]);
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

      const rng = new SeededRandom(1337);
      const stars: Star[] = [];
      const numStars = 3000;

      for (let i = 0; i < numStars; i++) {
        const arm = Math.floor(rng.next() * 4);
        const armAngle = (arm * Math.PI) / 2 + 0.3;
        const armSpread = 0.6;
        const distance = rng.next() * Math.min(width, height) * 0.45;
        const angle = armAngle + (rng.next() - 0.5) * armSpread * (1 - distance / (Math.min(width, height) * 0.45));
        const depth = 0.2 + rng.next() * 0.8;

        const originalX = centerX + Math.cos(angle) * distance;
        const originalY = centerY + Math.sin(angle) * distance;

        const densityFactor = 1 - distance / (Math.min(width, height) * 0.45);

        stars.push({
          originalX,
          originalY,
          x: originalX,
          y: originalY,
          vx: 0,
          vy: 0,
          radius: 0.3 + rng.next() * 1.8,
          baseOpacity: 0.15 + rng.next() * 0.85 * Math.max(0.1, densityFactor),
          twinkleSpeed: 0.0005 + rng.next() * 0.003,
          twinkleOffset: rng.next() * Math.PI * 2,
          color:
            rng.next() > 0.92 ? "rgba(144, 202, 249,"
              : rng.next() > 0.85 ? "rgba(216, 180, 254,"
              : "rgba(248, 250, 252,",
          depth,
          angle,
          distanceFromCenter: distance
        });
      }
      starsRef.current = stars;

      const nebulas: Nebula[] = [];
      const addNebula = (x: number, y: number, rx: number, ry: number, rot: number, color: string, depth: number) => {
        nebulas.push({
          x: centerX + x,
          y: centerY + y,
          radiusX: rx,
          radiusY: ry,
          rotation: rot,
          color,
          depth
        });
      };
      addNebula(0, 0, width * 0.4, height * 0.18, -0.4, "rgba(30, 58, 138, 0.08)", 0.5);
      addNebula(80, -40, width * 0.35, height * 0.15, -0.35, "rgba(56, 189, 248, 0.05)", 0.4);
      addNebula(-100, 60, width * 0.28, height * 0.12, -0.45, "rgba(124, 58, 237, 0.04)", 0.6);
      addNebula(-width * 0.3, -height * 0.2, width * 0.2, height * 0.08, 0.2, "rgba(79, 195, 247, 0.025)", 0.8);
      addNebula(width * 0.3, height * 0.25, width * 0.22, height * 0.09, -0.1, "rgba(124, 58, 237, 0.02)", 0.7);
      nebulasRef.current = nebulas;

      const dust: DustParticle[] = [];
      for (let i = 0; i < 150; i++) {
        const distance = rng.next() * Math.min(width, height) * 0.5;
        const angle = rng.next() * Math.PI * 2;
        dust.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          radius: 1 + rng.next() * 2,
          vx: (rng.next() - 0.5) * 0.02,
          vy: (rng.next() - 0.5) * 0.02,
          opacity: 0.1 + rng.next() * 0.4,
          depth: 0.3 + rng.next() * 0.7
        });
      }
      dustRef.current = dust;

      shootingStarsRef.current = [];
    };

    generateGalaxy();
    const handleResize = () => generateGalaxy();
    window.addEventListener("resize", handleResize);

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const delta = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      ctx.clearRect(0, 0, width, height);

      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, "#020617");
      bgGradient.addColorStop(0.4, "#050816");
      bgGradient.addColorStop(0.6, "#020617");
      bgGradient.addColorStop(1, "#020617");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      const topLeft = ctx.createRadialGradient(0, 0, 0, 0, 0, width * 0.4);
      topLeft.addColorStop(0, "rgba(2,6,23,0.98)");
      topLeft.addColorStop(1, "rgba(2,6,23,0)");
      ctx.fillStyle = topLeft;
      ctx.fillRect(0, 0, width * 0.5, height * 0.4);

      const bottomGrad = ctx.createLinearGradient(0, height * 0.75, 0, height);
      bottomGrad.addColorStop(0, "rgba(2,6,23,0)");
      bottomGrad.addColorStop(1, "rgba(2,6,23,0.92)");
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, 0, width, height);

      if (!reducedMotion) {
        rotationAngleRef.current += (delta * Math.PI * 2) / (12 * 60); // 12 minutes per rotation
      }

      const parallaxX = reducedMotion ? 0 : (mousePos.x - centerX) / 100;
      const parallaxY = reducedMotion ? 0 : (mousePos.y - centerY) / 100;

      // Draw nebulas
      nebulasRef.current.forEach(nebula => {
        const px = nebula.x + parallaxX * nebula.depth * 0.2;
        const py = nebula.y + parallaxY * nebula.depth * 0.2;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(nebula.rotation + rotationAngleRef.current * 0.1);
        const grad = ctx.createRadialGradient(0,0,0,0,0,Math.max(nebula.radiusX, nebula.radiusY));
        grad.addColorStop(0, nebula.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, nebula.radiusX, nebula.radiusY, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      });

      const coreX = centerX + parallaxX * 0.1;
      const coreY = centerY + parallaxY * 0.1;
      const coreGlow = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, 180);
      coreGlow.addColorStop(0, "rgba(79,195,247,0.1)");
      coreGlow.addColorStop(0.4, "rgba(30,58,138,0.05)");
      coreGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = coreGlow;
      ctx.fillRect(0,0,width,height);

      const cursorDist = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt((x1-x2)**2 + (y1-y2)**2);

      // Update and draw dust
      dustRef.current.forEach(p => {
        const px = p.x + parallaxX * p.depth * 0.3;
        const py = p.y + parallaxY * p.depth * 0.3;
        if (!reducedMotion) {
          const dist = cursorDist(px, py, mousePos.x, mousePos.y);
          if (dist < 200) {
            const force = (200 - dist) / 200;
            const angle = Math.atan2(mousePos.y - py, mousePos.x - px);
            p.vx += Math.cos(angle) * force * 0.02;
            p.vy += Math.sin(angle) * force * 0.02;
          }
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98;
          p.vy *= 0.98;
        }
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI*2);
        ctx.fillStyle = `rgba(144,202,249,${p.opacity})`;
        ctx.fill();
      });

      // Update and draw stars
      starsRef.current.forEach(star => {
        const rotatedAngle = star.angle + rotationAngleRef.current * (1 - star.depth * 0.5);
        let targetX = centerX + Math.cos(rotatedAngle) * star.distanceFromCenter;
        let targetY = centerY + Math.sin(rotatedAngle) * star.distanceFromCenter;

        if (!reducedMotion && cursorDist(targetX, targetY, mousePos.x, mousePos.y) < 200) {
          const dist = cursorDist(targetX, targetY, mousePos.x, mousePos.y);
          const force = Math.min(30, (200 - dist) / 200 * 30);
          const angleToCursor = Math.atan2(mousePos.y - targetY, mousePos.x - targetX);
          targetX += Math.cos(angleToCursor) * force;
          targetY += Math.sin(angleToCursor) * force;
        }

        star.x += (targetX - star.x) * 0.05;
        star.y += (targetY - star.y) * 0.05;

        const sx = star.x + parallaxX * star.depth * 0.5;
        const sy = star.y + parallaxY * star.depth * 0.5;

        const twinkle = 0.5 + 0.5 * Math.sin(
          currentTime * star.twinkleSpeed + star.twinkleOffset
        );
        const mouseProx = !reducedMotion ? Math.max(0,1 - cursorDist(sx, sy, mousePos.x, mousePos.y)/180) * 0.4 : 0;
        const finalOpacity = star.baseOpacity * twinkle + mouseProx;

        ctx.beginPath();
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${Math.min(1,finalOpacity).toFixed(2).substring(2)})`;
        ctx.fill();
      });

      // Cursor glow
      if (!reducedMotion && mousePos.x !== -1000) {
        const glow = ctx.createRadialGradient(mousePos.x, mousePos.y,0,mousePos.x,mousePos.y,120);
        glow.addColorStop(0,"rgba(79,195,247,0.08)");
        glow.addColorStop(0.5,"rgba(30,58,138,0.03)");
        glow.addColorStop(1,"rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0,0,width,height);
      }

      // Shooting stars
      const now = currentTime;
      if (!reducedMotion && now - lastShootingStarRef.current > (8000 + Math.random() * 12000)) {
        lastShootingStarRef.current = now;
        shootingStarsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.4,
          angle: Math.PI/4 + (Math.random()-0.5)*0.8,
          speed: 18 + Math.random() * 12,
          length: 100 + Math.random() * 80,
          life:0,
          maxLife:1
        });
      }

      shootingStarsRef.current = shootingStarsRef.current.filter(ss => {
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life += 0.015;
        if (ss.life > ss.maxLife) return false;

        const trailGrad = ctx.createLinearGradient(
          ss.x, ss.y,
          ss.x - Math.cos(ss.angle)*ss.length,
          ss.y - Math.sin(ss.angle)*ss.length
        );
        trailGrad.addColorStop(0, `rgba(144,202,249,${1 - ss.life})`);
        trailGrad.addColorStop(1, "rgba(144,202,249,0)");
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - Math.cos(ss.angle)*ss.length, ss.y - Math.sin(ss.angle)*ss.length);
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 3, 0, Math.PI*2);
        ctx.fillStyle = `rgba(144,202,249,${1 - ss.life})`;
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

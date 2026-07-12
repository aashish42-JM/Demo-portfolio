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
  depth: number;
  noiseOffset: number;
}

interface EnergyOrb {
  x: number;
  y: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

interface ShootingParticle {
  x: number;
  y: number;
  angle: number;
  speed: number;
  life: number;
  maxLife: number;
  trail: { x: number; y: number }[];
}

interface EnergyPulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  maxLife: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const orbsRef = useRef<EnergyOrb[]>([]);
  const shootingRef = useRef<ShootingParticle[]>([]);
  const pulsesRef = useRef<EnergyPulse[]>([]);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const lastTimeRef = useRef<number>(0);
  const lastPulseRef = useRef<number>(0);
  const lastShootRef = useRef<number>(0);
  const timeRef = useRef(0);

  // Simple 2D noise function for organic movement
  const noise = (x: number, y: number, z: number): number => {
    return Math.sin(x * 0.01 + z) * Math.cos(y * 0.01 + z * 0.5);
  };

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

    const generateField = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      centerX = width / 2;
      centerY = height / 2;

      const particles: Particle[] = [];
      const colors = [
        "rgba(56, 189, 248,", // Light blue
        "rgba(96, 165, 250,", // Blue
        "rgba(129, 140, 248,", // Purple-blue
        "rgba(144, 202, 249,", // Sky blue
        "rgba(248, 250, 252," // White
      ];

      // Layered particles by depth
      for (let layer = 0; layer < 4; layer++) {
        const count = 1500 + layer * 500;
        const depthFactor = (layer + 1) / 4;

        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            originalX: Math.random() * width,
            originalY: Math.random() * height,
            vx: 0,
            vy: 0,
            size: 0.3 + Math.random() * 2 * depthFactor,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 0.1 + Math.random() * 0.6 * depthFactor,
            twinkleSpeed: 0.0005 + Math.random() * 0.002,
            twinkleOffset: Math.random() * Math.PI * 2,
            depth: depthFactor,
            noiseOffset: Math.random() * 100
          });
        }
      }

      particlesRef.current = particles;
      orbsRef.current = [];
      shootingRef.current = [];
      pulsesRef.current = [];
    };

    generateField();
    const handleResize = () => generateField();
    window.addEventListener("resize", handleResize);

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const delta = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;
      timeRef.current += delta;

      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, width, height);

      // Ambient glow layers
      const drawGlow = (x: number, y: number, radius: number, color: string) => {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      };

      drawGlow(
        centerX + Math.sin(timeRef.current * 0.03) * 100,
        centerY + Math.cos(timeRef.current * 0.02) * 80,
        width * 0.45,
        "rgba(30, 58, 138, 0.12)"
      );
      drawGlow(
        centerX + Math.cos(timeRef.current * 0.025) * 120,
        centerY + Math.sin(timeRef.current * 0.02) * 90,
        width * 0.38,
        "rgba(56, 189, 248, 0.08)"
      );
      drawGlow(
        centerX + Math.sin(timeRef.current * 0.035) * 90,
        centerY + Math.cos(timeRef.current * 0.028) * 110,
        width * 0.3,
        "rgba(124, 58, 237, 0.04)"
      );

      // Energy pulses
      const now = currentTime;
      if (!reducedMotion && now - lastPulseRef.current > 12000 + Math.random() * 8000) {
        lastPulseRef.current = now;
        pulsesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 0,
          maxRadius: 150 + Math.random() * 100,
          life: 0,
          maxLife: 2
        });
      }

      pulsesRef.current = pulsesRef.current.filter(pulse => {
        pulse.life += delta;
        pulse.radius = (pulse.life / pulse.maxLife) * pulse.maxRadius;
        const opacity = 1 - pulse.life / pulse.maxLife;

        if (pulse.life > pulse.maxLife) return false;

        ctx.strokeStyle = `rgba(56, 189, 248, ${opacity * 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx.stroke();

        return true;
      });

      // Shooting particles
      if (!reducedMotion && now - lastShootRef.current > 10000 + Math.random() * 8000) {
        lastShootRef.current = now;
        const angle = Math.random() * Math.PI * 2;
        shootingRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.6,
          angle,
          speed: 200 + Math.random() * 100,
          life: 0,
          maxLife: 0.6,
          trail: []
        });
      }

      shootingRef.current = shootingRef.current.filter(sp => {
        sp.x += Math.cos(sp.angle) * sp.speed * delta;
        sp.y += Math.sin(sp.angle) * sp.speed * delta;
        sp.life += delta;

        if (sp.life > sp.maxLife) return false;

        sp.trail.unshift({ x: sp.x, y: sp.y });
        if (sp.trail.length > 25) sp.trail.pop();

        if (sp.trail.length > 1) {
          const trailGrad = ctx.createLinearGradient(
            sp.trail[0].x, sp.trail[0].y,
            sp.trail[sp.trail.length - 1].x, sp.trail[sp.trail.length - 1].y
          );
          trailGrad.addColorStop(0, `rgba(248,250,252, ${0.8 * (1 - sp.life / sp.maxLife)})`);
          trailGrad.addColorStop(0.3, `rgba(56,189,248, ${0.5 * (1 - sp.life / sp.maxLife)})`);
          trailGrad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.lineWidth = 3;
          ctx.lineCap = "round";
          ctx.strokeStyle = trailGrad;
          ctx.beginPath();
          ctx.moveTo(sp.trail[0].x, sp.trail[0].y);
          sp.trail.forEach(p => ctx.lineTo(p.x, p.y));
          ctx.stroke();
        }

        return true;
      });

      // Energy orbs
      if (!reducedMotion && orbsRef.current.length < 4 && Math.random() < 0.003) {
        orbsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 2 + Math.random() * 4,
          life: 0,
          maxLife: 5 + Math.random() * 5,
          color: Math.random() > 0.5 ? "rgba(56,189,248," : "rgba(129,140,248,"
        });
      }

      orbsRef.current = orbsRef.current.filter(orb => {
        orb.life += delta;
        orb.x += (Math.sin(timeRef.current * 0.2 + orb.x) * 0.3);
        orb.y += (Math.cos(timeRef.current * 0.25 + orb.y) * 0.3);

        if (orb.life > orb.maxLife) return false;

        const opacity = orb.life < 1 ? orb.life : orb.life > orb.maxLife - 1 ? orb.maxLife - orb.life : 1;
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size * 3);
        grad.addColorStop(0, `${orb.color}${opacity * 0.5})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
        ctx.fillStyle = `${orb.color}${opacity})`;
        ctx.fill();

        return true;
      });

      // Update and draw quantum particles
      particlesRef.current.forEach(p => {
        let targetX = p.originalX;
        let targetY = p.originalY;

        // Organic noise-based movement
        if (!reducedMotion) {
          targetX += noise(p.originalX, p.originalY, timeRef.current * 0.1 + p.noiseOffset) * 20 * p.depth;
          targetY += noise(p.originalX + 100, p.originalY, timeRef.current * 0.1 + p.noiseOffset) * 20 * p.depth;
        }

        // Cursor interaction
        if (!reducedMotion && mousePos.x !== -1000) {
          const dist = Math.sqrt((targetX - mousePos.x) ** 2 + (targetY - mousePos.y) ** 2);
          if (dist < 180) {
            const force = Math.min(25, (180 - dist) / 180 * 25);
            const angle = Math.atan2(mousePos.y - targetY, mousePos.x - targetX);
            targetX += Math.cos(angle) * force * p.depth;
            targetY += Math.sin(angle) * force * p.depth;
          }
        }

        // Parallax
        const parallaxX = reducedMotion ? 0 : (mousePos.x - centerX) / 300 * p.depth;
        const parallaxY = reducedMotion ? 0 : (mousePos.y - centerY) / 300 * p.depth;
        targetX += parallaxX;
        targetY += parallaxY;

        p.x += (targetX - p.x) * 0.04;
        p.y += (targetY - p.y) * 0.04;

        // Twinkle
        const twinkle = 0.6 + 0.4 * Math.sin(timeRef.current * p.twinkleSpeed * 100 + p.twinkleOffset);
        const mouseProx = !reducedMotion && mousePos.x !== -1000
          ? Math.max(0, 1 - Math.sqrt((p.x - mousePos.x) ** 2 + (p.y - mousePos.y) ** 2) / 200) * 0.4
          : 0;

        // Pulse brightening
        let pulseBright = 1;
        pulsesRef.current.forEach(pulse => {
          const d = Math.sqrt((p.x - pulse.x) ** 2 + (p.y - pulse.y) ** 2);
          if (d < pulse.radius + 50) {
            pulseBright += (1 - d / (pulse.radius + 50)) * 0.5;
          }
        });

        const finalOpacity = Math.min(1, p.opacity * twinkle + mouseProx) * pulseBright;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${finalOpacity.toFixed(2).substring(2)})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(animate);
    };

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

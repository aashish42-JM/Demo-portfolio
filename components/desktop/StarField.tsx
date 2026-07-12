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
  depth: number; // 0 = background, 1 = midground, 2 = foreground
  noiseOffset: number;
  brightness: number; // 0 = dim, 1 = medium, 2 = bright
  twinkle: boolean;
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
  const mousePosRef = useRef({ x: -1000, y: -1000 });
  const iconsRef = useRef<{ x: number; y: number }[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const lastTimeRef = useRef<number>(0);
  const lastPulseRef = useRef<number>(0);
  const lastShootRef = useRef<number>(0);
  const timeRef = useRef(0);
  const rotationRef = useRef(0);

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
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mousePosRef.current = { x: -1000, y: -1000 };
    };
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

    // Helper to get desktop icon positions
    const getDesktopIconPositions = () => {
      const icons: { x: number; y: number }[] = [];
      const iconElements = document.querySelectorAll('[id^="app-icon-"]');
      iconElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        icons.push({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      });
      return icons;
    };

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

      iconsRef.current = getDesktopIconPositions();

      // Calculate total particles: reduce by ~35% from original 7500 (4 layers × ~1875 each) → ~4875
      const totalParticles = 4800;
      const bgCount = Math.floor(totalParticles * 0.6);
      const midCount = Math.floor(totalParticles * 0.3);
      const fgCount = totalParticles - bgCount - midCount;

      // Layer configuration
      const layerConfigs = [
        { count: bgCount, depth: 0, minSize: 1, maxSize: 2, minOpacity: 0.05, maxOpacity: 0.2, maxParallax: 2, cursorForce: 0.1, movementSpeed: 0.2 },
        { count: midCount, depth: 1, minSize: 1.5, maxSize: 3.5, minOpacity: 0.15, maxOpacity: 0.45, maxParallax: 6, cursorForce: 0.5, movementSpeed: 0.5 },
        { count: fgCount, depth: 2, minSize: 2.5, maxSize: 5, minOpacity: 0.3, maxOpacity: 0.7, maxParallax: 12, cursorForce: 1, movementSpeed: 0.8 },
      ];

      layerConfigs.forEach((config) => {
        for (let i = 0; i < config.count; i++) {
          // Generate star in a circle that covers the entire screen
          const maxRadius = Math.sqrt(width * width + height * height) / 2; // Diagonal half-length
          const angle = Math.random() * Math.PI * 2;
          const r = maxRadius * Math.sqrt(Math.random()); // Uniform distribution in circle
          
          let x = centerX + r * Math.cos(angle);
          let y = centerY + r * Math.sin(angle);
          
          // Brightness distribution: 75% dim (0), 20% medium (1), 5% bright (2)
          const brightnessRoll = Math.random();
          let brightness = 0;
          if (brightnessRoll > 0.95) brightness = 2;
          else if (brightnessRoll > 0.75) brightness = 1;
          
          particles.push({
            x,
            y,
            originalX: x,
            originalY: y,
            vx: 0,
            vy: 0,
            size: config.minSize + Math.random() * (config.maxSize - config.minSize),
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: config.minOpacity + Math.random() * (config.maxOpacity - config.minOpacity),
            twinkleSpeed: 0.0003 + Math.random() * 0.001,
            twinkleOffset: Math.random() * Math.PI * 2,
            depth: config.depth,
            noiseOffset: Math.random() * 100,
            brightness,
            twinkle: Math.random() < 0.05, // only 5% twinkle
          });
        }
      });

      particlesRef.current = particles;
      orbsRef.current = [];
      shootingRef.current = [];
      pulsesRef.current = [];
    };

    generateField();
    const handleResize = () => generateField();
    window.addEventListener("resize", handleResize);

    // Refresh icon positions after initial render
    setTimeout(() => {
      iconsRef.current = getDesktopIconPositions();
    }, 500);

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const delta = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;
      timeRef.current += delta;

      // Background rotation: full revolution every ~25 mins (25*60=1500 seconds)
      const rotationSpeed = (Math.PI * 2) / 1500; // radians per second
      if (!reducedMotion) {
        rotationRef.current += rotationSpeed * delta;
      }

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

      // Shooting particles - more frequent
      if (!reducedMotion && now - lastShootRef.current > 3000 + Math.random() * 5000) {
        lastShootRef.current = now;
        const angle = Math.random() * Math.PI * 2;
        shootingRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.6,
          angle,
          speed: 300 + Math.random() * 200,
          life: 0,
          maxLife: 0.8,
          trail: []
        });
      }

      shootingRef.current = shootingRef.current.filter(sp => {
        sp.x += Math.cos(sp.angle) * sp.speed * delta;
        sp.y += Math.sin(sp.angle) * sp.speed * delta;
        sp.life += delta;

        if (sp.life > sp.maxLife) return false;

        sp.trail.unshift({ x: sp.x, y: sp.y });
        if (sp.trail.length > 40) sp.trail.pop();

        if (sp.trail.length > 1) {
          const trailGrad = ctx.createLinearGradient(
            sp.trail[0].x, sp.trail[0].y,
            sp.trail[sp.trail.length - 1].x, sp.trail[sp.trail.length - 1].y
          );
          trailGrad.addColorStop(0, `rgba(248,250,252, ${1 * (1 - sp.life / sp.maxLife)})`);
          trailGrad.addColorStop(0.2, `rgba(56,189,248, ${0.8 * (1 - sp.life / sp.maxLife)})`);
          trailGrad.addColorStop(0.5, `rgba(129,140,248, ${0.5 * (1 - sp.life / sp.maxLife)})`);
          trailGrad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.lineWidth = 6;
          ctx.lineCap = "round";
          ctx.strokeStyle = trailGrad;
          ctx.beginPath();
          ctx.moveTo(sp.trail[0].x, sp.trail[0].y);
          sp.trail.forEach(p => ctx.lineTo(p.x, p.y));
          ctx.stroke();

          // Add a bright dot at the head
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(248,250,252, ${1 - sp.life / sp.maxLife})`;
          ctx.fill();
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

      // Layer configs for easy reference
      const layerConfigArray = [
        { maxParallax: 2, cursorForce: 0.1, movementSpeed: 0.2 },
        { maxParallax: 6, cursorForce: 0.5, movementSpeed: 0.5 },
        { maxParallax: 12, cursorForce: 1, movementSpeed: 0.8 },
      ];

      // Update and draw particles
      particlesRef.current.forEach(p => {
        // Rotate original position around center
        const dx = p.originalX - centerX;
        const dy = p.originalY - centerY;
        const rotatedX = centerX + dx * Math.cos(rotationRef.current) - dy * Math.sin(rotationRef.current);
        const rotatedY = centerY + dx * Math.sin(rotationRef.current) + dy * Math.cos(rotationRef.current);
        
        let targetX = rotatedX;
        let targetY = rotatedY;

        const layerConfig = layerConfigArray[p.depth];

        // Organic noise-based movement
        if (!reducedMotion) {
          targetX += noise(p.originalX, p.originalY, timeRef.current * 0.1 + p.noiseOffset) * 10 * layerConfig.movementSpeed;
          targetY += noise(p.originalX + 100, p.originalY, timeRef.current * 0.1 + p.noiseOffset) * 10 * layerConfig.movementSpeed;
        }

        // Cursor interaction
        if (!reducedMotion && mousePosRef.current.x !== -1000) {
          const dist = Math.sqrt((targetX - mousePosRef.current.x) ** 2 + (targetY - mousePosRef.current.y) ** 2);
          if (dist < 300) {
            const force = Math.min(80 * layerConfig.cursorForce, (300 - dist) / 300 * 80 * layerConfig.cursorForce);
            const angle = Math.atan2(mousePosRef.current.y - targetY, mousePosRef.current.x - targetX);
            targetX += Math.cos(angle) * force;
            targetY += Math.sin(angle) * force;
          }
        }

        // Parallax
        const parallaxX = reducedMotion ? 0 : (mousePosRef.current.x - centerX) / 300 * layerConfig.maxParallax;
        const parallaxY = reducedMotion ? 0 : (mousePosRef.current.y - centerY) / 300 * layerConfig.maxParallax;
        targetX += parallaxX;
        targetY += parallaxY;

        p.x += (targetX - p.x) * 0.04;
        p.y += (targetY - p.y) * 0.04;

        // Calculate safe zone opacity reduction
        let safeZoneFactor = 1;
        iconsRef.current.forEach(icon => {
          const dist = Math.sqrt((p.x - icon.x) ** 2 + (p.y - icon.y) ** 2);
          const safeRadius = 140;
          if (dist < safeRadius) {
            const fadeStart = safeRadius * 0.5;
            if (dist < fadeStart) {
              safeZoneFactor = Math.min(safeZoneFactor, 0.4); // 60% reduction
            } else {
              const t = (dist - fadeStart) / (safeRadius - fadeStart);
              safeZoneFactor = Math.min(safeZoneFactor, 0.4 + t * 0.6);
            }
          }
        });

        // Twinkle only for some stars
        let twinkle = 1;
        if (p.twinkle) {
          twinkle = 0.7 + 0.3 * Math.sin(timeRef.current * p.twinkleSpeed * 100 + p.twinkleOffset);
        }

        const mouseProx = !reducedMotion && mousePosRef.current.x !== -1000
          ? Math.max(0, 1 - Math.sqrt((p.x - mousePosRef.current.x) ** 2 + (p.y - mousePosRef.current.y) ** 2) / 200) * 0.3
          : 0;

        // Brightness multiplier
        let brightnessMultiplier = 1;
        if (p.brightness === 2) brightnessMultiplier = 1.8;
        else if (p.brightness === 1) brightnessMultiplier = 1.2;

        let pulseBright = 1;
        pulsesRef.current.forEach(pulse => {
          const d = Math.sqrt((p.x - pulse.x) ** 2 + (p.y - pulse.y) ** 2);
          if (d < pulse.radius + 50) {
            pulseBright += (1 - d / (pulse.radius + 50)) * 0.5;
          }
        });

        const finalOpacity = Math.min(1, p.opacity * twinkle * brightnessMultiplier * safeZoneFactor + mouseProx) * pulseBright;

        // Draw glow for bright stars
        if (p.brightness === 2) {
          const glowSize = p.size * 4;
          const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
          glowGrad.addColorStop(0, `${p.color}${Math.min(1, finalOpacity * 0.5)})`);
          glowGrad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
        }

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

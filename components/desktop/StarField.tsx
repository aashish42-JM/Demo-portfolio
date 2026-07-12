"use client";

import { useRef, useEffect, useState } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
}

interface Nebula {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  color: string;
  alpha: number;
}

interface Planet {
  x: number;
  y: number;
  radius: number;
  color1: string;
  color2: string;
  glowColor: string;
  glowRadius: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const nebulasRef = useRef<Nebula[]>([]);
  const planetsRef = useRef<Planet[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) / 80,
        y: (e.clientY - window.innerHeight / 2) / 80,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      generateStars();
      generateNebulas();
      generatePlanets();
    };

    const generateStars = () => {
      const stars: Star[] = [];
      const numStars = 2500;

      for (let i = 0; i < numStars; i++) {
        const distanceFromCenter = Math.sqrt(
          Math.pow((Math.random() - 0.5) * width, 2) +
            Math.pow((Math.random() - 0.5) * height, 2)
        );
        const distanceFactor = Math.max(
          0.1,
          1 - distanceFromCenter / (width * 0.6)
        );
        const x = Math.random() * width;
        const y = Math.random() * height;
        const baseOpacity =
          0.1 + Math.random() * 0.7 * distanceFactor;
        const radius = 0.3 + Math.random() * 1.8;
        stars.push({
          x,
          y,
          radius,
          baseOpacity,
          twinkleSpeed: 0.001 + Math.random() * 0.003,
          twinkleOffset: Math.random() * Math.PI * 2,
          color:
            Math.random() > 0.9
              ? "rgba(144,202,249,"
              : Math.random() > 0.8
              ? "rgba(216,180,254,"
              : "rgba(248,250,252,",
        });
      }
      starsRef.current = stars;
    };

    const generateNebulas = () => {
      const nebulas: Nebula[] = [];
      const centerX = width / 2;
      const centerY = height / 2;

      nebulas.push({
        x: centerX,
        y: centerY,
        radiusX: width * 0.8,
        radiusY: width * 0.3,
        rotation: -0.4,
        color: "rgba(30, 58, 138, 0.08)",
        alpha: 0.08,
      });
      nebulas.push({
        x: centerX + 80,
        y: centerY - 40,
        radiusX: width * 0.6,
        radiusY: width * 0.25,
        rotation: -0.35,
        color: "rgba(56, 189, 248, 0.05)",
        alpha: 0.05,
      });
      nebulas.push({
        x: centerX - 100,
        y: centerY + 60,
        radiusX: width * 0.45,
        radiusY: width * 0.18,
        rotation: -0.45,
        color: "rgba(124, 58, 237, 0.04)",
        alpha: 0.04,
      });
      nebulas.push({
        x: width * 0.15,
        y: height * 0.25,
        radiusX: width * 0.3,
        radiusY: width * 0.15,
        rotation: 0.2,
        color: "rgba(79, 195, 247, 0.03)",
        alpha: 0.03,
      });
      nebulas.push({
        x: width * 0.85,
        y: height * 0.75,
        radiusX: width * 0.35,
        radiusY: width * 0.16,
        rotation: -0.1,
        color: "rgba(124, 58, 237, 0.025)",
        alpha: 0.025,
      });

      nebulasRef.current = nebulas;
    };

    const generatePlanets = () => {
      const planets: Planet[] = [
        {
          x: width * 0.08,
          y: height * 0.15,
          radius: 40,
          color1: "rgba(79,195,247,0.4)",
          color2: "rgba(30,58,138,0.2)",
          glowColor: "rgba(79,195,247,0.1)",
          glowRadius: 120,
        },
        {
          x: width * 0.92,
          y: height * 0.85,
          radius: 30,
          color1: "rgba(124,58,237,0.35)",
          color2: "rgba(15,23,42,0.3)",
          glowColor: "rgba(124,58,237,0.08)",
          glowRadius: 90,
        },
        {
          x: width * 0.12,
          y: height * 0.88,
          radius: 20,
          color1: "rgba(56,189,248,0.3)",
          color2: "rgba(2,6,23,0.4)",
          glowColor: "rgba(56,189,248,0.06)",
          glowRadius: 60,
        },
      ];
      planetsRef.current = planets;
    };

    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      if (!reducedMotion) {
        time += 0.005;
      }

      const offsetX = reducedMotion ? 0 : mousePos.x;
      const offsetY = reducedMotion ? 0 : mousePos.y;

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#020617");
      gradient.addColorStop(0.4, "#050816");
      gradient.addColorStop(0.6, "#020617");
      gradient.addColorStop(1, "#020617");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const topLeftGradient = ctx.createRadialGradient(
        0,
        0,
        0,
        0,
        0,
        width * 0.4
      );
      topLeftGradient.addColorStop(0, "rgba(2,6,23,0.95)");
      topLeftGradient.addColorStop(1, "rgba(2,6,23,0)");
      ctx.fillStyle = topLeftGradient;
      ctx.fillRect(0, 0, width * 0.5, height * 0.4);

      const bottomGradient = ctx.createLinearGradient(
        0,
        height * 0.75,
        0,
        height
      );
      bottomGradient.addColorStop(0, "rgba(2,6,23,0)");
      bottomGradient.addColorStop(1, "rgba(2,6,23,0.9)");
      ctx.fillStyle = bottomGradient;
      ctx.fillRect(0, 0, width, height);

      nebulasRef.current.forEach((nebula) => {
        ctx.save();
        const x = nebula.x + offsetX * 0.2;
        const y = nebula.y + offsetY * 0.2;
        ctx.translate(x, y);
        ctx.rotate(nebula.rotation);
        const radial = ctx.createRadialGradient(
          0,
          0,
          0,
          0,
          0,
          Math.max(nebula.radiusX, nebula.radiusY)
        );
        radial.addColorStop(0, nebula.color);
        radial.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.ellipse(0, 0, nebula.radiusX, nebula.radiusY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      const coreX = width / 2 + offsetX * 0.1;
      const coreY = height / 2 + offsetY * 0.1;
      const coreGlow = ctx.createRadialGradient(
        coreX,
        coreY,
        0,
        coreX,
        coreY,
        150
      );
      coreGlow.addColorStop(0, "rgba(79,195,247,0.08)");
      coreGlow.addColorStop(0.5, "rgba(30,58,138,0.04)");
      coreGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = coreGlow;
      ctx.fillRect(0, 0, width, height);

      planetsRef.current.forEach((planet) => {
        const px = planet.x + offsetX * 0.3;
        const py = planet.y + offsetY * 0.3;

        const planetGlow = ctx.createRadialGradient(
          px,
          py,
          0,
          px,
          py,
          planet.glowRadius
        );
        planetGlow.addColorStop(0, planet.glowColor);
        planetGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = planetGlow;
        ctx.beginPath();
        ctx.arc(px, py, planet.glowRadius, 0, Math.PI * 2);
        ctx.fill();

        const planetGradient = ctx.createRadialGradient(
          px - planet.radius * 0.3,
          py - planet.radius * 0.3,
          0,
          px,
          py,
          planet.radius
        );
        planetGradient.addColorStop(0, planet.color1);
        planetGradient.addColorStop(1, planet.color2);
        ctx.fillStyle = planetGradient;
        ctx.beginPath();
        ctx.arc(px, py, planet.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      starsRef.current.forEach((star) => {
        const twinkle =
          0.6 +
          0.4 *
            Math.sin(
              time * star.twinkleSpeed * 50 + star.twinkleOffset
            );
        const starX = star.x + offsetX * 0.5;
        const starY = star.y + offsetY * 0.5;
        const distanceToMouse = Math.sqrt(
          Math.pow(starX - (mousePos.x * 80 + width / 2), 2) +
            Math.pow(starY - (mousePos.y * 80 + height / 2), 2)
        );
        const mouseBrightness = reducedMotion
          ? 0
          : Math.max(0, 1 - distanceToMouse / 120) * 0.5;
        const finalOpacity =
          star.baseOpacity * twinkle + mouseBrightness;

        ctx.beginPath();
        ctx.arc(starX, starY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${Math.min(
          1,
          finalOpacity
        ).toString().padStart(2, "0")})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion, mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

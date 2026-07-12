"use client";

import { useRef, useEffect, useState } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  speed: number;
  twinkleOffset: number;
  driftX: number;
  driftY: number;
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

interface Particle {
  x: number;
  y: number;
  r: number;
  opacity: number;
  speedY: number;
  speedX: number;
  opacitySpeed: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  speedX: number;
  speedY: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const nebulasRef = useRef<Nebula[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(checkReducedMotion.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    checkReducedMotion.addEventListener("change", handleChange);
    return () => checkReducedMotion.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = Array.from({ length: 250 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.7 + 0.1,
        speed: Math.random() * 0.0005 + 0.0002,
        twinkleOffset: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.01,
        driftY: (Math.random() - 0.5) * 0.01,
      }));
      particlesRef.current = Array.from({ length: 30 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        speedY: (Math.random() - 0.5) * 0.1,
        speedX: (Math.random() - 0.5) * 0.05,
        opacitySpeed: (Math.random() - 0.5) * 0.002,
      }));
      nebulasRef.current = [
        {
          x: canvas.width * 0.2,
          y: canvas.height * 0.3,
          radius: canvas.width * 0.4,
          color: "rgba(37, 99, 235, 0.03)",
          speedX: 0.005,
          speedY: 0.003,
        },
        {
          x: canvas.width * 0.8,
          y: canvas.height * 0.7,
          radius: canvas.width * 0.5,
          color: "rgba(56, 189, 248, 0.02)",
          speedX: -0.004,
          speedY: 0.005,
        },
        {
          x: canvas.width * 0.5,
          y: canvas.height * 0.5,
          radius: canvas.width * 0.35,
          color: "rgba(30, 58, 138, 0.025)",
          speedX: 0.003,
          speedY: -0.004,
        },
      ];
    };

    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    let lastShootingStar = 0;
    const nextShootingStarDelay = () => Math.random() * 12000 + 8000; // 8-20 seconds

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!prefersReducedMotion) {
        t += 1;
      }

      // Parallax calculation
      const parallaxX = prefersReducedMotion
        ? 0
        : (mousePos.x - canvas.width / 2) / (canvas.width / 10);
      const parallaxY = prefersReducedMotion
        ? 0
        : (mousePos.y - canvas.height / 2) / (canvas.height / 10);

      // Draw nebulas
      nebulasRef.current.forEach((nebula) => {
        if (!prefersReducedMotion) {
          nebula.x += nebula.speedX;
          nebula.y += nebula.speedY;
          if (nebula.x < -nebula.radius) nebula.x = canvas.width + nebula.radius;
          if (nebula.x > canvas.width + nebula.radius) nebula.x = -nebula.radius;
          if (nebula.y < -nebula.radius) nebula.y = canvas.height + nebula.radius;
          if (nebula.y > canvas.height + nebula.radius) nebula.y = -nebula.radius;
        }
        const gradient = ctx.createRadialGradient(
          nebula.x + parallaxX * 0.2,
          nebula.y + parallaxY * 0.2,
          0,
          nebula.x + parallaxX * 0.2,
          nebula.y + parallaxY * 0.2,
          nebula.radius
        );
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(
          nebula.x + parallaxX * 0.2,
          nebula.y + parallaxY * 0.2,
          nebula.radius,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw stars
      starsRef.current.forEach((star) => {
        if (!prefersReducedMotion) {
          star.x += star.driftX;
          star.y += star.driftY;
          if (star.x < 0) star.x = canvas.width;
          if (star.x > canvas.width) star.x = 0;
          if (star.y < 0) star.y = canvas.height;
          if (star.y > canvas.height) star.y = 0;
        }
        const twinkle =
          star.opacity *
          (0.5 + 0.5 * Math.sin(t * star.speed * 100 + star.twinkleOffset));
        const cursorDistance = Math.sqrt(
          Math.pow(star.x - mousePos.x, 2) + Math.pow(star.y - mousePos.y, 2)
        );
        const cursorBrightness = prefersReducedMotion
          ? 0
          : Math.max(0, 1 - cursorDistance / 150) * 0.5;
        ctx.beginPath();
        ctx.arc(
          star.x + parallaxX * 0.5,
          star.y + parallaxY * 0.5,
          star.r,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(144, 202, 249, ${
          twinkle + cursorBrightness
        })`;
        ctx.fill();
      });

      // Draw particles
      particlesRef.current.forEach((particle) => {
        if (!prefersReducedMotion) {
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          particle.opacity += particle.opacitySpeed;
          if (particle.opacity < 0.1) particle.opacitySpeed = Math.abs(particle.opacitySpeed);
          if (particle.opacity > 0.5) particle.opacitySpeed = -Math.abs(particle.opacitySpeed);
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;
        }
        ctx.beginPath();
        ctx.arc(
          particle.x + parallaxX * 0.3,
          particle.y + parallaxY * 0.3,
          particle.r,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(79, 195, 247, ${particle.opacity})`;
        ctx.fill();
      });

      // Shooting stars
      if (!prefersReducedMotion && Date.now() - lastShootingStar > nextShootingStarDelay()) {
        lastShootingStar = Date.now();
        shootingStarsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.4),
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.6,
          speed: 15 + Math.random() * 10,
          length: 80 + Math.random() * 60,
          life: 0,
          maxLife: 1,
        });
      }

      shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.life += 0.02;

        if (star.life > star.maxLife) return false;

        // Draw shooting star
        const gradient = ctx.createLinearGradient(
          star.x,
          star.y,
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );
        gradient.addColorStop(0, `rgba(144, 202, 249, ${1 - star.life})`);
        gradient.addColorStop(1, "rgba(144, 202, 249, 0)");
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw head
        ctx.beginPath();
        ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(144, 202, 249, ${1 - star.life})`;
        ctx.fill();

        return true;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [prefersReducedMotion, mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

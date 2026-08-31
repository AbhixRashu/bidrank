"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const COLORS = ["#FF8A00", "#FFB347", "#FFD700", "#FF6B35", "#FFA500", "#FFE066"];

export function ConfettiBurst({ trigger, onComplete }: { trigger: boolean; onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const hasTriggered = useRef(false);

  const createParticles = useCallback((canvas: HTMLCanvasElement) => {
    const particles: Particle[] = [];
    const count = 80;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 3 + Math.random() * 8;

      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: 4 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        opacity: 1,
      });
    }

    return particles;
  }, []);

  useEffect(() => {
    if (!trigger || hasTriggered.current) return;
    hasTriggered.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particlesRef.current = createParticles(canvas);
    let startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      if (elapsed > 3) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesRef.current = [];
        onComplete?.();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - elapsed / 2.5);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [trigger, createParticles, onComplete]);

  useEffect(() => {
    if (!trigger) {
      hasTriggered.current = false;
    }
  }, [trigger]);

  if (!trigger) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    />
  );
}

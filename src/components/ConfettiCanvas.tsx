import React, { useEffect, useRef } from 'react';

interface ConfettiCanvasProps {
  burstKey: number;
  intensity?: 'normal' | 'victory';
  disabled?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  flipSpeed: number;
  flipPhase: number;
  shape: 'rect' | 'circle';
  alpha: number;
}

const ARENA_CONFETTI_COLORS = [
  '#3B2FBF', // Deep Indigo
  '#FF7A1A', // Hot Orange
  '#22C58B', // Mint Green
  '#FFC83D', // Sunshine Yellow
  '#6D5DF6', // Bright Indigo highlight
];

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({
  burstKey,
  intensity = 'normal',
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (burstKey === 0 || disabled) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = intensity === 'victory' ? 115 : 68;
    const origins =
      intensity === 'victory'
        ? [
            { x: width * 0.28, y: height * 0.42 },
            { x: width * 0.72, y: height * 0.42 },
          ]
        : [{ x: width * 0.5, y: height * 0.36 }];

    for (let i = 0; i < count; i++) {
      const origin = origins[i % origins.length];
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.65;
      const speed = 5 + Math.random() * (intensity === 'victory' ? 11 : 8.5);
      particlesRef.current.push({
        x: origin.x + (Math.random() - 0.5) * 60,
        y: origin.y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 6 + Math.random() * 6,
        color: ARENA_CONFETTI_COLORS[i % ARENA_CONFETTI_COLORS.length],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.22,
        flipSpeed: 0.08 + Math.random() * 0.14,
        flipPhase: Math.random() * Math.PI * 2,
        shape: i % 4 === 0 ? 'circle' : 'rect',
        alpha: 1,
      });
    }

    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const nextParticles: Particle[] = [];
      for (const p of particlesRef.current) {
        p.vy += 0.28; // gravity
        p.vx *= 0.985; // air drag
        p.vy *= 0.992;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.flipPhase += p.flipSpeed;

        if (p.y > h * 0.78) {
          p.alpha -= 0.035;
        }

        if (p.alpha > 0.02 && p.y < h + 30) {
          nextParticles.push(p);

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(1, Math.cos(p.flipPhase));
          ctx.fillStyle = p.color;

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size * 0.5, -p.size * 0.3, p.size, p.size * 0.6);
          }
          ctx.restore();
        }
      }

      particlesRef.current = nextParticles;
      if (nextParticles.length > 0) {
        rafRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, w, h);
        rafRef.current = null;
      }
    };

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(render);
    }
  }, [burstKey, intensity, disabled]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      aria-hidden="true"
    />
  );
};

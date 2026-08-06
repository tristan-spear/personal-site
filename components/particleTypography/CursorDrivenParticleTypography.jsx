'use client';

import { useEffect, useRef } from 'react';

import './particleTypography.css';

const INTERACTION_RADIUS = 120;

class Particle {
  constructor(x, y, size, color, dispersion, returnSpd) {
    this.x = x + (Math.random() - 0.5) * 10;
    this.y = y + (Math.random() - 0.5) * 10;
    this.originX = x;
    this.originY = y;
    this.vx = (Math.random() - 0.5) * 5;
    this.vy = (Math.random() - 0.5) * 5;
    this.size = size;
    this.color = color;
    this.dispersion = dispersion;
    this.returnSpd = returnSpd;
  }

  update(mouseX, mouseY) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < INTERACTION_RADIUS && distance > 0 && mouseX !== -1000 && mouseY !== -1000) {
      const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;
      this.vx -= (dx / distance) * force * this.dispersion;
      this.vy -= (dy / distance) * force * this.dispersion;
    }

    this.vx += (this.originX - this.x) * this.returnSpd;
    this.vy += (this.originY - this.y) * this.returnSpd;

    this.vx *= 0.85;
    this.vy *= 0.85;

    const offsetX = this.x - this.originX;
    const offsetY = this.y - this.originY;
    if (Math.sqrt(offsetX * offsetX + offsetY * offsetY) < 1 && Math.random() > 0.95) {
      this.vx += (Math.random() - 0.5) * 0.2;
      this.vy += (Math.random() - 0.5) * 0.2;
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function CursorDrivenParticleTypography({
  className = '',
  text,
  fontSize = 120,
  fontWeight = 'bold',
  fontFamily = 'Inter, sans-serif',
  particleSize = 1.5,
  particleDensity = 6,
  dispersionStrength = 15,
  returnSpeed = 0.08,
  color
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId = 0;
    let particles = [];
    let mouseX = -1000;
    let mouseY = -1000;
    let width = 0;
    let height = 0;

    const init = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (!width || !height) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      const textColor = color || window.getComputedStyle(container).color || '#ffffff';

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Shrink until the word fits the container on narrow viewports
      let effectiveFontSize = Math.min(fontSize, height * 0.8);
      const maxTextWidth = width * 0.92;
      for (let i = 0; i < 24; i += 1) {
        ctx.font = `${fontWeight} ${effectiveFontSize}px ${fontFamily}`;
        if (ctx.measureText(text).width <= maxTextWidth || effectiveFontSize <= 16) break;
        effectiveFontSize *= 0.92;
      }

      ctx.fillText(text, width / 2, height / 2);

      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const step = Math.max(1, Math.floor(particleDensity * dpr));
      particles = [];

      for (let y = 0; y < pixels.height; y += step) {
        for (let x = 0; x < pixels.width; x += step) {
          const alpha = pixels.data[(y * pixels.width + x) * 4 + 3] || 0;
          if (alpha > 128) {
            particles.push(
              new Particle(
                x / dpr,
                y / dpr,
                particleSize,
                textColor,
                dispersionStrength,
                returnSpeed
              )
            );
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.update(mouseX, mouseY);
        particle.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    // The page is rendered under a CSS zoom, so viewport coordinates and the
    // canvas coordinate space differ by a scale factor that must be undone.
    const toCanvasSpace = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const scale = rect.width ? canvas.clientWidth / rect.width : 1;
      mouseX = (clientX - rect.left) * scale;
      mouseY = (clientY - rect.top) * scale;
    };

    const handleMouseMove = (event) => toCanvasSpace(event.clientX, event.clientY);

    const handleTouch = (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      toCanvasSpace(touch.clientX, touch.clientY);
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      init();
      animate();
    };

    // Wait for webfonts so particles are sampled from the final glyphs
    if (document.fonts?.ready) {
      document.fonts.ready.then(start).catch(start);
    }
    const timeoutId = setTimeout(start, 300);

    const resizeObserver = new ResizeObserver(() => {
      if (started) init();
    });
    resizeObserver.observe(container);

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchstart', handleTouch, { passive: true });
    canvas.addEventListener('touchmove', handleTouch, { passive: true });
    canvas.addEventListener('touchend', handleMouseLeave);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('touchmove', handleTouch);
      canvas.removeEventListener('touchend', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    text,
    fontSize,
    fontWeight,
    fontFamily,
    particleSize,
    particleDensity,
    dispersionStrength,
    returnSpeed,
    color
  ]);

  return (
    <div ref={containerRef} className={`particle-typography ${className}`.trim()}>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let animationId: number;

  interface Orb {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    glowIntensity: number;
    pulseSpeed: number;
    pulseOffset: number;
    opacity: number;
  }

  let orbs: Orb[] = [];
  const orbCount = 15;
  const connectionDistance = 200;

  const colors = [
    { h: 180, s: 60, l: 50 }, // Teal (primary)
    { h: 200, s: 50, l: 55 }, // Light blue
    { h: 280, s: 45, l: 60 }, // Purple
    { h: 160, s: 55, l: 48 }, // Green-teal
    { h: 220, s: 40, l: 58 }, // Blue
  ];

  function initOrbs() {
    if (!canvas) return;
    orbs = [];
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < orbCount; i++) {
      const colorData = colors[Math.floor(Math.random() * colors.length)];
      const speed = 0.2 + Math.random() * 0.3;
      const angle = Math.random() * Math.PI * 2;

      orbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 20 + Math.random() * 40,
        color: `hsl(${colorData.h}, ${colorData.s}%, ${colorData.l}%)`,
        glowIntensity: 0.15 + Math.random() * 0.1,
        pulseSpeed: 0.5 + Math.random() * 0.8,
        pulseOffset: Math.random() * Math.PI * 2,
        opacity: 0.3 + Math.random() * 0.2
      });
    }
  }

  function draw(time: number) {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connection lines between nearby orbs
    for (let i = 0; i < orbs.length; i++) {
      for (let j = i + 1; j < orbs.length; j++) {
        const dx = orbs[i].x - orbs[j].x;
        const dy = orbs[i].y - orbs[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.08;
          ctx.beginPath();
          ctx.moveTo(orbs[i].x, orbs[i].y);
          ctx.lineTo(orbs[j].x, orbs[j].y);
          ctx.strokeStyle = `hsla(180, 50%, 60%, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Update and draw orbs
    orbs.forEach(orb => {
      // Update position with drift
      orb.x += orb.vx;
      orb.y += orb.vy;

      // Bounce off edges with smooth transition
      if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
      if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
      if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
      if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;

      // Pulsing effect
      const pulse = Math.sin(time * 0.001 * orb.pulseSpeed + orb.pulseOffset);
      const currentRadius = orb.radius * (1 + pulse * 0.1);
      const currentOpacity = orb.opacity * (0.8 + pulse * 0.2);

      // Draw glow
      const gradient = ctx.createRadialGradient(
        orb.x, orb.y, 0,
        orb.x, orb.y, currentRadius * 2
      );
      gradient.addColorStop(0, orb.color.replace(')', `, ${currentOpacity * 0.6})`).replace('hsl', 'hsla'));
      gradient.addColorStop(0.5, orb.color.replace(')', `, ${currentOpacity * 0.2})`).replace('hsl', 'hsla'));
      gradient.addColorStop(1, orb.color.replace(')', ', 0)').replace('hsl', 'hsla'));

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, currentRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw core orb
      const coreGradient = ctx.createRadialGradient(
        orb.x, orb.y, 0,
        orb.x, orb.y, currentRadius
      );
      coreGradient.addColorStop(0, orb.color.replace(')', `, ${currentOpacity})`).replace('hsl', 'hsla'));
      coreGradient.addColorStop(1, orb.color.replace(')', `, ${currentOpacity * 0.3})`).replace('hsl', 'hsla'));

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    animationId = requestAnimationFrame(draw);
  }

  function handleResize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initOrbs();
  }

  onMount(() => {
    ctx = canvas.getContext('2d');
    handleResize();

    window.addEventListener('resize', handleResize);

    animationId = requestAnimationFrame(draw);
  });

  onDestroy(() => {
    if (browser) {
      if (animationId) window.cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    }
  });
</script>

<canvas
  bind:this={canvas}
  class="fixed inset-0 pointer-events-none z-0"
  aria-hidden="true"
></canvas>

<style>
  canvas {
    background: transparent;
  }
</style>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let animationId: number;
  let mouseX = -1000;
  let mouseY = -1000;

  interface Star {
    x: number;
    y: number;
    size: number;
    brightness: number;
    twinkleSpeed: number;
    twinkleOffset: number;
    layer: number; // 0 = bright, 1 = medium, 2 = dim
  }

  let stars: Star[] = [];
  const connectionRadius = 150;
  const starCount = 200;

  function initStars() {
    if (!canvas) return;
    stars = [];
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < starCount; i++) {
      // Distribute stars across layers
      const layer = i < starCount * 0.2 ? 0 : i < starCount * 0.5 ? 1 : 2;
      
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: layer === 0 ? 1.5 : 1,
        brightness: layer === 0 ? 0.9 : layer === 1 ? 0.6 : 0.35,
        twinkleSpeed: 0.5 + Math.random() * 1.5,
        twinkleOffset: Math.random() * Math.PI * 2,
        layer
      });
    }
  }

  function getStarColor(layer: number, alpha: number): string {
    // Teal-tinted colors matching the theme
    if (layer === 0) return `hsla(180, 30%, 80%, ${alpha})`;
    if (layer === 1) return `hsla(200, 20%, 60%, ${alpha})`;
    return `hsla(220, 15%, 40%, ${alpha})`;
  }

  function draw(time: number) {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connection lines first (behind stars)
    stars.forEach(star => {
      const dx = mouseX - star.x;
      const dy = mouseY - star.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionRadius) {
        const opacity = (1 - distance / connectionRadius) * 0.3;
        ctx!.beginPath();
        ctx!.moveTo(mouseX, mouseY);
        ctx!.lineTo(star.x, star.y);
        ctx!.strokeStyle = `hsla(175, 60%, 45%, ${opacity})`;
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
      }
    });

    // Draw stars
    stars.forEach(star => {
      const twinkle = Math.sin(time * 0.001 * star.twinkleSpeed + star.twinkleOffset);
      const alpha = star.brightness * (0.5 + twinkle * 0.5);
      
      ctx!.beginPath();
      ctx!.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx!.fillStyle = getStarColor(star.layer, alpha);
      ctx!.fill();
    });

    animationId = requestAnimationFrame(draw);
  }

  function handleMouseMove(e: MouseEvent) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function handleMouseLeave() {
    mouseX = -1000;
    mouseY = -1000;
  }

  function handleResize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }

  onMount(() => {
    ctx = canvas.getContext('2d');
    handleResize();
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);
    
    animationId = requestAnimationFrame(draw);
  });

  onDestroy(() => {
    if (browser) { 
        if (animationId) window.cancelAnimationFrame(animationId); 
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
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
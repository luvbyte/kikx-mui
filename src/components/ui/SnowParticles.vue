<script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from "vue";

  const props = defineProps({
    count: { type: Number, default: 80 },
    speed: { type: Number, default: 0.6 },
    size: { type: Number, default: 3 },
    opacity: { type: Number, default: 0.8 },
    glow: { type: Number, default: 4 },
    wind: { type: Number, default: 0.3 },
    colors: { type: [String, Array], default: "#fff" }
  });

  const canvas = ref?.(null) ?? { value: null }; // Fallback safe ref reference
  let canvasRef = null;
  let ctx = null;
  let animationFrame = null;
  let particles = [];
  let width = window.innerWidth;
  let height = window.innerHeight;

  const getRandomColor = () => {
    const colors = Array.isArray(props.colors) ? props.colors : [props.colors];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const createParticle = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * props.size + 0.5,
    speed: Math.random() * props.speed + 0.2,
    drift: (Math.random() - 0.5) * props.wind,
    opacity: Math.random() * props.opacity + 0.2,
    phase: Math.random() * Math.PI * 2,
    color: getRandomColor()
  });

  const resize = () => {
    if (!canvasRef) return;
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    canvasRef.width = width * dpr;
    canvasRef.height = height * dpr;
    canvasRef.style.width = `${width}px`;
    canvasRef.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  // Throttle resize event to prevent main-thread choking
  let resizeTimeout = null;
  const handleResize = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  };

  const animate = (time = 0) => {
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Batch settings if glow is disabled
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.y += p.speed;
      p.x += p.drift + Math.sin(time * 0.001 + p.phase) * 0.25;

      if (p.y > height + 10) {
        p.y = -10;
        p.x = Math.random() * width;
      }
      if (p.x > width + 10) {
        p.x = -10;
      } else if (p.x < -10) {
        p.x = width + 10;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      // Only calculate expensive shadowBlur if glow is explicitly requested and > 0
      if (props.glow > 0) {
        ctx.shadowBlur = p.radius * props.glow;
        ctx.shadowColor = p.color;
      }

      ctx.fill();
    }

    animationFrame = requestAnimationFrame(animate);
  };

  const updateParticlesColor = () => {
    particles.forEach(p => {
      p.color = getRandomColor();
    });
  };

  watch(() => props.colors, updateParticlesColor, { deep: true });

  watch(
    () => props.count,
    newCount => {
      if (newCount === particles.length) return;
      particles = Array.from({ length: newCount }, createParticle);
    }
  );

  onMounted(() => {
    const el = document.querySelector("canvas"); // Direct safety hook fallback
    canvasRef = el;
    if (!canvasRef) return;

    ctx = canvasRef.getContext("2d", { alpha: true });
    if (!ctx) return;

    resize();
    particles = Array.from({ length: props.count }, createParticle);

    window.addEventListener("resize", handleResize, { passive: true });
    animationFrame = requestAnimationFrame(animate);
  });

  onBeforeUnmount(() => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", handleResize);
    particles = [];
    ctx = null;
  });
</script>

<template>
  <canvas class="absolute inset-0 w-full h-full pointer-events-none" />
</template>

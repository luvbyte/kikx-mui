<script setup>
  import { ref, onMounted, onBeforeUnmount } from "vue";

  const props = defineProps({
    /**
     * Particle color.
     * Can be a single CSS color or an array of colors.
     */
    colors: {
      type: [String, Array],
      default: "#fff"
    },

    /**
     * Particle animation duration in milliseconds.
     */
    duration: {
      type: Number,
      default: 3000
    },

    /**
     * Glow opacity for the particle.
     */
    glowOpacity: {
      type: Number,
      default: 0.9
    },

    /**
     * Maximum number of particles allowed at once.
     */
    maxParticles: {
      type: Number,
      default: 80
    },

    /**
     * Number of particles created per tap.
     */
    particleCount: {
      type: Number,
      default: 18
    }
  });

  const showLayer = ref(false);
  const particles = ref([]);

  let particleId = 0;
  let hideTimer = null;
  let longPressTimer = null;

  // Track touch gestures to filter out swipes/drags/long presses
  let startX = 0;
  let startY = 0;
  let hasMoved = false;

  const MOVE_THRESHOLD = 10;
  const LONG_PRESS_DURATION = 500;

  const getRandomColor = () => {
    if (Array.isArray(props.colors)) {
      return props.colors[Math.floor(Math.random() * props.colors.length)];
    }

    return props.colors;
  };

  const createSprinkle = (x, y) => {
    const newParticles = [];

    for (let i = 0; i < props.particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 25 + Math.random() * 100;

      newParticles.push({
        id: ++particleId,
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed - 20,
        gravity: 50 + Math.random() * 70,
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 720,
        size: 3 + Math.random() * 5,
        shape: Math.random() > 0.4 ? "50%" : "20%",
        color: getRandomColor()
      });
    }

    // Add particles in one reactive update
    particles.value.push(...newParticles);

    // Hard limit to prevent uncontrolled growth
    if (particles.value.length > props.maxParticles) {
      particles.value = particles.value.slice(-props.maxParticles);
    }
  };

  const handlePointerDown = event => {
    if (event.pointerType !== "touch") return;

    startX = event.clientX;
    startY = event.clientY;
    hasMoved = false;

    clearTimeout(longPressTimer);

    // If the finger stays down too long, mark it as a long press
    longPressTimer = setTimeout(() => {
      hasMoved = true;
    }, LONG_PRESS_DURATION);
  };

  const handlePointerMove = event => {
    if (event.pointerType !== "touch" || hasMoved) return;

    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    // If finger moves past threshold, flag it as a swipe/drag
    if (Math.hypot(dx, dy) > MOVE_THRESHOLD) {
      hasMoved = true;
      clearTimeout(longPressTimer);
    }
  };

  const handlePointerUp = event => {
    if (event.pointerType !== "touch") return;

    clearTimeout(longPressTimer);

    // Ignore swipes, drags, and long presses
    if (hasMoved) return;

    showLayer.value = true;

    createSprinkle(startX, startY);

    // Only ONE timer for the entire effect
    clearTimeout(hideTimer);

    hideTimer = setTimeout(() => {
      showLayer.value = false;
      particles.value = [];
    }, props.duration);
  };

  onMounted(() => {
    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true
    });

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true
    });

    window.addEventListener("pointerup", handlePointerUp, {
      passive: true
    });
  });

  onBeforeUnmount(() => {
    window.removeEventListener("pointerdown", handlePointerDown);
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);

    clearTimeout(hideTimer);
    clearTimeout(longPressTimer);

    particles.value = [];
  });
</script>

<template>
  <Teleport to="body">
    <div v-if="showLayer" class="effect-layer" aria-hidden="true">
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="particle"
        :style="{
          left: `${particle.x}px`,
          top: `${particle.y}px`,
          borderRadius: particle.shape,

          '--color': particle.color,
          '--glow-opacity': glowOpacity,

          '--dx': `${particle.dx}px`,
          '--dy': `${particle.dy}px`,
          '--gravity': `${particle.gravity}px`,
          '--rotation': `${particle.rotation}deg`,
          '--spin': `${particle.spin}deg`,
          '--size': `${particle.size}px`,
          '--duration': `${duration}ms`
        }"
      />
    </div>
  </Teleport>
</template>

<style scoped>
  .effect-layer {
    position: fixed;
    inset: 0;
    z-index: 999999;
    pointer-events: none;
    overflow: hidden;

    /* Prevent unnecessary compositing work */
    contain: strict;
  }

  .particle {
    position: fixed;
    width: var(--size);
    height: var(--size);
    pointer-events: none;

    background: var(--color);

    box-shadow:
      0 0 10px
        color-mix(
          in srgb,
          var(--color) calc(var(--glow-opacity) * 100%),
          transparent
        ),
      0 0 4px var(--color);

    will-change: transform, opacity;

    animation: whiteSprinkle var(--duration) cubic-bezier(0.15, 0.85, 0.35, 1)
      forwards;
  }

  @keyframes whiteSprinkle {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.3) rotate(var(--rotation));
    }

    50% {
      opacity: 0.85;
    }

    100% {
      opacity: 0;
      transform: translate(
          calc(-50% + var(--dx)),
          calc(-50% + var(--dy) + var(--gravity))
        )
        scale(0.1) rotate(calc(var(--rotation) + var(--spin)));
    }
  }
</style>

<script setup>
  import { ref, computed, onBeforeUnmount } from "vue";
  import { getUrl, getImageUrl } from "@/kikx/config";

  const props = defineProps({
    app: {
      type: Object,
      required: true
    },
    splash: {
      type: String,
      required: true
    }
  });

  const loading = ref(true);
  const closing = ref(false);
  const loaded = ref(false);

  let closeTimer = null;

  const icon = computed(() => {
    return getImageUrl(props.app.manifest.icon);
  });

  const hasSplashImage = computed(() => {
    return !!props.app.manifest.splash;
  });

  const showSplash = computed(() => {
    return props.splash !== "hide" && loading.value;
  });

  const handleLoad = () => {
    if (loaded.value) return;

    loaded.value = true;
    closing.value = true;

    // Match this timeout exactly with the CSS transition/animation duration below (500ms)
    closeTimer = setTimeout(() => {
      loading.value = false;
      closeTimer = null;
    }, 500);
  };

  onBeforeUnmount(() => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  });
</script>

<template>
  <div class="relative flex h-full w-full flex-col overflow-hidden">
    <Transition name="splash">
      <div
        v-if="showSplash"
        class="splash-screen absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
      >
        <div class="splash-background"></div>
        <div class="splash-glow"></div>

        <div
          v-if="hasSplashImage"
          class="relative h-full w-full"
          :class="{ 'splash-image-closing': closing }"
        >
          <img
            :src="getImageUrl(app.manifest.splash)"
            alt=""
            class="splash-image"
          />
          <div class="image-overlay"></div>
        </div>

        <div
          v-else
          class="splash-content"
          :class="[`splash-${splash}`, { 'splash-content-closing': closing }]"
        >
          <div class="icon-container">
            <template v-if="splash === 'ripple'">
              <div class="ripple ripple-1"></div>
              <div class="ripple ripple-2"></div>
              <div class="ripple ripple-3"></div>

              <img
                :src="icon"
                :alt="app.name"
                class="splash-icon ripple-icon"
              />
            </template>

            <template v-else-if="splash === 'orbit'">
              <div class="orbit orbit-1">
                <span></span>
              </div>

              <div class="orbit orbit-2">
                <span></span>
              </div>

              <div class="orbit orbit-3">
                <span></span>
              </div>

              <img :src="icon" :alt="app.name" class="splash-icon orbit-icon" />
            </template>

            <template v-else>
              <img
                :src="icon"
                :alt="app.name"
                class="splash-icon static-icon"
              />
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <iframe
      :id="'app_' + app.id"
      :name="app.name"
      :title="app.title"
      :src="getUrl(app.url)"
      :sandbox="app.iframe.sandbox"
      :allowfullscreen="app.iframe.allowfullscreen"
      :allow="app.iframe.allow"
      :loading="app.iframe.loading"
      scrolling="no"
      :referrerpolicy="app.iframe.referrerpolicy"
      class="h-full w-full flex-1 transition-opacity duration-700 ease-out"
      :class="loading ? 'opacity-0' : 'opacity-100'"
      @load="handleLoad"
    ></iframe>
  </div>
</template>

<style scoped>
  .splash-screen {
    isolation: isolate;
    background: var(--fallback-b1, oklch(var(--b1)));
    will-change: opacity;
  }

  .splash-background {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      rgb(255 255 255 / 0.03),
      transparent 60%
    );
  }

  .splash-glow {
    position: absolute;
    width: 45vw;
    height: 45vw;
    max-width: 400px;
    max-height: 400px;
    min-width: 180px;
    min-height: 180px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgb(99 102 241 / 0.18),
      transparent 70%
    );
    filter: blur(30px);
    animation: backgroundGlow 5s ease-in-out infinite;
  }

  @keyframes backgroundGlow {
    0%,
    100% {
      transform: scale(0.85);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.15);
      opacity: 1;
    }
  }

  .splash-content {
    position: relative;
    z-index: 10;
    will-change: transform, opacity;
    animation: splashAppear 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes splashAppear {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    60% {
      transform: scale(1.02);
      opacity: 1;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .icon-container {
    position: relative;
    width: 32vw;
    max-width: 180px;
    min-width: 90px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .splash-icon {
    position: relative;
    z-index: 10;
    width: 72%;
    height: 72%;
    object-fit: cover;
    border-radius: 24%;
    box-shadow:
      0 20px 50px rgb(0 0 0 / 0.28),
      0 0 0 1px rgb(255 255 255 / 0.1);
  }

  .static-icon {
    animation: staticFloat 4s ease-in-out infinite;
  }

  @keyframes staticFloat {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-6px);
    }
  }

  .ripple {
    position: absolute;
    width: 65%;
    height: 65%;
    border-radius: 26%;
    border: 2px solid rgb(139 92 246 / 0.55);
    animation: ripple 2.6s cubic-bezier(0.25, 1, 0.5, 1) infinite;
  }

  .ripple-1 {
    animation-delay: 0s;
  }
  .ripple-2 {
    animation-delay: 0.9s;
  }
  .ripple-3 {
    animation-delay: 1.8s;
  }

  @keyframes ripple {
    0% {
      transform: scale(0.8);
      opacity: 0.9;
    }
    100% {
      transform: scale(2.4);
      opacity: 0;
    }
  }

  .ripple-icon {
    animation: rippleIcon 3s ease-in-out infinite;
  }

  @keyframes rippleIcon {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.04);
    }
  }

  .orbit {
    position: absolute;
    width: 105%;
    height: 105%;
    border: 1px solid rgb(139 92 246 / 0.35);
    border-radius: 50%;
  }

  .orbit span {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #8b5cf6;
    box-shadow:
      0 0 10px #8b5cf6,
      0 0 25px rgb(139 92 246 / 0.7);
  }

  .orbit-1 {
    animation: orbitRotate 3.5s linear infinite;
  }
  .orbit-1 span {
    top: -5px;
    left: 50%;
  }

  .orbit-2 {
    width: 85%;
    height: 85%;
    border-color: rgb(59 130 246 / 0.3);
    animation: orbitRotateReverse 2.8s linear infinite;
  }
  .orbit-2 span {
    right: -5px;
    top: 50%;
    background: #3b82f6;
    box-shadow:
      0 0 10px #3b82f6,
      0 0 25px rgb(59 130 246 / 0.7);
  }

  .orbit-3 {
    width: 120%;
    height: 120%;
    border-color: rgb(236 72 153 / 0.2);
    animation: orbitRotate 4.5s linear infinite;
  }
  .orbit-3 span {
    bottom: -5px;
    left: 50%;
    background: #ec4899;
    box-shadow:
      0 0 10px #ec4899,
      0 0 25px rgb(236 72 153 / 0.7);
  }

  @keyframes orbitRotate {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes orbitRotateReverse {
    to {
      transform: rotate(-360deg);
    }
  }

  .orbit-icon {
    animation: orbitIcon 3.5s ease-in-out infinite;
  }

  @keyframes orbitIcon {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  .splash-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: imageAppear 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes imageAppear {
    from {
      transform: scale(1.06);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .image-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      circle at center,
      transparent 20%,
      rgb(0 0 0 / 0.1) 100%
    );
  }

  .splash-content-closing {
    will-change: transform, opacity;
    animation: launchExit 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  }

  @keyframes launchExit {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.15);
      opacity: 0.8;
    }
    100% {
      transform: scale(2.2);
      opacity: 0;
    }
  }

  .splash-image-closing {
    will-change: transform, opacity;
    animation: imageExit 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  }

  @keyframes imageExit {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.08);
      opacity: 0;
    }
  }

  .splash-enter-active,
  .splash-leave-active {
    transition: opacity 0.5s ease;
  }

  .splash-enter-from,
  .splash-leave-to {
    opacity: 0;
  }

  @media (max-width: 640px) {
    .icon-container {
      width: 38vw;
      min-width: 90px;
    }
    .splash-icon {
      border-radius: 22%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .splash-screen *,
    .splash-screen {
      animation: none !important;
      transition: none !important;
    }
  }
</style>

<template>
  <div
    id="bg-frame"
    class="fixed inset-0 -z-10 w-full h-dvh bg-black overflow-hidden"
  >
    <Transition name="fade-scale" mode="out-in">
      <img
        v-if="currentSrc && !isVideo"
        :key="currentSrc"
        :src="currentSrc"
        class="fscreen object-cover"
      />

      <video
        v-else-if="currentSrc"
        :key="currentSrc"
        ref="videoRef"
        :src="currentSrc"
        class="fscreen object-cover transition-opacity duration-300"
        :class="{ 'opacity-100': videoReady, 'opacity-0': !videoReady }"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        :poster="blackPoster"
        @loadeddata="onLoadedData"
        @error="onVideoError"
      />
    </Transition>
  </div>
</template>

<script setup>
  import { ref, computed, watch, nextTick } from "vue";
  import { getImageUrl } from "@/kikx/config";
  import { useUIConfig } from "@/stores/kikx";

  import blackPoster from "@/assets/cover.png";

  const uiConfig = useUIConfig();

  const currentSrc = ref(null);
  const videoReady = ref(false);
  const videoRef = ref(null);

  const isVideo = computed(() =>
    /\.(mp4|webm|ogg)$/i.test(currentSrc.value || "")
  );

  async function onLoadedData() {
    videoReady.value = true;

    try {
      await videoRef.value?.play();
    } catch (err) {
      console.warn("Video play failed:", err);
    }
  }

  function onVideoError(e) {
    console.error("Background video failed:", e.target.error);
  }

  watch(
    () => uiConfig.state.bg,
    async newBg => {
      videoReady.value = false;

      if (!newBg) {
        currentSrc.value = null;
        return;
      }

      const src = getImageUrl(newBg);

      if (/\.(mp4|webm|ogg)$/i.test(src)) {
        currentSrc.value = src;

        await nextTick();

        const video = videoRef.value;

        if (video) {
          video.load();

          try {
            await video.play();
          } catch {}
        }
      } else {
        const img = new Image();

        img.onload = () => {
          currentSrc.value = src;
        };

        img.onerror = () => {
          console.error("Failed to load background image:", src);
        };

        img.src = src;
      }
    },
    { immediate: true }
  );
</script>

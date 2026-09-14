<script setup>
  import { ref } from "vue";
  import { getUrl, getImageUrl } from "@/kikx/config";

  import Loading from "@/components/Loading.vue";

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

  const icon = getImageUrl(props.app.manifest.icon);

  const handleLoad = () => {
    closing.value = true;

    // wait for animation to finish
    setTimeout(() => {
      loading.value = false;
    }, 150);
  };

  const getSandbox = () => {};
</script>

<template>
  <div class="fscreen relative flex flex-col overflow-hidden">
    <!-- Loading -->
    <div
      v-if="splash !== 'hide' && loading"
      class="absolute inset-0 flex items-center justify-center"
    >
      <!-- Splash Image -->
      <img
        v-if="app.manifest.splash"
        :class="{ 'closing-fade': closing }"
        :src="getImageUrl(app.manifest.splash)"
        class="fscreen object-cover"
      />
      <!-- Simple / Pulse Icon -->
      <div
        v-else-if="splash === 'static' || splash === 'pulse'"
        class="fscreen flex justify-center items-center"
        :class="{ closing: closing }"
      >
        <img
          class="w-1/2 aspect-square rounded-full"
          :class="{ 'loader-ring': splash === 'pulse' }"
          :src="icon"
        />
      </div>
    </div>

    <!-- IFrame -->
    <iframe
      :id="'app_' + app.id"
      :name="app.name"
      :title="app.title"
      :src="getUrl(app.url)"
      :sandbox="app.iframe.sandbox"
      :allowFullscreen="app.iframe.allowfullscreen"
      :allow="app.iframe.allow"
      :loading="app.iframe.loading"
      scrolling="no"
      :referrerPolicy="app.iframe.referrerpolicy"
      :class="[
        'flex-1 transition-opacity duration-300',
        loading ? 'opacity-0' : 'opacity-100'
      ]"
      @load="handleLoad"
    ></iframe>
  </div>
</template>

<style scoped>
  .loader-ring {
    background: conic-gradient(from 0deg, #3b82f6, #9333ea, #ec4899, #3b82f6);
    animation: loader-pulse 1.6s ease-in-out infinite;
    transition:
      transform 0.4s ease,
      opacity 0.4s ease;
  }

  @keyframes loader-pulse {
    0% {
      transform: scale(1);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.08);
      opacity: 0.6;
    }
    100% {
      transform: scale(1);
      opacity: 0.9;
    }
  }

  /* Exit animation */
  .closing {
    animation: launchZoom 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    will-change: transform, opacity;
  }

  /* Exit animation fadeOut */
  .closing-fade {
    animation: fadeOut 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    will-change: opacity;
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes launchZoom {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    70% {
      transform: scale(2.2);
      opacity: 1;
    }

    100% {
      transform: scale(4);
      opacity: 0;
    }
  }
</style>

<template>
  <div class="w-full flex flex-col overflow-hidden">
    <!-- Control Panel -->
    <div
      v-swipe="d => emit('swipe', d)"
      @click="emit('hide')"
      class="h-10 flex items-center justify-center"
    >
      <!-- App title -->
      <div
        v-if="activeApp"
        class="flex justify-center items-center gap-1 bg-black/5 border-t border-white/40 p-2 w-1/2 rounded-t-lg"
      >
        <svg
          v-if="isSudoApp"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m16 7.58l-5.5-2.4L5 7.58v3.6c0 3.5 2.33 6.74 5.5 7.74c.25-.08.49-.2.73-.3c-.15-.51-.23-1.06-.23-1.62c0-2.97 2.16-5.43 5-5.91z"
            opacity="0.3"
          />
          <path
            fill="currentColor"
            d="M17 13c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4m0 1.38c.62 0 1.12.51 1.12 1.12s-.51 1.12-1.12 1.12s-1.12-.51-1.12-1.12s.5-1.12 1.12-1.12m0 5.37c-.93 0-1.74-.46-2.24-1.17c.05-.72 1.51-1.08 2.24-1.08s2.19.36 2.24 1.08c-.5.71-1.31 1.17-2.24 1.17"
            opacity="0.3"
          />
          <circle cx="17" cy="15.5" r="1.12" fill="currentColor" />
          <path
            fill="currentColor"
            d="M18 11.09V6.27L10.5 3L3 6.27v4.91c0 4.54 3.2 8.79 7.5 9.82c.55-.13 1.08-.32 1.6-.55A5.97 5.97 0 0 0 17 23c3.31 0 6-2.69 6-6c0-2.97-2.16-5.43-5-5.91M11 17c0 .56.08 1.11.23 1.62c-.24.11-.48.22-.73.3c-3.17-1-5.5-4.24-5.5-7.74v-3.6l5.5-2.4l5.5 2.4v3.51c-2.84.48-5 2.94-5 5.91m6 4c-2.21 0-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4"
          />
          <path
            fill="currentColor"
            d="M17 17.5c-.73 0-2.19.36-2.24 1.08c.5.71 1.32 1.17 2.24 1.17s1.74-.46 2.24-1.17c-.05-.72-1.51-1.08-2.24-1.08"
          />
        </svg>
        <h1 class="opacity-80">
          {{ activeApp.manifest.title }}
        </h1>
      </div>
    </div>
    <!-- Apps Capsule -->
    <div class="px-2 pb-2 w-full flex items-center">
      <button
        @click="emit('action', 0)"
        class="w-16 h-full rounded-l-2xl bg-info glass"
      ></button>
      <!-- Middle Panel -->
      <div
        class="flex-1 h-16 border-y border-black/10 bg-white/20 shadow-lg px-2 gap-1 flex items-center whitespace-nowrap overflow-x-auto scrollbar-hide"
      >
        <div
          v-if="activeAppIndex < 0"
          class="h-full w-full flex items-center justify-center text-white opacity-60"
        >
          No active apps
        </div>
        <!-- Running apps list -->
        <div
          v-for="(app, index) in runningApps"
          :key="app.id"
          :id="'app_tab_' + app.id"
          @click.stop
          @click="emit('change', index)"
          class="animate__animated shadow-lg min-w-12 min-h-12 max-h-12 max-w-12 rounded-full border-2 overflow-hidden transition duration-300 scroll-smooth"
          :class="[
            activeAppIndex === index ? 'border-white' : 'border-white/10',
            activeAppIndex === index &&
              runningApps.length > 1 && [
                '-translate-y-1',
                getAnimation(uiConfig.state.appIconFocusAnimation)
              ]
          ]"
        >
          <img :src="getUrl(app.manifest.icon)" />
        </div>
      </div>
      <button
        @click="emit('action', 1)"
        class="w-16 h-full rounded-r-2xl bg-error glass flex items-center justify-center"
      ></button>
    </div>
  </div>
</template>

<script setup>
  import { getUrl, getAnimation } from "@/kikx/config";
  import { useUIConfig } from "@/stores/kikx";

  const uiConfig = useUIConfig();

  defineProps(["activeApp", "isSudoApp", "runningApps", "activeAppIndex"]);
  const emit = defineEmits(["swipe", "change", "hide", "action"]);
</script>

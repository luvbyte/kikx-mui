<script setup>
  import { useUIConfig } from "@/stores/kikx";
  import { VERSION } from "@/kikx/config";

  import Info from "./Info.vue";

  const uiConfig = useUIConfig();

  const emit = defineEmits(["close"]);
</script>

<template>
  <div
    @click.stop
    class="flex flex-1 flex-col overflow-hidden rounded-2xl border-2 border-white/60 shadow-2xl"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between border-b border-white/20 bg-blue-400/60 px-2 py-3"
    >
      <h1 class="font-semibold tracking-wide text-white">
        MUI
        <span class="rounded-lg bg-white/20 px-2">{{ VERSION }}</span>
      </h1>
      <button @click="emit('close')" class="btn btn-xs opacity-80">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
          />
        </svg>
      </button>
    </div>

    <Info />

    <!-- Footer -->
    <div class="border-t border-white/20 bg-blue-400/60 p-4"></div>
  </div>
</template>

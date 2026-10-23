<template>
  <div
    @click.stop="shakeIt"
    class="fixed inset-0 z-80 flex items-center justify-center bg-black/90 text-white"
  >
    <div
      @click.stop
      :class="{ shake: isShaking }"
      class="max-w-md min-w-[80%] rounded-lg border border-white/60 bg-white/20 text-white shadow-lg"
    >
      <h1 class="bg-white/30 p-2 text-lg font-semibold">Alert</h1>
      <p class="p-2">{{ message }}</p>

      <slot />

      <div class="flex justify-end gap-2 p-4">
        <button class="btn btn-sm" @click="emit('onResponse', false)">Cancel</button>

        <button class="btn btn-sm btn-success min-w-18" @click="emit('onResponse', true)">
          Yes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";

  defineProps({
    message: String,
    required: true,
  });
  const emit = defineEmits(["onResponse"]);

  const isShaking = ref(false);

  function shakeIt() {
    isShaking.value = false;

    requestAnimationFrame(() => {
      isShaking.value = true;

      setTimeout(() => {
        isShaking.value = false;
      }, 300);
    });
  }
</script>

<style scoped>
  .shake {
    animation: shake 0.3s ease-in-out;
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    20% {
      transform: translateX(-8px);
    }
    40% {
      transform: translateX(8px);
    }
    60% {
      transform: translateX(-6px);
    }
    80% {
      transform: translateX(6px);
    }
  }
</style>

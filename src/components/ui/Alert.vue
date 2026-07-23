<template>
  <div
    @click.stop="shakeIt"
    class="fixed inset-0 z-80 flex items-center justify-center bg-black/90 text-white"
  >
    <div
      @click.stop
      :class="{ shake: isShaking }"
      class="bg-white/20 text-white border border-white/60 rounded-lg shadow-lg min-w-[80%] max-w-md"
    >
      <h1 class="p-2 text-lg font-semibold bg-white/30">Alert</h1>
      <p class="p-2">{{ message }}</p>

      <div class="p-4 flex justify-end gap-2">
        <button class="btn btn-sm" @click="emit('onResponse', false)">Cancel</button>

        <button
          class="btn btn-sm btn-success min-w-18"
          @click="emit('onResponse', true)"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";

  defineProps(["message"]);

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

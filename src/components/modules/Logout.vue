<template>
  <div
    class="fscreen flex flex-col items-center justify-center transition-colors duration-1000"
    :style="{
      backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`
    }"
  >
    <div
      class="flex flex-col items-center bg-white/20 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center w-80"
    >
      <!-- Anime loading GIF -->
      <img
        src="/images/ldt2.gif"
        alt="Loading"
        class="w-32 h-32 object-contain rounded-2xl transition-transform duration-1000 select-none pointer-events-none"
        :style="{
          transform: `scale(${1 + (8 - countdown) * 0.03})`
        }"
        draggable="false"
      />

      <p class="mt-4 font-semibold text-white">Logging out...</p>

      <!-- Timer -->
      <p class="mt-4 text-lg font-medium text-white/80">
        Logging out in
        <span class="text-red-400 font-bold">{{ countdown }}</span>
        seconds
      </p>

      <!-- Buttons -->
      <div class="mt-6 flex justify-center gap-4">
        <button @click="cancelLogout" class="btn w-32">Cancel</button>

        <button @click="logoutNow" class="btn w-32 btn-secondary">
          Logout Now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from "vue";
  import { useClient } from "@/kikx";

  const client = useClient();

  const props = defineProps({
    close: {
      type: Function,
      required: true
    }
  });

  const START_SECONDS = 8;

  const countdown = ref(START_SECONDS);
  let timer = null;

  const overlayOpacity = computed(() => {
    // Starts at 30% darkness and ends at 75%
    return 0.3 + ((START_SECONDS - countdown.value) / START_SECONDS) * 0.45;
  });

  const logoutNow = async () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    await client._logout();
    location.reload();
  };

  const cancelLogout = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    props.close();
  };

  const startTimer = () => {
    timer = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--;
      } else {
        logoutNow();
      }
    }, 1000);
  };

  onMounted(() => {
    startTimer();
  });

  onBeforeUnmount(() => {
    if (timer) {
      clearInterval(timer);
    }
  });
</script>

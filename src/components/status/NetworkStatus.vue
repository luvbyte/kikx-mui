<template>
  <div class="flex items-center">
    <svg
      v-if="status === 'online'"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      stroke-width="14"
      viewBox="0 0 16 16"
    >
      <path
        fill="currentColor"
        d="M8 14a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m0-1a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1m3.189-3.64a.5.5 0 0 1-.721.692A3.4 3.4 0 0 0 8 9c-.937 0-1.813.378-2.453 1.037a.5.5 0 0 1-.717-.697A4.4 4.4 0 0 1 8 8c1.22 0 2.361.497 3.189 1.36m2.02-2.14a.5.5 0 1 1-.721.693A6.2 6.2 0 0 0 8 6a6.2 6.2 0 0 0-4.46 1.885a.5.5 0 0 1-.718-.697A7.2 7.2 0 0 1 8 5a7.2 7.2 0 0 1 5.21 2.22m2.02-2.138a.5.5 0 0 1-.721.692A9 9 0 0 0 8 3a9 9 0 0 0-6.469 2.734a.5.5 0 1 1-.717-.697A10 10 0 0 1 8 2a10 10 0 0 1 7.23 3.082"
      />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 20 20"
    >
      <path d="M0 0h20v20H0z" fill="none" />
      <path
        fill="currentColor"
        d="m19.254 17.84l-1.414 1.414l-8.234-8.234c-1.438.137-2.774 1.016-3.72 2.453L4.45 12.035c.9-1.237 2.1-2.197 3.489-2.683L5.674 7.088c-1.267.67-2.407 1.63-3.356 2.816L.896 8.482a12.9 12.9 0 0 1 3.31-2.862L.871 2.285L2.285.871zM10 4c3.611 0 6.832 1.742 9.095 4.473l-1.422 1.422c-1.89-2.357-4.53-3.814-7.428-3.892L8.363 4.12A11 11 0 0 1 10 4"
      />
      <circle cx="10" cy="15.5" r="1.5" fill="currentColor" />
    </svg>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from "vue";

  const status = ref("...");

  // Update network status text
  const updateStatus = () => {
    status.value = navigator.onLine ? "online" : "offline";
  };

  onMounted(() => {
    updateStatus();

    // Listen for online/offline events
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
  });

  onUnmounted(() => {
    window.removeEventListener("online", updateStatus);
    window.removeEventListener("offline", updateStatus);
  });
</script>

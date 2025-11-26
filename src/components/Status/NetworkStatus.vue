<template>
  <div class="flex items-center">
    <Icon v-if="status === 'online'" icon="oui:online" width="14" height="14" />
    <Icon
      v-else-if="status === 'offline'"
      icon="oui:offline"
      width="14"
      height="14"
    />
    <div v-else>{{ status }}</div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from "vue";
  import { Icon } from "@iconify/vue";

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

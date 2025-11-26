<template>
  <div>{{ batteryLevel }}%</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const batteryLevel = ref("—");
let batteryRef = null;

// Update battery percentage
const updateBattery = () => {
  if (!batteryRef) return;
  batteryLevel.value = Math.round(batteryRef.level * 100);
};

onMounted(async () => {
  if (!navigator.getBattery) {
    batteryLevel.value = "Not Supported";
    return;
  }

  batteryRef = await navigator.getBattery();
  updateBattery();

  // Attach listeners to auto-update
  batteryRef.addEventListener("levelchange", updateBattery);
});

onUnmounted(() => {
  if (!batteryRef) return;
  batteryRef.removeEventListener("levelchange", updateBattery);
});
</script>
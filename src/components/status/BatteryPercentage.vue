<template>
  <div class="flex items-center gap-1">
    <!-- Circle Style -->
    <template v-if="batteryIcon === 'circle'">
      <div class="relative flex items-center justify-center">
        <svg class="h-3.5 w-3.5 -rotate-90" viewBox="0 0 120 120">
          <!-- Background -->
          <circle cx="60" cy="60" r="54" stroke-width="14" fill="none" class="stroke-gray-200" />

          <!-- Progress -->
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke-width="14"
            fill="none"
            stroke-linecap="round"
            :class="batteryLevel < 20 ? 'stroke-red-500' : 'stroke-green-500'"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            class="transition-all duration-300"
          />
        </svg>
      </div>

      <div class="font-heading font-semibold">{{ batteryLevel }}%</div>
    </template>
    <!-- Box Style -->
    <template v-else-if="batteryIcon === 'box'">
      <div class="relative h-2.5 w-4 rounded-xs border border-gray-300">
        <!-- Battery Tip -->
        <div
          class="absolute top-1/2 -right-0.5 h-1 w-0.5 -translate-y-1/2 rounded-r-sm bg-gray-300"
        ></div>

        <!-- Fill -->
        <div
          class="h-full rounded-[1px] transition-all duration-300"
          :class="batteryLevel < 20 ? 'bg-red-500' : 'bg-green-500'"
          :style="{ width: `${batteryLevel}%` }"
        ></div>
      </div>

      <div class="font-heading font-semibold">{{ batteryLevel }}%</div>
    </template>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted } from "vue";

  const props = defineProps({
    batteryIcon: {
      type: String,
      required: true,
    },
  });

  const batteryLevel = ref(0);
  let batteryRef = null;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  const dashOffset = computed(() => circumference - (batteryLevel.value / 100) * circumference);

  const batteryColor = computed(() => {
    if (batteryLevel.value <= 20) return "stroke-red-500 bg-red-500";
    if (batteryLevel.value <= 50) return "stroke-yellow-500 bg-yellow-500";
    return "stroke-green-500 bg-green-500";
  });

  const updateBattery = () => {
    if (!batteryRef) return;
    batteryLevel.value = Math.round(batteryRef.level * 100);
  };

  onMounted(async () => {
    if (!navigator.getBattery) return;

    batteryRef = await navigator.getBattery();
    updateBattery();

    batteryRef.addEventListener("levelchange", updateBattery);
  });

  onUnmounted(() => {
    batteryRef?.removeEventListener("levelchange", updateBattery);
  });
</script>

<script setup lang="ts">
  import Clock from "./Clock.vue";
  import BatteryPercentage from "./BatteryPercentage.vue";
  import NetworkStatus from "./NetworkStatus.vue";

  defineProps(["onStatusbarSwipe", "isSudoApp"]);
</script>

<template>
  <div
    class="h-8 bg-black/60 w-full flex justify-between items-center text-xs text-white px-2"
    v-swipe="onStatusbarSwipe"
  >
    <!-- left notify panel -->
    <div class="flex items-center gap-1">
      <Clock />
    </div>
    <!-- right icons panel -->
    <div class="flex items-center gap-1">
      <div v-if="isSudoApp">ᥫ᭡</div>
      <NetworkStatus />
      <BatteryPercentage />
    </div>
  </div>
</template>

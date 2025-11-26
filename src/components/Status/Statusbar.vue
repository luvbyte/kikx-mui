<script setup lang="ts">
  import Clock from "./Clock.vue";
  import BatteryPercentage from "./BatteryPercentage.vue";
  import NetworkStatus from "./NetworkStatus.vue";
</script>

<template>
  <!-- left notify panel -->
  <div class="flex items-center gap-1">
    <Clock />
  </div>
  <!-- right icons panel -->
  <div class="flex items-center gap-1">
    <NetworkStatus />
    <BatteryPercentage />
  </div>
</template>

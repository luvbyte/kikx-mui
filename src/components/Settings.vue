<template>
  <div class="w-full h-full glass text-white">
    <div class="p-2 glass flex justify-between">
      <h1>UI Settings</h1>
      <Icon
        @click="uiConfig.state.showSettings = false"
        class="active:scale-105"
        icon="line-md:close"
        width="24"
        height="24"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  import { Icon } from "@iconify/vue";
  import { useUIConfig } from "@/stores/kikx";

  const uiConfig = useUIConfig();
</script>

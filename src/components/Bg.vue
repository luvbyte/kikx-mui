<template>
  <div id="bg-frame" class="fixed h-dvh w-full inset-0 -z-10 shrink-0 bg-black">
    <Transition name="fade-scale" mode="out-in">
      <img
        v-if="currentSrc"
        :key="currentSrc"
        class="fscreen object-cover"
        :src="currentSrc"
      />
    </Transition>
  </div>
</template>

<script setup>
  import { ref, watch } from "vue";
  import { getImageUrl } from "@/kikx/config";
  import { useUIConfig } from "@/stores/kikx";

  const uiConfig = useUIConfig();

  const currentSrc = ref(null);

  watch(
    () => uiConfig.state.bg,
    newBg => {
      if (!newBg) return;

      const newSrc = getImageUrl(newBg);
      const img = new Image();

      img.onload = () => {
        currentSrc.value = newSrc;
      };

      img.src = newSrc;
    },
    { immediate: true }
  );
</script>

<script setup>
  import { computed } from "vue";
  import { getImageUrl } from "@/kikx/config";

  const props = defineProps({
    title: String,
    icon: String,
    iconStyle: {
      type: String,
      default: "solid" // solid | wrap | icon 
    }
  });

  const icon = computed(() => getImageUrl(props.icon));

  const containerClass = computed(() => {
    switch (props.iconStyle) {
      case "wrap":
        return "w-12 h-12";
      default:
        return "w-16 h-16";
    }
  });

  const imageClass = computed(() => {
    switch (props.iconStyle) {
      case "wrap":
        return "fscreen rounded-xl object-cover";
      default:
        return "fscreen rounded-lg object-contain";
    }
  });
</script>

<template>
  <div
    :class="[
      'min-w-22 aspect-square flex flex-col items-center justify-center p-1 py-2 rounded-lg transition-colors duration-100',
      iconStyle === 'wrap' &&
        'bg-white/30 border-2 border-white/30 active:bg-white/60'
    ]"
  >
    <div :class="[containerClass, 'flex items-center justify-center']">
      <img :src="icon" :class="imageClass" draggable="false" />
    </div>

    <div
      v-if="iconStyle !== 'icon'"
      class="mt-auto w-full truncate pt-1 text-center text-sm text-white font-heading"
    >
      {{ title }}
    </div>
  </div>
</template>

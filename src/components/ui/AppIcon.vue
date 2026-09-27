<script setup>
  import { computed } from "vue";
  import { getImageUrl } from "@/kikx/config";

  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    iconStyle: {
      type: String,
      required: true
    }
  });

  const icon = computed(() => getImageUrl(props.icon));

  // Removed the rigid fixed 12 (w-12 h-12) to allow better fluid scaling
  const containerClass = computed(() => {
    switch (props.iconStyle) {
      case "wrap":
        return "w-12 h-12 min-w-[3rem]"; // Flexible/min-size constraint
      default:
        return "w-16 h-16 min-w-[4rem]";
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
      'min-w-[5.5rem] flex-shrink-0 flex flex-col items-center justify-between p-1.5 py-2 rounded-lg transition-colors duration-100',
      iconStyle === 'wrap' &&
        'bg-white/30 border-2 border-white/30 active:bg-white/60'
    ]"
  >
    <!-- Icon Container -->
    <div
      :class="[
        containerClass,
        'flex items-center justify-center flex-shrink-0'
      ]"
    >
      <img :src="icon" :class="imageClass" draggable="false" />
    </div>

    <!-- Title -->
    <div
      v-if="iconStyle !== 'icon'"
      class="w-full truncate pt-1 text-center text-sm text-white font-heading"
    >
      {{ title }}
    </div>
  </div>
</template>

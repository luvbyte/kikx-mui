<script setup>
  import { ref } from "vue";

  defineProps({
    src: {
      type: String,
      required: true
    }
  });

  const loaded = ref(false);
</script>

<template>
  <img
    class="transition-opacity duration-300 ease-out"
    :class="loaded ? 'opacity-100' : 'opacity-0'"
    :src="src"
    @load="loaded = true"
    draggable="false"
  />
</template>

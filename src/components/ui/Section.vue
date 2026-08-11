<template>
  <div>
    <!-- Section Title -->
    <div class="bg-orange-400/60 p-2 font-heading">
      {{ label }}
    </div>
    <!-- Section Body -->
    <div class="flex flex-col gap-2 bg-white/10 p-2">
      <slot />
    </div>
  </div>
</template>

<script setup>
  defineProps({
    label: {
      type: String,
      required: true
    }
  });
</script>

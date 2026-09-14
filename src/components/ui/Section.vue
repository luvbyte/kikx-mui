<template>
  <div>
    <!-- Section heading -->
    <div v-if="label || description" class="p-2 bg-orange-400/40">
      <h3 v-if="label" class="text-base font-heading text-white">
        {{ label }}
      </h3>

      <p v-if="description" class="mt-1 text-xs text-white/50">
        {{ description }}
      </p>
    </div>

    <!-- Section Body -->
    <div class="flex flex-col gap-2 p-2">
      <slot />
    </div>
  </div>
</template>

<script setup>
  defineProps({
    label: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    }
  });
</script>

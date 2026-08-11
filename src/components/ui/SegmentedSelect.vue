<script setup>
  defineProps({
    label: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    modelValue: {
      type: [String, Number],
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  });

  const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Title -->
    <div v-if="label || description">
      <label v-if="label" class="block text-sm text-white font-heading">
        {{ label }}
      </label>

      <p v-if="description" class="text-xs text-white/60">
        {{ description }}
      </p>
    </div>

    <!-- Segmented Buttons -->
    <div class="flex overflow-hidden rounded-md border border-white/20">
      <button
        v-for="option in options"
        :key="option.value"
        @click="emit('update:modelValue', option.value)"
        :class="[
          'flex-1 px-3 py-2 text-sm transition',
          modelValue === option.value ? 'bg-green-400/60' : 'bg-transparent'
        ]"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

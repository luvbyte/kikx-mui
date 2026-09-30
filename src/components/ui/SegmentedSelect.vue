<script setup>
  defineProps({
    label: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
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
  <div class="flex flex-col gap-2.5">
    <!-- Label / Description -->
    <div v-if="label || description" class="space-y-1">
      <label v-if="label" class="block text-sm font-medium text-white">
        {{ label }}
      </label>

      <p v-if="description" class="text-xs leading-relaxed text-white/50">
        {{ description }}
      </p>
    </div>

    <!-- Segmented Control -->
    <div
      class="flex gap-1 rounded-lg border border-white/10 bg-white/[0.04] p-1 shadow-inner shadow-black/10"
      role="group"
      :aria-label="label"
    >
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        :aria-pressed="modelValue === option.value"
        @click="emit('update:modelValue', option.value)"
        :class="[
          'relative flex-1 rounded-md px-3 py-2 text-sm font-medium',
          'transition-all duration-200 ease-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/70 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
          modelValue === option.value
            ? 'bg-green-400/40 shadow-sm shadow-green-400/20'
            : 'text-white/60 hover:bg-white/[0.07] hover:text-white'
        ]"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

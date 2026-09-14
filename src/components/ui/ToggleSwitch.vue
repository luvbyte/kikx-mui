<script setup>
  defineProps({
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      required: false
    }
  });

  const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <label
      class="group flex cursor-pointer select-none items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.06]"
    >
      <div class="min-w-0">
        <span class="block text-sm font-medium text-white">
          {{ label }}
        </span>

        <p
          v-if="description"
          class="mt-0.5 text-xs leading-relaxed text-white/50"
        >
          {{ description }}
        </p>
      </div>

      <!-- Toggle -->
      <button
        type="button"
        role="switch"
        :aria-checked="modelValue"
        :aria-label="label"
        @click="emit('update:modelValue', !modelValue)"
        :class="[
          'relative h-6 w-11 shrink-0 rounded-full p-0.5',
          'border transition-all duration-200 ease-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/70',
          modelValue
            ? 'border-green-300/40 bg-green-400/80'
            : 'border-white/10 bg-white/10'
        ]"
      >
        <span
          :class="[
            'block h-5 w-5 rounded-full shadow-sm',
            'transition-transform duration-200 ease-out',
            modelValue ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white/50'
          ]"
        />
      </button>
    </label>
  </div>
</template>

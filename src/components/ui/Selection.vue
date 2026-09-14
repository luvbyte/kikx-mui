<script setup>
  defineProps({
    label: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    modelValue: {
      type: [String, Number],
      default: ""
    },

    options: {
      type: Array,
      required: true
      // Example:
      // [
      //   { label: "Fade In", value: "fadeIn" },
      //   { label: "Slide In", value: "slideIn" }
      // ]
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

    <!-- Selection Options -->
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        @click="emit('update:modelValue', option.value)"
        :class="[
          'rounded-md border px-3 py-2 text-left text-sm transition',
          modelValue === option.value
            ? 'border-green-400/60 bg-green-400/20 text-green-300'
            : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
        ]"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

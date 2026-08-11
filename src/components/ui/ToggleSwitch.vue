<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["update:modelValue"])
</script>

<template>
  <label
    class="flex cursor-pointer select-none items-center justify-between gap-2 rounded bg-white/10 px-2 py-2"
  >
    <span class="text-sm font-semibold text-white">
      {{ label }}
    </span>

    <input
      :checked="modelValue"
      type="checkbox"
      class="toggle pointer-events-none bg-transparent"
      :class="modelValue ? 'text-white' : 'text-white/20'"
      @change="emit('update:modelValue', $event.target.checked)"
    />
  </label>
</template>
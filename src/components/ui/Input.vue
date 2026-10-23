<script setup>
  defineProps({
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: false,
    },
    modelValue: {
      type: [String, Number],
      required: true,
    },
  });

  const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Title -->
    <div>
      <label class="font-heading block text-sm text-white">
        {{ label }}
      </label>

      <p v-if="description" class="text-xs text-white/60">
        {{ description }}
      </p>
    </div>

    <input
      type="text"
      :value="modelValue"
      class="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white transition outline-none placeholder:text-white/30 focus:border-green-400/60 focus:ring-1 focus:ring-green-400/30 disabled:cursor-not-allowed disabled:opacity-50"
      :placeholder="placeholder"
      @change="emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

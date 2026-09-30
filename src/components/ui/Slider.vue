<script setup>
  defineProps({
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      required: false
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 20
    },
    step: {
      type: Number,
      default: 1
    },
    unit: {
      type: String,
      default: ""
    }
  });

  const emit = defineEmits(["update:modelValue"]);

  function updateValue(event) {
    emit("update:modelValue", Number(event.target.value));
  }
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <div
      class="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.06]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between gap-4">
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

        <span
          class="shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-white/70"
        >
          {{ modelValue }}{{ unit }}
        </span>
      </div>

      <!-- Slider -->
      <div class="mt-3">
        <input
          type="range"
          :value="modelValue"
          :min="min"
          :max="max"
          :step="step"
          :aria-label="label"
          @input="updateValue"
          class="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/50"
        />

        <div class="mt-1.5 flex justify-between text-[10px] text-white/30">
          <span>{{ min }}{{ unit }}</span>
          <span>{{ max }}{{ unit }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

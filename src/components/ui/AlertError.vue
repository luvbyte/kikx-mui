<template>
  <div
    @click="emit('close')"
    class="fixed inset-0 z-80 flex items-center justify-center p-4 backdrop-blur-xs"
  >
    <div
      @click.stop
      class="w-full max-w-md shadow-2xl text-white overflow-hidden"
    >
      <div
        v-if="message.title"
        class="px-5 py-3 text-sm font-semibold rounded-t-lg truncate"
        :class="classList(message.type)"
      >
        {{ message.title }}
      </div>

      <div
        class="max-h-64 overflow-y-auto px-5 py-6 border border-white/30 bg-white/10 rounded-lg rounded-t-none"
      >
        <p class="whitespace-pre-wrap break-words text-sm text-white/90">
          {{ message.message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    message: Object,
    required: true
  });

  const classList = type =>
    ({
      info: "bg-info/80 border-info-content text-info-content",
      error: "bg-error/80 text-error-content",
      warning: "bg-warning/80 text-warning-content"
    })[type] || "bg-info/80 text-info-content";

  const emit = defineEmits(["close"]);
</script>

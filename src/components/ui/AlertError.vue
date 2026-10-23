<template>
  <div
    @click="emit('close')"
    class="fixed inset-0 z-80 flex items-center justify-center p-4 backdrop-blur-xs"
  >
    <div @click.stop class="w-full max-w-md overflow-hidden text-white shadow-2xl">
      <div
        v-if="message.title"
        class="truncate rounded-t-lg px-5 py-3 text-sm font-semibold"
        :class="classList(message.type)"
      >
        {{ message.title }}
      </div>

      <div
        class="max-h-64 overflow-y-auto rounded-lg rounded-t-none border border-white/30 bg-white/10 px-5 py-6"
      >
        <p class="text-sm wrap-break-word whitespace-pre-wrap text-white/90">
          {{ message.message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    message: Object,
    required: true,
  });

  const classList = (type) =>
    ({
      info: "bg-info/80 border-info-content text-info-content",
      error: "bg-error/80 text-error-content",
      warning: "bg-warning/80 text-warning-content",
    })[type] || "bg-info/80 text-info-content";

  const emit = defineEmits(["close"]);
</script>

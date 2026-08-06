<template>
  <div
    @click="emit('close')"
    class="fixed inset-0 z-80 flex items-center justify-center bg-black/80 p-4"
  >
    <div
      @click.stop
      class="w-full max-w-md rounded-2xl border border-white/30 bg-white/15 backdrop-blur-xl shadow-2xl text-white overflow-hidden"
    >
      <div
        v-if="message.title"
        class="px-5 py-3 text-sm font-semibold border-b border-white/20"
        :class="classList()"
      >
        {{ message.title }}
      </div>

      <div class="max-h-64 overflow-y-auto px-5 py-6">
        <p class="whitespace-pre-wrap break-words text-sm text-white/90">
          {{ message.message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";

  const props = defineProps(["message"]);

  const classList = () =>
    ({
      info: "bg-info/60 text-info-content",
      error: "bg-error/60 text-error-content",
      warning: "bg-warning/60 text-warning-content"
    })[props.message.type] || "bg-info/60 text-info-content";

  const emit = defineEmits(["close"]);
</script>

<template>
  <div
    @click.self="close"
    class="fixed fscreen flex flex-col inset-0 z-[170] p-2 py-8 pb-12 gap-2"
  >
    <Transition name="slide-right" @after-leave="emit('close')">
      <div
        v-if="showTopFrame"
        class="w-full h-[200px] border rounded border-white/10 bg-white/10"
      ></div>
    </Transition>
    <Transition name="slide-left">
      <div
        v-if="showTopFrame"
        class="w-full h-[200px] border rounded border-white/10 bg-white/10"
      ></div>
    </Transition>
    <Transition name="fade">
      <div
        v-if="showTopFrame"
        class="flex-1 border rounded border-white/10 bg-white/10"
      ></div>
    </Transition>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";

  const showTopFrame = ref(false);

  const emit = defineEmits(["close"]);

  onMounted(() => {
    setTimeout(() => {
      showTopFrame.value = true;
    }, 100);
  });

  const close = () => {
    showTopFrame.value = false;
  };
</script>

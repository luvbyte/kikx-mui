<template>
  <div
    @click.self="close"
    class="fixed z-20 inset-0 fscreen flex flex-col justify-between"
  >
    <Transition name="slide-down">
      <div v-if="loaded" class="bg-black/40 h-32"></div>
    </Transition>

    <Transition name="slide-up">
      <div
        v-if="loaded"
        class="bg-black/40 h-64 flex gap-2 p-2 overflow-x-auto"
      >
        <img src="/images/bg.jpg" class="rounded" />
        <img src="/images/bg.jpg" />
        <img src="/images/bg.jpg" />
        <img src="/images/bg.jpg" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  defineProps(["close"]);

  const loaded = ref(false);

  onMounted(() => {
    setTimeout(() => {
      loaded.value = true;
    }, 300);
  });
</script>

<template>
  <div>
    <Transition name="fade">
      <img
        v-if="imageUrl"
        class="aspect-square object-contain rounded"
        :src="imageUrl"
      />
    </Transition>
  </div>
</template>

<script setup>
  import { ref, onBeforeMount, onUnmounted } from "vue";
  import { getFS } from "@/kikx";

  const fs = getFS();

  const props = defineProps({
    path: {
      type: String,
      required: true
    }
  });

  const imageUrl = ref("");

  onBeforeMount(async () => {
    const { data, error } = await fs.readFile(props.path);

    if (error) {
      console.error(error);
      return;
    }

    imageUrl.value = URL.createObjectURL(data);
  });

  onUnmounted(() => {
    if (imageUrl.value) {
      URL.revokeObjectURL(imageUrl.value);
    }
  });
</script>

<style scoped>
  .fade-enter-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from {
    opacity: 0;
  }
</style>

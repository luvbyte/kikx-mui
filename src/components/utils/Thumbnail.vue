<template>
  <div class="overflow-hidden aspect-square rounded object-cover">
    <img
      v-if="imageUrl"
      :src="imageUrl"
      class="fscreen object-cover transition-opacity duration-300 ease-out"
      :class="loading ? 'opacity-0' : 'opacity-100'"
      @load="loading = false"
      @error="loading = false"
    />
  </div>
</template>

<script setup>
  import { ref, onBeforeMount, onUnmounted } from "vue";
  import { getFS } from "@/kikx";
  
  const fs = getFS()

  const props = defineProps({
    path: {
      type: String,
      required: true
    }
  });

  const imageUrl = ref("");
  const loading = ref(true);

  onBeforeMount(async () => {
    try {
      const { error, data } = await fs.thumbnail(props.path);

      if (error) {
        console.error(error);
        loading.value = false;
        return;
      }

      const blob = data instanceof Blob ? data : new Blob([data]);

      imageUrl.value = URL.createObjectURL(blob);
    } catch (error) {
      console.error(error);
      loading.value = false;
    }
  });

  onUnmounted(() => {
    if (imageUrl.value) {
      URL.revokeObjectURL(imageUrl.value);
    }
  });
</script>

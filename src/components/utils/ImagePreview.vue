<template>
  <div>
    <img
      v-if="imageUrl"
      class="aspect-square object-contain rounded fade-in"
      :src="imageUrl"
      alt=""
    />
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

    const url = URL.createObjectURL(data);

    // Wait until the browser completely decodes the image
    const image = new Image();

    image.onload = async () => {
      try {
        if (image.decode) {
          await image.decode();
        }

        imageUrl.value = url;
      } catch (error) {
        console.error("Image decode failed:", error);
        URL.revokeObjectURL(url);
      }
    };

    image.onerror = () => {
      console.error("Failed to load image");
      URL.revokeObjectURL(url);
    };

    image.src = url;
  });

  onUnmounted(() => {
    if (imageUrl.value) {
      URL.revokeObjectURL(imageUrl.value);
    }
  });
</script>

<style scoped>
  .fade-in {
    animation: fade-in 0.3s ease;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
</style>
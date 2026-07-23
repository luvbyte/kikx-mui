<template>
  <div>
    <Loading v-if="!imageUrl" />
    <img v-else class="aspect-square object-cover rounded" :src="imageUrl" />
  </div>
</template>

<script setup>
  import Loading from "@/components/Loading.vue";
  import { ref, onBeforeMount, onUnmounted } from "vue";

  import { getFS } from "@/kikx";

  const fs = getFS();

  const props = defineProps({
    path: String
  });

  const imageUrl = ref("");

  onBeforeMount(async () => {
    const res = await fs.thumbnail(props.path);

    if (res.error) {
      console.error(err);
    }

    imageUrl.value = URL.createObjectURL(res.data);
  });

  onUnmounted(() => {
    if (imageUrl.value) {
      URL.revokeObjectURL(imageUrl.value);
    }
  });
</script>

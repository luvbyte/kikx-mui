<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { kikx, fetchAppsList } from "@/kikx";
  import { apiUrl } from "@/kikx/config";

  defineProps(["openApp"]);

  const appsList = ref([]);

  const imageURL = icon => {
    return `${apiUrl}${icon}`;
  };

  onMounted(async () => {
  appsList.value = await fetchAppsList();
  });
</script>
<template>
  <div class="grid grid-cols-4 gap-y-6 gap-x-4 p-4 place-items-center">
    <div
      @click.stop
      v-for="app in appsList"
      class="w-16 flex flex-col items-center"
      @click="openApp(app.name)"
    >
      <img class="w-12 h-12 rounded-xl" :src="imageURL(app.icon)" />
      <div class="text-white text-xs mt-1 text-center truncate w-full">
        {{ app.title }}
      </div>
    </div>
  </div>
</template>

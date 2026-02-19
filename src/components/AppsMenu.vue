<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { kikx, fetchAppsList } from "@/kikx";
  import { getImageUrl } from "@/kikx/config";

  defineProps(["openApp"]);

  const appsList = ref([]);

  onMounted(async () => {
    appsList.value = await fetchAppsList();
  });
</script>
<template>
  <div class="grid grid-cols-4 gap-y-6 gap-x-4 p-4 place-items-center">
    <div
      @click.stop
      v-for="app in appsList"
      class="w-18 flex flex-col items-center"
      v-longpress="() => openApp(app.name, true)"
      @click="openApp(app.name)"
    >
      <img
        draggable="false"
        class="w-15 h-15 rounded-xl"
        :src="getImageUrl(app.icon)"
      />
      <div class="text-white text-xs mt-1 text-center truncate w-full">
        {{ app.title }}
      </div>
    </div>
  </div>
</template>

<style>
  
</style>

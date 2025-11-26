<template>
  <div
    class="relative w-full h-full flex flex-col text-white overflow-y-auto text-xs"
  >
    <div v-if="notifications.length <= 0" class="text-center text-black p-2">
      \(-_-)/
    </div>
    <div
      v-else
      class="w-full top-0 right-0 flex justify-between items-center px-4 py-2"
    >
      <div class="text-sm">{{ notifications.length }}</div>
      <Icon
        @click="notifications.length = 0"
        class="active:scale-105"
        icon="material-symbols:clear-all"
        width="24"
        height="24"
      />
    </div>

    <div class="flex-1 flex flex-col px-4 pb-4 gap-2 overflow-y-auto">
      <div
        v-for="(ntfy, index) in notifications"
        :key="index"
        class="w-full p-2 rounded text-black flex justify-between items-center shadow"
        :class="getColor(ntfy.type)"
      >
        <div class="flex flex-col">
          <h1>{{ ntfy.title }}</h1>
          <p class="line-clamp-2">{{ ntfy.msg }}</p>
        </div>
        <div class="min-w-8">
          <Icon
            @click="closeNtfy(index)"
            icon="line-md:close"
            width="24"
            height="24"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from "@iconify/vue";

  const props = defineProps(["notifications"]);

  function closeNtfy(index) {
    props.notifications.splice(index, 1);
  }

  function getColor(type) {
    // if (type === "info") return "bg-info/90";
    if (type === "error") return "bg-error/80";
    if (type === "warning") return "bg-warning/80";

    return "bg-white/80";
  }
</script>

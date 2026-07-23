<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { fetchAppsList } from "@/kikx";

  import AppIcon from "@/components/ui/AppIcon.vue";
  import AppLaunchInfo from "@/components/AppLaunchInfo.vue";

  const props = defineProps(["uninstallApp"]);
  const emit = defineEmits(["openApp"]);

  const appsList = ref([]);
  const selected = ref(null);

  async function loadAppsList() {
    appsList.value = await fetchAppsList();
  }

  async function uninstall(name) {
    selected.value = null;
    await props.uninstallApp(name);
    await loadAppsList();
  }

  onMounted(loadAppsList);
</script>

<template>
  <div class="absolute inset-0 select-none overflow-y-auto">
    <Transition name="fade">
      <AppLaunchInfo
        v-if="selected"
        :app="selected"
        @openApp="(name, options = {}) => emit('openApp', name, options)"
        :uninstallApp="uninstall"
        @close="selected = null"
      />
    </Transition>

    <div class="flex justify-center">
      <div class="py-6 px-2 grid grid-cols-4 gap-4">
        <AppIcon
          v-for="app in appsList"
          :key="app.name"
          @click="emit('openApp', app.name)"
          v-longpress="() => (selected = app)"
          :title="app.title"
          :icon="app.icon"
          class="w-full aspect-square max-w-20 justify-self-center"
        />
      </div>
    </div>
  </div>
</template>

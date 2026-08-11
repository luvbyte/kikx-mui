<script setup>
  import { ref, onMounted } from "vue";
  import { fetchAppsList } from "@/kikx";

  import AppIcon from "@/components/ui/AppIcon.vue";
  import AppLaunchInfo from "@/components/AppLaunchInfo.vue";

  const props = defineProps([
    "openApp",
    "uninstallApp",
    "runHaptic",
    "iconsStyle"
  ]);

  const appsList = ref([]);
  const selected = ref(null);

  async function loadAppsList() {
    appsList.value = await fetchAppsList();
  }

  async function uninstall(name, keepData) {
    selected.value = null;
    await props.uninstallApp(name, keepData);
    await loadAppsList();
  }

  async function selectApp(app) {
    props.runHaptic();
    selected.value = app;
  }

  onMounted(loadAppsList);
</script>

<template>
  <div class="absolute inset-0 select-none overflow-y-auto">
    <Transition name="fade">
      <AppLaunchInfo
        v-if="selected"
        :app="selected"
        :openApp="openApp"
        :uninstallApp="uninstall"
        @close="selected = null"
      />
    </Transition>

    <div class="flex justify-center">
      <div class="py-6 px-3 grid grid-cols-4 gap-2">
        <AppIcon
          v-for="app in appsList"
          :key="app.name"
          @click="openApp(app.name)"
          v-longpress="() => selectApp(app)"
          :title="app.title"
          :icon="app.icon"
          :iconStyle="iconsStyle"
          class="w-full aspect-square max-w-20 justify-self-center"
        />
      </div>
    </div>
  </div>
</template>

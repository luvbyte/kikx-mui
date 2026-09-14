<script setup>
  import { ref, onMounted } from "vue";

  import AppIcon from "@/components/ui/AppIcon.vue";
  import AppLaunchInfo from "@/components/app/AppLaunchInfo.vue";

  const props = defineProps({
    iconsStyle: {
      type: String,
      required: true
    },
    appsList: {
      type: Array,
      required: true
    },
    runHaptic: {
      type: Function,
      required: true
    },
    openApp: {
      type: Function,
      required: true
    },
    uninstallApp: {
      type: Function,
      required: true
    }
  });

  const selected = ref(null);

  async function uninstall(name, keepData) {
    selected.value = null;
    await props.uninstallApp(name, keepData);
  }

  async function selectApp(app) {
    props.runHaptic();
    selected.value = app;
  }
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

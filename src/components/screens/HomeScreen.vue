<template>
  <div
    v-swipe="onSwipe"
    @click="showMenu = false"
    class="absolute inset-0 z-30 overflow-hidden bg-black/60 transition-opacity duration-300"
    :class="{
      'opacity-100': showMenu || opening,
      'opacity-0': !showMenu && !opening
    }"
  >
    <Transition name="fade">
      <AppsMenu
        v-if="showMenu"
        :appsList="appsList"
        :openApp="openApp"
        :uninstallApp="uninstallApp"
        :runHaptic="runHaptic"
        :iconsStyle="iconsStyle"
        class="absolute inset-0"
      />
    </Transition>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import AppsMenu from "@/components/app/AppsMenu.vue";

  const props = defineProps({
    iconsStyle: {
      type: String,
      required: true
    },
    runHaptic: {
      type: Function,
      required: true
    },
    appsList: {
      type: Array,
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
  const emit = defineEmits(["changeScreen"]);

  const showMenu = ref(false);
  const opening = ref(false);

  async function openApp(name, options = {}) {
    opening.value = true;
    await props.openApp(name, options);
    opening.value = false;
  }

  function onSwipe(direction) {
    if (showMenu.value) return;

    if (direction === "up") {
      showMenu.value = true;
    } else if (direction === "left") {
      emit("changeScreen", "control");
    } else if (direction === "right") {
      emit("changeScreen", "app-control");
    }
  }
</script>

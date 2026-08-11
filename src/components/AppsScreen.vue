<template>
  <div
    v-swipe="onSwipe"
    @click="showMenu = false"
    class="absolute inset-0 z-30 overflow-hidden"
  >
    <Transition name="fade">
      <AppsMenu
        v-if="showMenu"
        @openApp="(name, options = {}) => emit('openApp', name, options)"
        :uninstallApp="uninstallApp"
        class="absolute inset-0 bg-black/60"
      />
    </Transition>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import AppsMenu from "@/components/AppsMenu.vue";

  import AppLaunchInfo from "@/components/AppLaunchInfo.vue";

  const props = defineProps(["uninstallApp"]);
  const emit = defineEmits(["openApp", "changeScreen"]);

  const showMenu = ref(false);

  function onSwipe(direction) {
    if (direction === "up") {
      showMenu.value = true;
    } else if (direction === "left") {
      emit("changeScreen", "control");
    } else if (direction === "down") {
      // Problem when many apps
      // props.changeScreen("control");
    } else if (direction === "right") {
      emit("changeScreen", "app-control");
    }
  }
</script>

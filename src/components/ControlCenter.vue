<template>
  <div v-swipe="onSwipe" class="w-full h-full overflow-y-auto">
    <NotificationsBox
      v-if="showNotificationBox"
      :notifications="uiConfig.notifications"
    />

    <div
      v-show="!showNotificationBox"
      class="w-full grid grid-cols-5 items-start justify-items-center gap-y-4 p-4 text-white"
    >
      <button
        class="btn btn-xl btn-square"
        :class="
          !uiConfig.isSilent ? 'bg-base-200' : 'bg-base-200/40 text-black/60'
        "
        @click="uiConfig.isSilent = !uiConfig.isSilent"
      >
        <Icon icon="charm:sound-up" width="26" height="26" />
      </button>
      <button
        class="btn btn-xl btn-square"
        :class="
          uiConfig.canToast ? 'bg-base-200' : 'bg-base-200/40 text-black/60'
        "
        @click="uiConfig.canToast = !uiConfig.canToast"
      >
        <Icon icon="material-symbols:toast-outline" width="28" height="28" />
      </button>
      <button
        class="btn btn-xl btn-square"
        :class="
          uiConfig.isFullScreen ? 'bg-base-200' : 'bg-base-200/40 text-black/60'
        "
        @click="toggleFullscreen"
      >
        <Icon icon="flowbite:expand-outline" width="26" height="26" />
      </button>
      <button
        class="btn btn-xl btn-square"
        @click="uiConfig.iScreen = !uiConfig.iScreen"
        :class="
          uiConfig.iScreen ? 'bg-base-200' : 'bg-base-200/40 text-black/60'
        "
      >
        <Icon icon="meteor-icons:expand" width="26" height="26" />
      </button>
      <button
        class="btn btn-xl btn-square"
        @click="uiConfig.stickBar = !uiConfig.stickBar"
        :class="
          uiConfig.stickBar ? 'bg-base-200' : 'bg-base-200/40 text-black/60'
        "
      >
        <Icon icon="material-symbols:swipe-up-rounded" width="26" height="26" />
      </button>
      <button
        class="btn btn-xl btn-neutral btn-square"
        @click="uiConfig.showSettings = true"
      >
        <Icon icon="solar:settings-linear" width="26" height="26" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  import { Icon } from "@iconify/vue";
  import { useUIConfig } from "@/stores/kikx";

  import NotificationsBox from "@/components/NotificationsBox.vue";

  const uiConfig = useUIConfig();

  const showNotificationBox = ref(false);

  function onSwipe(direction) {
    if (direction === "left") {
      showNotificationBox.value = true;
    } else if (direction === "right") {
      showNotificationBox.value = false;
    }
  }

  function toggleFullscreen() {
    const doc = document;
    const elem = document.documentElement;

    const isFullscreen =
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement;

    if (!isFullscreen) {
      // Enter fullscreen
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        // Firefox
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        // Chrome, Safari, Opera
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        // IE/Edge
        elem.msRequestFullscreen();
      }

      uiConfig.isFullScreen = true;
    } else {
      // Exit fullscreen
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
      uiConfig.isFullScreen = false;
    }
  }
</script>

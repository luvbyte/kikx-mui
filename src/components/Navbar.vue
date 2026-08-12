<template>
  <div
    v-if="show"
    class="w-full h-10 flex items-center justify-stretch"
    :class="[
      getAppTheme(theme),
      { 'flex-row-reverse': navLayout === 'reverse' }
    ]"
  >
    <!-- Recents -->
    <button
      @click="onNavbarClick(1)"
      class="w-1/3 flex justify-center items-center p-1 active:bg-white/20 rounded-lg transition duration-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1m0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1M3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1"
        />
      </svg>
    </button>
    <!-- Home -->
    <button
      @click="onNavbarClick(0)"
      class="w-1/3 p-1 flex justify-center items-center active:bg-white/20 rounded-lg transition duration-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8"
        />
      </svg>
    </button>
    <!-- Close -->
    <button
      v-if="isKeyboardOpen"
      @click="closeKeyboard"
      class="w-1/3 p-1 flex justify-center items-center active:bg-white/20 rounded-lg transition duration-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 1024 1024"
      >
        <path
          fill="currentColor"
          d="M831.9 340.9L512 652.7L192.1 340.9a30.6 30.6 0 0 0-42.7 0a29 29 0 0 0 0 41.6l340.3 331.7a32 32 0 0 0 44.6 0l340.3-331.7a29 29 0 0 0 0-41.7a30.6 30.6 0 0 0-42.7 0z"
          stroke-width="25.5"
          stroke="currentColor"
        />
      </svg>
    </button>
    <button
      v-else
      @click="onNavbarClick(2)"
      class="w-1/3 p-1 flex justify-center items-center active:bg-white/20 rounded-lg transition duration-100"
    >
      <svg
        v-if="canGoBack"
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 24 24"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          fill="currentColor"
          d="M20 15.5a1 1 0 1 0 2 0zM3.418 12.706a1 1 0 1 0 1.911.588L4.373 13zm7.035.237a1 1 0 1 0-.348-1.97l.174.985zM4.37 13l-.985.174a1 1 0 0 0 1.159.81zm-.057-6.082a1 1 0 1 0-1.97.347l.985-.174zM12.5 7v1a7.5 7.5 0 0 1 7.5 7.5h2A9.5 9.5 0 0 0 12.5 6zm-8.127 6l.956.294A7.5 7.5 0 0 1 12.5 8V6a9.5 9.5 0 0 0-9.081 6.706zm5.906-1.042l-.174-.985l-5.909 1.042l.174.985l.174.985l5.909-1.042zM4.37 13l.985-.174l-1.042-5.908l-.985.173l-.985.174l1.042 5.909z"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import { getAppTheme } from "@/kikx/style";

  defineProps([
    "canGoBack",
    "onNavbarClick",
    "theme",
    "isKeyboardOpen",
    "closeKeyboard",
    "navLayout"
  ]);

  const show = ref(false);
  let timer = null;

  onMounted(() => {
    timer = setTimeout(() => {
      show.value = true;
    }, 300);
  });

  onBeforeUnmount(() => {
    if (timer) {
      clearTimeout(timer);
    }
  });
</script>

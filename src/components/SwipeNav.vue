<template>
  <div>
    <Transition name="swipe-handler" mode="out-in">
      <!-- Expanded / draggable handler -->
      <div
        v-if="showSwipeHandler"
        key="expanded"
        class="fixed z-[160] touch-none select-none"
        :class="
          position.left
            ? 'left-0 rounded-l-none border-l-0'
            : 'right-0 rounded-r-none border-r-0'
        "
        :style="{
          top: `calc(50% + ${position.y}px)`
        }"
        @pointerdown="startDrag"
        @pointermove="onDrag"
        @pointerup="endInteraction"
        @pointercancel="endInteraction"
      >
        <div
          class="w-12 h-26 rounded-lg bg-black/30 border border-white/60"
        ></div>
      </div>

      <!-- Collapsed handler -->
      <div
        v-else
        key="collapsed"
        class="fixed z-[160] w-4 h-26 bg-black/20 border rounded-lg border-white/60 opacity-80"
        :class="[
          position.left
            ? 'left-0 rounded-l-none border-l-0'
            : 'right-0 rounded-r-none border-r-0'
        ]"
        :style="{
          top: `calc(50% + ${position.y}px)`
        }"
        v-swipe="onAction"
        @click="showSwipeHandler = true"
      ></div>
    </Transition>
  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import { useUIConfig } from "@/stores/kikx";

  const uiConfig = useUIConfig();

  const position = uiConfig.state.swipeNavPosition;

  const showSwipeHandler = ref(false);

  const emit = defineEmits(["action"]);

  const onAction = direction => {
    emit("action", direction);
  };

  let startX = 0;
  let startY = 0;
  let initialPosY = 0;
  let isDragging = false;

  onMounted(() => {
    // Expanded handler is draggable immediately when mounted
    isDragging = true;
    initialPosY = position.y;
  });

  onBeforeUnmount(() => {
    isDragging = false;
  });

  const startDrag = e => {
    startX = e.clientX;
    startY = e.clientY;
    initialPosY = position.y;

    isDragging = true;

    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onDrag = e => {
    if (!isDragging) return;

    const deltaY = e.clientY - startY;

    position.y = initialPosY + deltaY;

    // Move to whichever side the pointer is on
    position.left = e.clientX < window.innerWidth / 2;
  };

  const endInteraction = e => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    const moveDist = Math.hypot(deltaX, deltaY);

    isDragging = false;

    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {}

    // Click → collapse
    if (moveDist <= 10) {
      showSwipeHandler.value = false;
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    const elementCenter = rect.left + rect.width / 2;
    const screenMidpoint = window.innerWidth / 2;

    if (elementCenter < screenMidpoint) {
      position.left = true;
      position.x = -rect.left;
    } else {
      position.left = false;
      position.x = 0;
    }

    // Keep handler vertically inside the screen
    const maxTop = window.innerHeight / 2 - 60;
    const minTop = -window.innerHeight / 2 + 60;

    if (position.y > maxTop) {
      position.y = maxTop;
    }

    if (position.y < minTop) {
      position.y = minTop;
    }
  };
</script>

<style scoped>
  .swipe-handler-enter-active,
  .swipe-handler-leave-active {
    transition:
      transform 0.25s ease,
      opacity 0.25s ease;
  }

  .swipe-handler-enter-from {
    opacity: 0;
    transform: scale(0.9) translateX(20px);
  }

  .swipe-handler-leave-to {
    opacity: 0;
    transform: scale(0.9) translateX(20px);
  }
</style>

<template>
  <div
    ref="handleRef"
    @pointerdown="startLongPressTimer"
    @pointermove="onDrag"
    @pointerup="endInteraction"
    @pointercancel="endInteraction"
    :style="{
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
    }"
    :class="[
      'fixed z-[160] top-1/2 rounded-lg border opacity-80 touch-none',
      isDragging
        ? 'cursor-grabbing bg-blue-400/80 border-blue-400'
        : 'cursor-pointer bg-black/20 border-white/60 ',
      position.left
        ? 'left-0 rounded-l-none border-l-0'
        : 'right-0 rounded-r-none border-r-0',
      expanded ? 'w-12 h-26' : 'w-4 h-26'
    ]"
  ></div>
</template>

<script setup>
  import { ref, computed } from "vue";

  import { useUIConfig } from "@/stores/kikx";

  const props = defineProps(["onSwipeNav"]);

  const uiConfig = useUIConfig();

  const handleRef = ref(null);
  const isDragging = ref(false);
  const expanded = ref(false);

  const position = uiConfig.state.swipeNavPosition;

  let longPressTimer = null;
  let startX = 0;
  let startY = 0;
  let initialPosY = 0;
  let hasLongPressed = false;

  // 1. Start a timer on touch/click. If held for 400ms, unlock dragging.
  const startLongPressTimer = e => {
    startX = e.clientX;
    startY = e.clientY;
    hasLongPressed = false;

    longPressTimer = setTimeout(() => {
      hasLongPressed = true;
      isDragging.value = true;
      initialPosY = position.y;
      e.target.setPointerCapture(e.pointerId);
    }, 400); // 400ms threshold for a long press
  };

  // 2. Handle movement
  const onDrag = e => {
    // If user moved significantly before the long-press triggered, cancel it (prevents trapping normal scrolls)
    if (!hasLongPressed && longPressTimer) {
      const moveDist = Math.hypot(e.clientX - startX, e.clientY - startY);
      if (moveDist > 10) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      return;
    }

    if (!isDragging.value) return;

    const deltaY = e.clientY - startY;
    position.y = initialPosY + deltaY;

    const screenMidpoint = window.innerWidth / 2;
    position.left = e.clientX < screenMidpoint;
  };

  // 3. End interaction: handle snap-to-edge OR emit regular swipe gesture if it wasn't a long press
  const endInteraction = e => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }

    // If it was NOT a long press, treat it as a quick swipe/click action
    if (!hasLongPressed) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const moveDist = Math.hypot(deltaX, deltaY);

      if (moveDist <= 10) {
        expanded.value = !expanded.value;
        emitGesture("click");
        return;
      }

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 30) emitGesture("right");
        else if (deltaX < -30) emitGesture("left");
      } else {
        if (deltaY > 30) emitGesture("down");
        else if (deltaY < -30) emitGesture("up");
      }
      return;
    }

    // Otherwise, finalize the drag and snap to the nearest edge
    isDragging.value = false;
    hasLongPressed = false;

    try {
      e.target.releasePointerCapture(e.pointerId);
    } catch (err) {}

    const rect = handleRef.value.getBoundingClientRect();
    const elementCenter = rect.left + rect.width / 2;
    const screenMidpoint = window.innerWidth / 2;

    if (elementCenter < screenMidpoint) {
      position.left = true;
      position.x = -rect.left;
    } else {
      position.left = false;
      position.x = 0;
    }

    // Boundary checks for Y axis
    const maxTop = window.innerHeight / 2 - 60;
    const minTop = -window.innerHeight / 2 + 60;
    if (position.y > maxTop) position.y = maxTop;
    if (position.y < minTop) position.y = minTop;
  };

  const emitGesture = direction => {
    props.onSwipeNav(direction);
  };
</script>

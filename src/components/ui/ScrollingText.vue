<script setup>
  import { ref, nextTick, onMounted, onBeforeUnmount, watch } from "vue";

  const props = defineProps({
    text: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      default: "h1"
    },
    speed: {
      type: Number,
      default: 60 // px/sec
    }
  });

  const container = ref(null);
  const content = ref(null);

  const style = ref({
    transform: "translateX(0)",
    transition: "none"
  });

  let timer;
  let observer;

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function loop() {
    clearTimeout(timer);

    await nextTick();
    await new Promise(requestAnimationFrame);

    if (!container.value || !content.value) return;

    // Reset
    style.value = {
      transform: "translateX(0)",
      transition: "none"
    };

    await new Promise(requestAnimationFrame);

    const distance = content.value.scrollWidth - container.value.clientWidth;

    if (distance <= 0) return;

    // Pause at start
    await sleep(1200);

    const duration = distance / props.speed;

    // Scroll to end
    style.value = {
      transform: `translateX(-${distance}px)`,
      transition: `transform ${duration}s linear`
    };

    // Wait until animation completes
    timer = setTimeout(async () => {
      // Pause at end
      await sleep(1000);

      // Jump back instantly
      style.value = {
        transform: "translateX(0)",
        transition: "none"
      };

      await new Promise(requestAnimationFrame);

      // Repeat
      timer = setTimeout(loop, 1200);
    }, duration * 1000);
  }

  onMounted(() => {
    loop();

    observer = new ResizeObserver(loop);
    observer.observe(container.value);
  });

  watch(() => props.text, loop);

  onBeforeUnmount(() => {
    clearTimeout(timer);
    observer?.disconnect();
  });
</script>

<template>
  <div ref="container" class="w-full overflow-hidden whitespace-nowrap">
    <component :is="tag" ref="content" :style="style" class="inline-block pr-4">
      {{ text }}
    </component>
  </div>
</template>

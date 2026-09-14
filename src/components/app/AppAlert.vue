<script setup>
  import { ref, computed, nextTick, onMounted } from "vue";
  import { getUrl } from "@/kikx/config";
  import { sanitizeAlert } from "@/kikx/utils";

  import TimeStampRelative from "@/components/utils/TimeStampRelative.vue";

  const props = defineProps({
    appAlert: {
      type: Object,
      required: true
    }
  });

  const emit = defineEmits(["close"]);

  const startX = ref(0);
  const offsetX = ref(0);
  const isDragging = ref(false);
  const didSwipe = ref(false);

  const startY = ref(0);
  const gestureDirection = ref(null);

  const expanded = ref(false);
  const shouldClamp = computed(() => {
    if (props.appAlert.extra.isCode) return false;

    const message = String(props.appAlert.message ?? "").replace(
      /<[^>]*>/g,
      ""
    );
    return message.length > 150;
  });

  const messageEl = ref(null);
  const messageHeight = ref("auto");

  function setCollapsedHeight() {
    messageHeight.value = "4.5rem"; // 3 × 1.5rem
  }

  async function toggleExpanded() {
    if (!messageEl.value || !shouldClamp.value) return;

    if (expanded.value) {
      // Collapse from actual height → 3 lines
      messageHeight.value = `${messageEl.value.scrollHeight}px`;

      // Force browser to register current height before changing it
      await nextTick();

      requestAnimationFrame(() => {
        messageHeight.value = "4.5rem";
      });

      expanded.value = false;
    } else {
      // Start at collapsed height
      messageHeight.value = "4.5rem";

      expanded.value = true;

      await nextTick();

      // Expand to the exact content height
      requestAnimationFrame(() => {
        messageHeight.value = `${messageEl.value.scrollHeight}px`;
      });
    }
  }

  function onTouchStart(e) {
    const touch = e.touches[0];

    startX.value = touch.clientX;
    startY.value = touch.clientY;

    offsetX.value = 0;
    isDragging.value = true;
    didSwipe.value = false;
    gestureDirection.value = null;
  }

  function onTouchMove(e) {
    if (!isDragging.value) return;

    const touch = e.touches[0];

    const diffX = touch.clientX - startX.value;
    const diffY = touch.clientY - startY.value;

    // Decide direction once movement is large enough
    if (!gestureDirection.value) {
      if (Math.abs(diffX) < 8 && Math.abs(diffY) < 8) {
        return;
      }

      gestureDirection.value =
        Math.abs(diffX) > Math.abs(diffY) ? "horizontal" : "vertical";
    }

    // Vertical gesture → completely ignore it
    if (gestureDirection.value === "vertical") {
      return;
    }

    // Horizontal gesture
    if (gestureDirection.value === "horizontal") {
      if (diffX < -5) {
        didSwipe.value = true;
        offsetX.value = diffX;
      }
    }
  }

  function onTouchEnd() {
    if (!isDragging.value) return;

    if (props.appAlert.sticky) {
      offsetX.value = 0;
      return;
    }

    if (gestureDirection.value === "horizontal" && offsetX.value < -120) {
      offsetX.value = -window.innerWidth;

      setTimeout(() => {
        emit("close", props.appAlert);
      }, 200);
    } else {
      offsetX.value = 0;
    }

    isDragging.value = false;
    gestureDirection.value = null;
  }

  function onClick(e) {
    if (didSwipe.value) {
      e.stopPropagation();
      didSwipe.value = false;
    }
  }

  onMounted(() => {
    if (shouldClamp.value) {
      messageHeight.value = "4.5rem";
    } else {
      messageHeight.value = "auto";
    }
  });
</script>

<template>
  <div
    class="touch-pan-y p-1 relative flex items-start gap-2 bg-white/20 text-white border-white/20 rounded-xl border-2 shadow-lg transition-all duration-300"
    :style="{
      transform: `translateX(${offsetX}px)`,
      transition: isDragging ? 'none' : 'transform 0.2s ease'
    }"
    @touchstart.stop="onTouchStart"
    @touchmove.stop="onTouchMove"
    @touchend.stop="onTouchEnd"
    @click="onClick"
  >
    <!-- Icon Image -->
    <div v-if="appAlert.icon" class="flex-shrink-0">
      <img
        :src="getUrl(appAlert.icon)"
        alt="alert icon"
        class="h-12 rounded-lg object-cover aspect-square border-2 border-white/20 bg-white/20"
      />
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col min-w-0 transition-all duration-600">
      <!-- Header -->
      <div class="w-full pr-2 flex items-center justify-between gap-2">
        <!---->
        <div class="py-1 flex items-center gap-1">
          <h1 class="max-w-32 font-semibold leading-tight truncate">
            {{ appAlert.title }}
          </h1>
          <div class="flex items-center justify-center">
            <!-- Success icon -->
            <svg
              v-if="appAlert.type === 'success'"
              class="text-success"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 48 48"
            >
              <defs>
                <mask id="SVG4IxzvcIZ">
                  <g
                    fill="none"
                    stroke="#fff"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                  >
                    <path
                      fill="#555555"
                      d="m24 4l5.253 3.832l6.503-.012l1.997 6.188l5.268 3.812L41 24l2.021 6.18l-5.268 3.812l-1.997 6.188l-6.503-.012L24 44l-5.253-3.832l-6.503.012l-1.997-6.188l-5.268-3.812L7 24l-2.021-6.18l5.268-3.812l1.997-6.188l6.503.012z"
                    />
                    <path d="m17 24l5 5l10-10" />
                  </g>
                </mask>
              </defs>
              <path
                fill="currentColor"
                d="M0 0h48v48H0z"
                mask="url(#SVG4IxzvcIZ)"
              />
            </svg>
            <!-- Warning icon -->
            <svg
              v-else-if="appAlert.type === 'warning'"
              class="text-warning"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M4.47 19h15.06L12 5.99zM13 18h-2v-2h2zm0-4h-2v-4h2z"
                opacity="0.3"
              />
              <path
                fill="currentColor"
                d="M1 21h22L12 2zm3.47-2L12 5.99L19.53 19zM11 16h2v2h-2zm0-6h2v4h-2z"
              />
            </svg>
            <svg
              v-else-if="appAlert.type === 'error'"
              class="text-error"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8s8-3.58 8-8s-3.58-8-8-8m1 13h-2v-2h2zm0-4h-2V7h2z"
                opacity="0.3"
              />
              <path
                fill="currentColor"
                d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8m-1-5h2v2h-2zm0-8h2v6h-2z"
              />
            </svg>
          </div>
        </div>

        <div class="flex items-center gap-1">
          <div class="badge badge-xs bg-white/40 border-white/10 text-white">
            <TimeStampRelative :timestamp="appAlert.createdAt" />
          </div>

          <button v-if="shouldClamp" type="button" @click.stop="toggleExpanded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 32 32"
              class="transition-transform opacity-60"
              :class="{ '-rotate-180': expanded }"
            >
              <path d="M0 0h32v32H0z" fill="none" />
              <path
                fill="currentColor"
                d="M8.037 11.166L14.5 22.36c.825 1.43 2.175 1.43 3 0l6.463-11.195c.826-1.43.15-2.598-1.5-2.598H9.537c-1.65 0-2.326 1.17-1.5 2.6z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Message -->
      <div class="relative">
        <div
          ref="messageEl"
          class="overflow-hidden text-sm leading-6 transition-[height] duration-300 ease-in-out"
          :style="{ height: messageHeight }"
        >
          <template v-if="appAlert.extra.isCode">
            <div v-html="sanitizeAlert(appAlert.message)"></div>
          </template>

          <template v-else>
            {{ appAlert.message }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

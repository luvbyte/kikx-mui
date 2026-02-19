<template>
  <div
    v-swipe="onTopFrameSwipe"
    @click="onTopFrameSwipe('up')"
    class="fixed z-60 fscreen inset-0 flex flex-col items-center p-2 py-4"
  >
    <div class="h-1/3 py-8 w-full flex items-center justify-center">
      <div
        @click.stop
        v-swipe-stop
        class="w-[90%] h-full border-2 border-primary-content/60 bg-white/40 rounded overflow-hidden"
      >
        <div
          class="w-full grid grid-cols-5 items-start justify-items-center gap-y-4 p-4 text-white"
        >
          <!-- Buttons -->
          <!-- Silent Button -->
          <button
            class="btn btn-xl btn-square"
            :class="
              !uiConfig.state.isSilent
                ? 'bg-base-200'
                : 'bg-base-200/40 text-black/60'
            "
            @click="uiConfig.state.isSilent = !uiConfig.state.isSilent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 16 16"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              >
                <polygon
                  points="1.75 5.75 1.75 10.25 4.25 10.25 8.25 13.25 8.25 2.75 4.25 5.75"
                />
                <path
                  d="m10.75 6.25s1 .5 1 1.75-1 1.75-1 1.75m1-6.5c2 1 3 2.5 3 4.75s-1 3.75-3 4.75"
                />
              </g>
            </svg>
          </button>

          <!-- Notify Button -->
          <button
            class="btn btn-xl btn-square"
            :class="
              uiConfig.state.canToast
                ? 'bg-base-200'
                : 'bg-base-200/40 text-black/60'
            "
            @click="uiConfig.state.canToast = !uiConfig.state.canToast"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M6 18h12v-2H6zm-1 3q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zM5 5v14z"
              />
            </svg>
          </button>

          <!-- Fullscreen Button -->
          <button
            v-if="!isAndroidWebView()"
            class="btn btn-xl btn-square"
            :class="
              uiConfig.state.isFullScreen
                ? 'bg-base-200'
                : 'bg-base-200/40 text-black/60'
            "
            @click="toggleFullscreen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 4H4m0 0v4m0-4l5 5m7-5h4m0 0v4m0-4l-5 5M8 20H4m0 0v-4m0 4l5-5m7 5h4m0 0v-4m0 4l-5-5"
              />
            </svg>
          </button>

          <!-- Iscreen Button -->
          <button
            class="btn btn-xl btn-square"
            @click="uiConfig.state.iScreen = !uiConfig.state.iScreen"
            :class="
              uiConfig.state.iScreen
                ? 'bg-base-200'
                : 'bg-base-200/40 text-black/60'
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8V3h5m8 0h5v5m0 8v5h-5m-8 0H3v-5"
              />
            </svg>
          </button>

          <!-- Stickbar Button -->
          <button
            class="btn btn-xl btn-square"
            @click="uiConfig.state.stickBar = !uiConfig.state.stickBar"
            :class="
              uiConfig.state.stickBar
                ? 'bg-base-200'
                : 'bg-base-200/40 text-black/60'
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M5.325 3.95q-.175.625-.25 1.263T5 6.5q0 1.575.45 3.038t1.3 2.762q.2.275.175.6t-.25.55t-.525.2t-.5-.3q-1.05-1.5-1.6-3.25T3.5 6.5q0-.675.075-1.35T3.8 3.8L2.575 5.025q-.225.225-.525.225t-.525-.225T1.3 4.5t.225-.525L3.8 1.7q.3-.3.7-.3t.7.3l2.275 2.275Q7.7 4.2 7.7 4.5t-.225.525t-.525.213t-.525-.213zM16.45 20.825q-.575.2-1.162.188t-1.138-.288L8.5 18.1q-.375-.175-.525-.562T8 16.775l.05-.1q.25-.5.7-.812t1-.363l1.7-.125L8.65 7.7q-.15-.4.025-.763t.575-.512t.762.025t.513.575l2.4 6.575l.95-.35l-1.025-2.825q-.15-.4.025-.763t.575-.512t.762.025t.513.575l1.025 2.825l.925-.35L16 10.35q-.15-.4.025-.762t.575-.513t.762.025t.513.575l.675 1.875l.95-.35q-.15-.4.025-.762t.575-.513t.762.025t.513.575l1.375 3.75q.575 1.575-.113 3.063T20.375 19.4z"
              />
            </svg>
          </button>

          <!-- Wallpaper Button -->
          <button
            class="btn btn-xl btn-neutral btn-square"
            @click="showModule('WallpaperChanger')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M5 21q-.825 0-1.412-.587T3 19v-5q0-.425.288-.712T4 13t.713.288T5 14v5h5q.425 0 .713.288T11 20t-.288.713T10 21zm14 0h-5q-.425 0-.712-.288T13 20t.288-.712T14 19h5v-5q0-.425.288-.712T20 13t.713.288T21 14v5q0 .825-.587 1.413T19 21m-7.75-5l2.6-3.475q.15-.2.4-.2t.4.2L17.4 16.2q.2.25.05.525T17 17H7q-.3 0-.45-.275t.05-.525l2-2.675q.15-.2.4-.2t.4.2zM3 5q0-.825.588-1.412T5 3h5q.425 0 .713.288T11 4t-.288.713T10 5H5v5q0 .425-.288.713T4 11t-.712-.288T3 10zm18 0v5q0 .425-.288.713T20 11t-.712-.288T19 10V5h-5q-.425 0-.712-.288T13 4t.288-.712T14 3h5q.825 0 1.413.588T21 5m-6.575 4.575Q14 9.15 14 8.5t.425-1.075T15.5 7t1.075.425T17 8.5t-.425 1.075T15.5 10t-1.075-.425"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  import { Icon } from "@iconify/vue";
  import { useUIConfig } from "@/stores/kikx";

  import { isAndroidWebView } from "@/kikx/utils";

  defineProps(["onTopFrameSwipe", "showModule"]);

  const uiConfig = useUIConfig();

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

      uiConfig.state.isFullScreen = true;
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
      uiConfig.state.isFullScreen = false;
    }
  }
</script>

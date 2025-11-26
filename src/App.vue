<script setup lang="ts">
  import { ref, onMounted, watch, nextTick } from "vue";

  import AppsMenu from "@/components/AppsMenu.vue";
  import Statusbar from "@/components/Status/Statusbar.vue";

  import ControlCenter from "@/components/ControlCenter.vue";
  import TopPanelWidget from "@/components/TopPanelWidget.vue";

  import App from "@/components/App.vue";

  import Settings from "@/components/Settings.vue";

  import { client } from "@/kikx";
  import { finalUrl } from "@/kikx/config";

  import { useUIConfig } from "@/stores/kikx";

  // This KUI config
  const uiConfig = useUIConfig();

  const showAppsMenu = ref(false);
  const showAppsPanel = ref(false);

  const showTopFrame = ref(false);
  const showTopFrameSub = ref(false);

  const showBottomFrame = ref(false);

  const runningApps = ref<any[]>([]);
  const activeApp = ref<number>(-1);

  function scrollTabToApp(index: number) {
    if (index < 0) return;
    if (!showBottomFrame.value) return;
    if (!runningApps.value[index]) return;

    const el = document.getElementById(
      "app_tab_" + runningApps.value[index].id
    );

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      });
    }
  }

  watch(activeApp, async indexNew => {
    await nextTick();
    scrollTabToApp(indexNew);
  });

  watch(showBottomFrame, async newValue => {
    await nextTick();
    if (newValue) scrollTabToApp(activeApp.value);
  });

  /* ----------------------------------------------------------
   Swipe handlers
  ---------------------------------------------------------- */
  function onHomeSwipe(direction: string) {
    if (direction === "up") {
      showAppsMenu.value = true;
    } else if (direction === "down") {
      showTopFrame.value = true;
    }
  }

  function onBottomFrameSwipe(direction: string) {
    if (direction === "up") {
      // activeApp.value = -1;
      showAppsPanel.value = false;
      showBottomFrame.value = false;
      showAppsMenu.value = true;
    } else if (direction === "down") {
      closeApp(activeApp.value);
    } else if (direction === "left") {
      activeApp.value = moveIndex(runningApps.value, activeApp.value, true);
    } else if (direction === "right") {
      activeApp.value = moveIndex(runningApps.value, activeApp.value, false);
    }
  }

  function onTopFrameSwipe(direction: string) {
    if (direction === "up") {
      // future actions
      if (showTopFrameSub.value) {
        showTopFrameSub.value = false;
      } else {
        showTopFrame.value = false;
      }
    } else if (direction === "down") {
      showTopFrameSub.value = true;
    }
  }

  function onStatusbarSwipe(direction: string) {
    if (direction === "right") {
      showAppsPanel.value = true;
      showBottomFrame.value = true;
      showAppsMenu.value = false;
    } else if (direction === "left") {
      showAppsMenu.value = false;
      showTopFrame.value = true;
    } else if (direction === "down") {
      showTopFrame.value = true;
    }
  }

  function onStickBarSwipe(direction) {
    if (direction === "up") {
      showTopFrame.value = false;
      showAppsMenu.value = false;
      showTopFrameSub.value = false;

      showAppsPanel.value = true;
      showBottomFrame.value = true;
    } else if (direction === "down") {
      showAppsPanel.value = false;
      showBottomFrame.value = false;
      showTopFrame.value = false;
    }
  }
  function onRightBubbleClick() {
    showTopFrame.value = false;
    showAppsMenu.value = false;
    showTopFrameSub.value = false;

    showBottomFrame.value = !showBottomFrame.value;
    showAppsPanel.value = showBottomFrame.value;
  }

  /* ----------------------------------------------------------
   Utility functions
  ---------------------------------------------------------- */
  function closeBottomFrame() {
    showBottomFrame.value = false;
    if (activeApp.value < 0) {
      showAppsPanel.value = false;
    }
  }

  function setActiveApp(index: number) {
    showAppsPanel.value = true;
    activeApp.value = index;
  }

  function moveIndex(arr: any[], index: number, next: boolean) {
    const last = arr.length - 1;
    if (last <= 0) return 0;

    return next
      ? index === last
        ? 0
        : index + 1
      : index === 0
      ? last
      : index - 1;
  }


  async function login(key: string) {
    try {
      const res = await fetch("http://localhost:8000/generate?key=" + key);
      const data = await res.json();
      document.cookie = `access_token=${data.access_token}`;
    } catch (err) {
      console.error("Login error:", err);
    }
  }

  async function openApp(name: string) {
    showAppsMenu.value = false;

    try {
      const res = await fetch(finalUrl("/open-app"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          client_id: client.clientID
        })
      });

      const data = await res.json();

      runningApps.value.push(data);
      activeApp.value = runningApps.value.length - 1;

      showAppsPanel.value = true;
    } catch (err) {
      console.error("Open app failed:", err);
    }
  }

  async function closeApp(index: number) {
    const app = runningApps.value[index];
    if (!app) return;

    runningApps.value.splice(index, 1);

    try {
      await fetch(finalUrl("/close-app"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app_id: app.id, client_id: client.clientID })
      });
    } catch (err) {
      console.error("Close app failed:", err);
    }

    // Fix active index
    if (runningApps.value.length === 0) {
      activeApp.value = -1;
    } else {
      activeApp.value = Math.min(activeApp.value, runningApps.value.length - 1);
    }
  }

  onMounted(async () => {
    await login("kikx");

    client.run(data => {
      // $toast.success("Connected");
      console.log("Client Event:", data);
    });
  });
</script>

<template>
  <div
    data-theme="light"
    class="h-dvh w-full flex flex-col overflow-hidden bg-transparent"
  >
    <div
      id="bg-frame"
      class="fixed h-dvh w-full top-0 left-0 -z-10 shrink-0 bg"
    >
      <!-- Image Type -->

      <!-- Video Type -->
    </div>
    <!-- Top statusbar -->
    <div
      v-if="!showBottomFrame && !showTopFrame && !uiConfig.iScreen"
      class="h-8 bg-black/60 w-full flex justify-between items-center text-xs text-white px-2"
      v-swipe="onStatusbarSwipe"
    >
      <Statusbar />
    </div>

    <!-- Main interactive frame -->
    <div v-swipe="onHomeSwipe" class="flex-1 relative" v-show="!showTopFrame">
      <!-- Apps menu overlay -->
      <Transition name="slide-up">
        <div
          v-if="showAppsMenu"
          @click="showAppsMenu = false"
          class="absolute w-full h-full bg-black/60 top-0 left-0 overflow-y-auto z-30 pt-4"
        >
          <AppsMenu :openApp="openApp" />
        </div>
      </Transition>

      <!-- Running Apps Stack -->
      <div
        v-show="!showTopFrame && (showAppsPanel || showBottomFrame)"
        class="absolute w-full h-full bg-black/60 top-0 left-0 z-[20] flex flex-col items-center"
      >
        <div
          class="w-full transition duration-300"
          :class="[showBottomFrame ? 'h-[85%]' : 'h-full']"
        >
          <App
            v-for="(app, index) in runningApps"
            :key="app.id"
            class="w-full h-full overflow-hidden"
            v-show="activeApp === index && activeApp !== -1"
            :app="app"
            :closeApp="() => closeApp(index)"
          />
        </div>
      </div>
    </div>

    <!-- Top / Control Center Frame -->
    <Transition name="slide-down">
      <div
        v-if="showTopFrame"
        v-swipe="onTopFrameSwipe"
        @click="onTopFrameSwipe('up')"
        class="fixed z-[60] h-full w-full top-0 left-0 flex flex-col gap-12 items-center pt-16"
      >
        <div
          @click.stop
          v-swipe-stop
          class="w-[90%] h-1/3 rounded glass backdrop-blur overflow-hidden"
        >
          <ControlCenter />
        </div>
        <Transition name="slide-down">
          <div
            v-if="showTopFrameSub"
            @click.stop
            class="w-[90%] h-1/2 rounded border-white/60 glass backdrop-blur"
          >
            <TopPanelWidget />
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Bottom Frame -->
    <Transition name="fade-scale">
      <div
        v-if="showBottomFrame"
        @click="closeBottomFrame"
        v-swipe="onBottomFrameSwipe"
        class="fixed z-[40] h-full w-full top-0 left-0 flex flex-col items-center justify-end gap-4 pb-5"
      >
        <div
          @click.stop
          v-swipe-stop
          class="w-[80%] h-16 border border-white/80 glass backdrop-blur rounded px-2 gap-2 flex items-center whitespace-nowrap overflow-x-auto scrollbar-hide"
        >
          <pre
            v-if="activeApp < 0"
            class="h-full w-full flex items-center justify-center text-white"
          >
\(°.°)/</pre
          >
          <!-- Running apps list -->
          <div
            v-for="(app, index) in runningApps"
            :key="app.id"
            :id="'app_tab_' + app.id"
            @click.stop
            @click="setActiveApp(index)"
            class="min-w-12 min-h-12 max-h-12 max-w-12 rounded-full border-3 overflow-hidden transition duration-300 scroll-smooth"
            :class="
              activeApp === index
                ? 'border-white -translate-y-1'
                : 'border-white/60'
            "
          >
            <img :src="finalUrl(app.manifest.icon)" />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Bottom bubble Triggers -->
    <div
      v-if="uiConfig.iScreen"
      class="absolute bottom-0 right-0 z-[150] bg-white/20 w-12 h-12 rounded-tl-full"
      @click="onRightBubbleClick"
    ></div>
    <!-- swipe bubble stick -->
    <Transition name="slide-left">
      <div
        v-if="uiConfig.stickBar"
        v-swipe="onStickBarSwipe"
        class="fixed right-0 z-[160] bg-purple-400/40 w-4 h-26 top-1/2 -translate-y-1/2 rounded-l-lg border border-white/60 border-r-0"
      ></div>
    </Transition>

    <!-- Settings -->
    <Transition name="fade-scale">
      <div
        v-if="uiConfig.showSettings"
        class="fixed top-0 left-0 w-full h-full z-[200]"
      >
        <Settings />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
  .bg {
    background-image: url("assets/images/bg.jpg");
    background-size: cover;
    background-repeat: no-repeat;
  }
</style>

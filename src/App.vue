<script setup>
  import {
    ref,
    toRaw,
    watch,
    computed,
    nextTick,
    onMounted,
    onBeforeMount
  } from "vue";
  import { watchDebounced } from "@vueuse/core";

  import Bg from "@/components/Bg.vue";
  import App from "@/components/app/App.vue";
  import Navbar from "@/components/Navbar.vue";
  import Loading from "@/components/Loading.vue";
  import SwipeNav from "@/components/SwipeNav.vue";
  import GhostPanel from "@/components/GhostPanel.vue";
  import AppControl from "@/components/AppControl.vue";

  import Statusbar from "@/components/status/Statusbar.vue";

  import HomeScreen from "@/components/screens/HomeScreen.vue";
  import CCScreen from "@/components/screens/CCScreen.vue";

  import Logout from "@/components/modules/Logout.vue";
  import Share from "@/components/modules/Share.vue";
  import WallpaperChanger from "@/components/modules/WallpaperChanger.vue";
  import Settings from "@/components/modules/Settings.vue";

  import AlertError from "@/components/ui/AlertError.vue";

  import TouchSprinkle from "@/components/ui/TouchSprinkle.vue";

  // import { getUrl, getAnimation } from "@/kikx/config";
  import {
    fetchAppsList,
    useClient,
    devLogin,
    muiConfig,
    postAppMessageEvent
  } from "@/kikx";

  import { playSound } from "@/kikx/sound";
  import { haptic, vibrate } from "@/kikx/vibrate";
  import { getAppTheme, hasAppTheme, getParticleColors } from "@/kikx/style";

  import { useUIConfig } from "@/stores/kikx";
  import { useErrorStore } from "@/stores/error";
  import { useAlertsStore } from "@/stores/alert";

  import { useKeyboard } from "@/composables/useKeyboard";
  import { useRunningApps } from "@/composables/useRunningApps";

  // ------------------ STATE
  const appsList = ref([]);
  // Kikx Client
  const client = useClient();

  // Stores
  const uiConfig = useUIConfig();
  const errors = useErrorStore();
  const alerts = useAlertsStore();

  // Loading, connected state
  const connecting = ref(true);
  const connected = ref(false);

  const wsopen = ref(false);

  // home, app, app-control, control
  const currentScreen = ref("home");
  const lastScreen = ref("home");

  // Active Module { name, options }
  const currentModule = ref(null);

  // hidden screens for navbar
  const appScreens = ["app-control", "app"];
  // Hide navbar in these screens
  const navbarHiddenScreens = ["app-control", "control"];

  //
  const showGhostPanel = ref(false);

  // Composables
  const {
    getAppByID,
    runningApps,
    hasRunningApps,
    activeAppIndex,
    activeApp,
    setActiveApp,
    switchAppLeft,
    switchAppRight,
    openApp,
    closeApp,
    closeAppById,
    closeAppByName
  } = useRunningApps(client, changeScreen, alerts);
  const { isKeyboardOpen, closeKeyboard } = useKeyboard();

  // ------------------ Utils
  // Change active screen
  function changeScreen(name) {
    // If screen is in home and switch app-control
    if (
      uiConfig.state.autoHideAppCSwitch &&
      currentScreen.value === "home" &&
      name === "app-control"
    ) {
      setTimeout(() => {
        if (hasRunningApps.value && currentScreen.value === "app-control") {
          changeScreen("app");
        }
      }, 1000);
    }

    lastScreen.value = currentScreen.value;
    currentScreen.value = name;
  }

  // Haptic Feedback
  function runHaptic() {
    haptic(uiConfig.state.haptic);
  }

  // Show Module
  async function showModule(name, options = null) {
    if (uiConfig.state.useModuleReplace) {
      currentModule.value = null;
      await nextTick();
    }

    // if screen is control / app-control switch to home screen
    if (["control", "app-control"].includes(currentScreen.value)) {
      // Skip on Share module
      if (name !== "Share") {
        changeScreen("home");
      }
    }
    // If module name has these switch to home screen
    if (["WallpaperChanger"].includes(name)) {
      changeScreen("home");
    }

    currentModule.value = { name, options };
  }

  // Close module and reset module options
  function closeModule() {
    currentModule.value = null;
  }

  // Scroll Tab To App
  function scrollTabToApp(index) {
    if (index < 0) return;
    if (currentScreen.value !== "app-control") return;
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

  // Navigate back
  function navigateBack() {
    if (!activeApp.value) return;

    postAppMessageEvent(activeApp.value.id, "app:navigation", "back");
  }

  const canShowNavbar = computed(
    () =>
      uiConfig.state.navbar &&
      !currentModule.value &&
      (isKeyboardOpen.value ||
        !navbarHiddenScreens.includes(currentScreen.value))
  );

  // Bottom right transparent button
  const canShowFallbackTrigger = computed(
    () =>
      !currentModule.value &&
      !uiConfig.state.navbar &&
      !uiConfig.state.swipeNav &&
      !navbarHiddenScreens.includes(currentScreen.value)
  );

  // Back navigation
  const canGoBack = computed(
    () =>
      !!activeApp.value &&
      activeApp.value.iframe.canGoBack &&
      currentScreen.value !== "home"
  );

  // ------------------ Watchers (app, screen)
  // Auto switch app if activeAppIndex change
  watch(activeAppIndex, async indexNew => {
    await nextTick();
    scrollTabToApp(indexNew);
  });

  watch(currentScreen, async newValue => {
    await nextTick();
    if (newValue === "app-control") {
      scrollTabToApp(activeAppIndex.value);
    }
  });

  // ------------------ Event Handlers
  function onAppControlSwipe(direction) {
    runHaptic();

    if (direction === "up") {
      changeScreen("home");
    }
    if (direction === "down") {
      changeScreen("app");
    } else if (direction === "left") {
      switchAppLeft();
    } else if (direction === "right") {
      switchAppRight();
    }
  }

  function onAppControlHide() {
    if (hasRunningApps.value) {
      changeScreen("app");
    } else {
      changeScreen("home");
    }
  }

  // Bottom capsule buttons
  function onAppControlAction(btnIndex) {
    if (btnIndex === 0) {
      changeScreen("control");
    } else if (btnIndex === 1) {
      runHaptic();
      closeActiveApp();
    }
  }

  function changeActiveApp(index) {
    if (activeAppIndex.value === index) {
      changeScreen("app");
    } else {
      setActiveApp(index);
    }
  }

  function onAppScreenClick() {
    if (!hasRunningApps.value) {
      changeScreen("home");
    }
  }

  function onSwipeNav(direction) {
    runHaptic();

    if (direction === "up") {
      const screen =
        currentScreen.value === "app-control"
          ? hasRunningApps.value
            ? "app"
            : "home"
          : "app-control";
      changeScreen(screen);
    } else if (direction === "down") {
      changeScreen("home");
    }
  }

  // On bottom fallback bubble click
  function onFallbackBubbleClick() {
    runHaptic();

    changeScreen("app-control");
  }

  function onControlCenterClose() {
    changeScreen(lastScreen.value);
  }

  // 0 - home, 1 - app-control, 2 close / back (depends)
  function onNavbarClick(btnIndex) {
    runHaptic();

    if (btnIndex === 0) {
      changeScreen("home");
    } else if (btnIndex === 1) {
      changeScreen("app-control");
    } else if (btnIndex === 2 && currentScreen.value !== "home") {
      if (canGoBack.value) {
        navigateBack();
      } else {
        closeActiveApp();
      }
    } else if (btnIndex === 3) {
      closeActiveApp();
    }
  }

  // ------------------ App Functions
  async function updateAppsList() {
    appsList.value = await fetchAppsList();
  }

  // if activa app is sudo
  const isSudoApp = computed(() => {
    return !!activeApp.value && appScreens.includes(currentScreen.value)
      ? activeApp.value.isSudo
      : false;
  });

  // Active app theme
  const activeAppTheme = computed(() => {
    // only show when screen is control & app-control
    return !!activeApp.value && appScreens.includes(currentScreen.value)
      ? activeApp.value.state.theme
      : "default";
  });

  // close active app if found
  function closeActiveApp() {
    if (!activeApp.value) return;
    closeApp(activeAppIndex.value);
  }

  // Uninstall App
  async function uninstallApp(name, keepData = false) {
    const { error } = await client.uninstallApp(name, keepData);

    if (error) {
      errors.raiseError(
        error.detail || "Error uninstalling app",
        "error",
        `Error uninstalling: ${name}`
      );
    }
  }

  // On app alert
  function addAlert(payload) {
    if (payload.message.length <= 0) {
      alerts.removeAlert(payload.uid);
      return;
    }

    if (uiConfig.state.blockAlerts) return;

    if (!uiConfig.state.isSilent && !payload.silent) {
      playSound("alert");
    }

    // Only toast alert if app is running (backend checks already)
    const index = runningApps.value.findIndex(app => app.id === payload.id);
    if (index !== -1) {
      alerts.addAlert(payload, uiConfig.state.hideAlert || payload.silent);
    }
  }

  // On app alert click
  function onAlertClick(alt) {
    // Remove alert
    if (!alt.sticky) {
      alerts.removeAlert(alt.uid);
    }

    const index = runningApps.value.findIndex(app => app.id === alt.id);

    if (index !== -1) {
      setActiveApp(index);
      changeScreen("app");
      // Sending signal to app
      postAppMessageEvent(alt.id, "alert:click", {
        uid: alt.uid
      });
    } else {
      changeScreen("home");
    }
  }

  // Load config state and watch for changes
  async function loadConfigAndWatch() {
    await muiConfig.load();

    watchDebounced(
      () => ({ ...uiConfig.state }),
      async () => {
        await muiConfig.save();
      },
      {
        deep: true,
        debounce: 500, // wait 500ms after last change
        maxWait: 2000 // optional: force run after 2s max
      }
    );
  }

  // Share action using app
  function shareUsingApp(name, payload) {
    openApp(name, {
      share: payload,
      sudo: false
    });
  }

  // App actions
  function onAppAction(invoker, payload) {
    const { name, options } = payload;

    // Get app info
    const app = toRaw(getAppByID(invoker.id));

    // Set Wallpaper
    if (name === "set-wallpaper") {
      const { url } = options;
      if (!url) return;

      showModule("WallpaperChanger", { url, app: app.manifest });
    }
    // Share screen
    else if (name === "share") {
      const { item } = options;
      if (!item) return;

      showModule("Share", { item, app: app.manifest });
    }
    // Theme for app
    else if (name === "set-theme") {
      const { name } = options;

      if (!hasAppTheme(name)) {
        throw new Error(`Invalid Theme: ${name}`);
      }

      getAppByID(invoker.id).state.theme = name;
    }
  }

  // Sending app lifecycle events
  watch(activeApp, (newApp, oldApp) => {
    if (oldApp?.id) {
      postAppMessageEvent(oldApp.id, "app:blur");
    }

    if (newApp?.id) {
      postAppMessageEvent(newApp.id, "app:focus");
    }
  });

  // On before mount
  onBeforeMount(async () => {
    // Dev - test login wont work in prod
    await devLogin("kikx");

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "visible") return;

      runningApps.value.forEach(app => {
        postAppMessageEvent(app.id, "CHECK_WS");
      });
    });

    window.addEventListener("client:logout", () => {
      // Logout
      client.logout();
    });

    window.addEventListener("client:back", () => {
      // Back
      runHaptic();

      if (canGoBack.value) {
        navigateBack();
      } else {
        closeActiveApp();
      }
    });

    // Event bindings
    client.on("ws:onclose", e => {
      if (e.code === 1008) {
        // unauthorized / redirect to login
        location.replace("/");
      }
      wsopen.value = false;
      connecting.value = true;
    });

    client.on("ws:onopen", e => {
      wsopen.value = true;
    });

    // Client reconnect
    client.on("reconnected", () => {
      connecting.value = false;
    });

    // App installed or updated close it
    client.on("app:installed", payload => {
      closeAppByName(payload.name);
      updateAppsList();
    });

    // App uninstalled
    client.on("app:uninstalled", payload => {
      closeAppByName(payload.name);
      updateAppsList();
    });

    // App closing by itself
    client.on("app:close", app => {
      closeAppById(app.id);
    });

    // Invoke actions from app
    client.on("app:invoke", payload => {
      // Open app from an app
      if (payload.action === "openApp") {
        openApp(payload.name, {
          args: payload.args,
          query: payload.query,
          sudo: payload.sudo
        });
      } else if (
        payload.action === "action" &&
        uiConfig.state.enableAppActions
      ) {
        try {
          onAppAction(payload.invoker, payload.payload);
        } catch (err) {
          console.log("Error on app:invoke:action:", payload, err);
        }
      }
    });

    // app alert event
    client.on("app:alert", payload => addAlert(payload));

    // run
    client.run(async () => {
      await updateAppsList();
      // load config and watch
      await loadConfigAndWatch();

      connected.value = true;
      connecting.value = false;
    });
  });
</script>

<template>
  <div
    data-theme="light"
    class="h-dvh w-full flex flex-col overflow-hidden bg-transparent"
  >
    <!-- Loading -->
    <Transition name="fade">
      <div v-if="connecting" class="fixed z-[999] inset-0 fscreen bg-black/60">
        <Loading class="text-white" label="Connecting" />
      </div>
    </Transition>

    <!-- Background layer -->
    <Bg v-if="connected" />

    <!-- Top statusbar -->
    <Transition name="statusbar-slide">
      <Statusbar
        v-if="!uiConfig.state.iScreen && !currentModule"
        :wsopen="wsopen"
        :isSudoApp="isSudoApp"
        :theme="activeAppTheme"
      />
    </Transition>

    <!-- Screens -->
    <div class="flex-1 relative">
      <!-- Home -->
      <HomeScreen
        v-show="currentScreen === 'home' && !currentModule"
        :openApp="openApp"
        :appsList="appsList"
        :uninstallApp="uninstallApp"
        :runHaptic="runHaptic"
        :iconsStyle="uiConfig.state.iconsStyle"
        @changeScreen="changeScreen"
      />

      <Transition name="fade">
        <CCScreen
          v-if="currentScreen === 'control'"
          :showModule="showModule"
          :onAlertClick="onAlertClick"
          :runHaptic="runHaptic"
          @close="onControlCenterClose"
        />
      </Transition>

      <!-- Running Apps Stack -->
      <div
        v-show="currentScreen === 'app' || currentScreen === 'app-control'"
        class="absolute fscreen inset-0 z-20 flex flex-col gap-1 items-center"
        :class="getAppTheme(activeAppTheme)"
      >
        <div
          @click.self="onAppScreenClick"
          class="w-full flex-1 overflow-hidden"
        >
          <App
            v-for="(app, index) in runningApps"
            :key="app.id"
            class="fscreen overflow-hidden"
            v-show="activeAppIndex === index && activeAppIndex !== -1"
            :app="app"
            :splash="uiConfig.state.splash"
          />
        </div>

        <!-- AppsControl -->
        <Transition name="app-control">
          <AppControl
            v-show="currentScreen === 'app-control' && !isKeyboardOpen"
            :activeApp="activeApp"
            :isSudoApp="isSudoApp"
            :runningApps="runningApps"
            :activeAppIndex="activeAppIndex"
            @swipe="onAppControlSwipe"
            @change="changeActiveApp"
            @hide="onAppControlHide"
            @action="onAppControlAction"
          />
        </Transition>
      </div>
    </div>

    <!-- Navigation Bar -->
    <Transition name="nav-slide">
      <Navbar
        v-if="canShowNavbar"
        :canGoBack="canGoBack"
        :theme="activeAppTheme"
        :isKeyboardOpen="isKeyboardOpen"
        :closeKeyboard="closeKeyboard"
        :navLayout="uiConfig.state.navLayout"
        @action="onNavbarClick"
      />
    </Transition>

    <!-- Bottom bubble Triggers (fallback) -->
    <div
      v-if="canShowFallbackTrigger"
      class="absolute bottom-0 right-0 z-[150] bg-white/5 w-12 h-12 rounded-tl-full"
      @click="onFallbackBubbleClick"
    ></div>

    <!-- Swipenav -->
    <SwipeNav
      v-if="uiConfig.state.swipeNav && !currentModule"
      @action="onSwipeNav"
    />

    <!-- Ghost panel -->
    <GhostPanel v-if="showGhostPanel" @close="showGhostPanel = false" />

    <!-- Modules -->
    <div v-if="currentModule" class="fixed fscreen inset-0 z-[99]">
      <WallpaperChanger
        v-if="currentModule.name === 'WallpaperChanger'"
        :options="currentModule.options"
        @close="closeModule"
      />
      <Share
        v-else-if="currentModule.name === 'Share'"
        :options="currentModule.options"
        @shareUsingApp="shareUsingApp"
        @close="closeModule"
      />
      <Settings
        v-else-if="currentModule.name === 'Settings'"
        :options="currentModule.options"
        @close="closeModule"
      />
      <Logout
        v-else-if="currentModule.name === 'Logout'"
        @close="closeModule"
      />
    </div>

    <!-- Global Error Alerts -->
    <Transition name="fade-scale">
      <AlertError
        v-if="errors.errorStack.length > 0"
        :message="errors.getErrorMessage()"
        @close="errors.closeError"
      />
    </Transition>

    <!-- Touch Effects -->
    <TouchSprinkle
      v-if="uiConfig.state.touchSprinkle !== 'none'"
      :colors="getParticleColors(uiConfig.state.touchSprinkle)"
      :duration="2500"
    />
  </div>
</template>

<style>
  /* ENTER — slide from right to left */
  .slide-enter-from {
    transform: translateX(100%);
    opacity: 0;
  }

  .slide-enter-to {
    transform: translateX(0);
    opacity: 1;
  }

  /* LEAVE — slide up */
  .slide-leave-from {
    transform: translateY(0);
    opacity: 1;
  }

  .slide-leave-to {
    transform: translateY(-100%);
    opacity: 0;
  }

  /* Active (shared timing) */
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s ease;
  }

  /* ENTER (slide down) */
  .statusbar-slide-enter-active {
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;
  }

  .statusbar-slide-enter-from {
    transform: translateY(-100%);
    opacity: 0;
  }

  .statusbar-slide-enter-to {
    transform: translateY(0);
    opacity: 1;
  }

  /* LEAVE (slide up) */
  .statusbar-slide-leave-active {
    transition: none;
  }

  .statusbar-slide-leave-from {
    transform: translateY(0);
    opacity: 1;
  }

  .statusbar-slide-leave-to {
    transform: translateY(-100%);
    opacity: 0;
  }

  /* ENTER (when becoming visible) */
  .nav-slide-enter-from {
    transform: translateY(100%);
    opacity: 0;
  }

  .nav-slide-enter-active {
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;
  }

  .nav-slide-enter-to {
    transform: translateY(0);
    opacity: 1;
  }

  /* LEAVE (when closing — no effect) */
  .nav-slide-leave-active {
    transition: none;
  }

  .nav-slide-leave-from,
  .nav-slide-leave-to {
    transform: translateY(0);
    opacity: 1;
  }

  .app-control-enter-active,
  .app-control-leave-active {
    transition:
      max-height 200ms linear,
      opacity 200ms ease;
    transform-origin: bottom;
  }

  .app-control-enter-from,
  .app-control-leave-to {
    max-height: 0;
    opacity: 0;
  }

  .app-control-enter-to,
  .app-control-leave-from {
    max-height: 160px;
    opacity: 1;
  }
</style>

import { ref, computed, nextTick } from "vue";

import { useErrorStore } from "@/stores/error";

import { requestOpenApp, requestCloseApp } from "@/kikx";

export function useRunningApps(client, changeScreen, alerts) {
  const runningApps = ref([]);
  const activeAppIndex = ref(-1);
  const errors = useErrorStore();

  // Prevent duplicate close requests for the same app.
  const closingApps = new Set();

  // ---------------- ACTIVE APP
  const activeApp = computed(() => {
    if (activeAppIndex.value < 0 || activeAppIndex.value >= runningApps.value.length) {
      return null;
    }

    return runningApps.value[activeAppIndex.value];
  });

  const hasRunningApps = computed(() => runningApps.value.length > 0);

  // ---------------- SET ACTIVE
  function setActiveApp(index) {
    if (index < 0 || index >= runningApps.value.length) {
      activeAppIndex.value = -1;
      return;
    }

    activeAppIndex.value = index;
  }

  // ---------------- MOVE INDEX
  function moveIndex(arr, index, next) {
    const total = arr.length;

    if (total === 0) return -1;
    if (index < 0) return 0;

    return next ? (index + 1) % total : (index - 1 + total) % total;
  }

  function switchAppLeft() {
    if (!runningApps.value.length) return;

    activeAppIndex.value = moveIndex(runningApps.value, activeAppIndex.value, true);
  }

  function switchAppRight() {
    if (!runningApps.value.length) return;

    activeAppIndex.value = moveIndex(runningApps.value, activeAppIndex.value, false);
  }

  // ---------------- GET APP
  function getAppByID(appId) {
    return runningApps.value.find((app) => app.id === appId) ?? null;
  }

  // ---------------- OPEN APP
  async function openApp(name, { sudo = false, args = [], query = {}, share = null } = {}) {
    const options = { sudo, query, args, share };

    try {
      const data = await requestOpenApp(name, options, client.clientID);

      runningApps.value.push({
        ...data,
        state: {
          theme: data.manifest.theme,
        },
      });

      setActiveApp(runningApps.value.length - 1);
      changeScreen("app");

      return {
        success: true,
        error: null,
      };
    } catch (err) {
      const error = err?.message || String(err);

      errors.raiseError(err, "error", `Error opening app: ${name}`);

      return {
        success: false,
        error,
      };
    } finally {
      await nextTick();

      if (!hasRunningApps.value) {
        changeScreen("home");
      }
    }
  }

  // ---------------- CLOSE APP
  async function closeApp(index) {
    const app = runningApps.value[index];

    if (!app || closingApps.has(app.id)) return;

    const appId = app.id;
    closingApps.add(appId);

    try {
      await requestCloseApp(appId, client.clientID);
    } catch (err) {
      errors.raiseError(err, "error", `Error closing app: ${app.manifest.name}`);
      return;
    } finally {
      closingApps.delete(appId);
    }

    // Recalculate the index because the list may have changed
    // while the close request was pending.
    const currentIndex = runningApps.value.findIndex((runningApp) => runningApp.id === appId);

    if (currentIndex === -1) return;

    // Preserve the active app when removing an app before it.
    if (currentIndex < activeAppIndex.value) {
      activeAppIndex.value--;
    } else if (currentIndex === activeAppIndex.value) {
      // Prefer the previous app when the active app is removed.
      activeAppIndex.value = Math.max(0, activeAppIndex.value - 1);
    }

    runningApps.value.splice(currentIndex, 1);

    alerts.removeAlerts(appId);

    const total = runningApps.value.length;

    if (total === 0) {
      activeAppIndex.value = -1;
      changeScreen("home");
      return;
    }

    if (activeAppIndex.value >= total) {
      activeAppIndex.value = total - 1;
    }
  }

  // ---------------- EXTERNAL APP BY ID
  function closeAppById(appId) {
    const index = runningApps.value.findIndex((app) => app.id === appId);

    if (index !== -1) {
      return closeApp(index);
    }
  }

  // ---------------- CLOSE APP BY NAME
  async function closeAppByName(appName) {
    // Capture IDs instead of indexes to avoid stale indexes.
    const appIds = runningApps.value
      .filter((app) => app.manifest.name === appName)
      .map((app) => app.id);

    // Close sequentially so array changes cannot affect later targets.
    for (const appId of appIds) {
      const index = runningApps.value.findIndex((app) => app.id === appId);

      if (index !== -1) {
        await closeApp(index);
      }
    }
  }

  return {
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
    closeAppByName,
  };
}

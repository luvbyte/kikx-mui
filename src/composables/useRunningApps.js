import { ref, computed } from "vue";
import { getUrl } from "@/kikx/config";

import { useErrorStore } from "@/stores/error";

import { requestOpenApp, requestCloseApp } from "@/kikx";

export function useRunningApps(client, uiConfig, changeScreen) {
  const runningApps = ref([]);
  const activeAppIndex = ref(-1);
  const errors = useErrorStore();

  // ---------------- ACTIVE APP
  const activeApp = computed(() => {
    if (
      activeAppIndex.value < 0 ||
      activeAppIndex.value >= runningApps.value.length
    ) {
      return null;
    }

    return runningApps.value[activeAppIndex.value];
  });

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
    activeAppIndex.value = moveIndex(
      runningApps.value,
      activeAppIndex.value,
      true
    );
  }

  function switchAppRight() {
    if (!runningApps.value.length) return;
    activeAppIndex.value = moveIndex(
      runningApps.value,
      activeAppIndex.value,
      false
    );
  }

  // ---------------- GET APP
  function getAppByID(appId) {
    return runningApps.value.find(app => app.id === appId) ?? null;
  }

  // ---------------- OPEN APP
  async function openApp(name, { sudo = false, args = [], query = {} }) {
    const options = { sudo, query, args };

    try {
      const data = await requestOpenApp(name, options, client.clientID);

      runningApps.value.push(data);
      setActiveApp(runningApps.value.length - 1);
      changeScreen("app");
    } catch (err) {
      errors.raiseError(err, "error", `Error opening app: ${name}`);
    }
  }

  // ---------------- CLOSE APP
  async function closeApp(index) {
    const app = runningApps.value[index];
    if (!app) return;

    try {
      await requestCloseApp(app.id, client.clientID);
    } catch (err) {
      errors.raiseError(
        err,
        "error",
        `Error closing app: ${app.manifest.name}`
      );
      return;
    }

    // Keep the same app active when removing an app before it
    if (index < activeAppIndex.value) {
      activeAppIndex.value--;
    }

    runningApps.value.splice(index, 1);

    uiConfig.removeAppAlerts(app.id);

    const total = runningApps.value.length;

    if (total === 0) {
      activeAppIndex.value = -1;
      changeScreen("home");
      return;
    }

    if (index >= total) {
      activeAppIndex.value = total - 1;
    }
  }

  // ---------------- EXTERNAL APP BY ID
  function closeAppById(appId) {
    const index = runningApps.value.findIndex(a => a.id === appId);
    if (index !== -1) {
      closeApp(index);
    }
  }

  // ---------------- CLOSE APP BY NAME
  function closeAppByName(appName) {
    const indexes = runningApps.value
      .map((app, i) => (app.manifest.name === appName ? i : -1))
      .filter(i => i !== -1)
      .reverse();

    indexes.forEach(i => closeApp(i));
  }

  return {
    getAppByID,
    runningApps,
    activeAppIndex,
    activeApp,
    setActiveApp,
    switchAppLeft,
    switchAppRight,
    openApp,
    closeApp,
    closeAppById,
    closeAppByName
  };
}

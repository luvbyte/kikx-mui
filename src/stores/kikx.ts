import { defineStore } from "pinia";
import { ref, computed, reactive } from "vue";

import { defaultBackground } from "@/kikx/config";

export const useUIConfig = defineStore("uiConfig", () => {
  const state = reactive({
    bg: defaultBackground, // Default Background

    isSilent: false, // Silent
    canToast: true, // Top toast alert
    iScreen: false, // IScreen mode ( hides statusbar )
    stickBar: true, // Side stick
    navbar: true // navbar
  });

  //
  const alerts = ref([]);

  //
  const pendingToastAlerts = computed(() => {
    return alerts.value
      .filter(alert => !alert._toasted)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  });

  function toastComplete(alertID: string) {
    const alert = alerts.value.find(a => a.uid === alertID);
    if (alert && !alert._toasted) {
      alert._toasted = true;
    }
  }

  function addAppAlert(payload) {
    alerts.value.push({
      ...payload,
      // _toasted: !state.canToast || state.iScreen
      _toasted: !state.canToast // if toast disabled, mark immediately
    });
  }

  // not required
  function addAppAlertBack(payload) {
    alerts.value.push({
      // AppID
      id: payload.id,
      // alert ID
      uid: payload.uid,
      name: payload.name,
      title: payload.title,
      icon: payload.icon,

      type: payload.type,

      msg: payload.msg,
      delay: payload.delay,
      priority: payload.priority,
      extra: payload.extra,

      createdAt: payload.createdAt
    });
  }

  function clearAlerts() {
    alerts.value.splice(0);
  }

  function removeAppAlerts(appID: string) {
    for (let i = alerts.value.length - 1; i >= 0; i--) {
      if (alerts.value[i].id === appID) {
        alerts.value.splice(i, 1);
      }
    }
  }

  function removeAppAlert(alertID: string) {
    const index = alerts.value.findIndex(a => a.uid === alertID);
    if (index !== -1) {
      alerts.value.splice(index, 1);
    }
  }

  return {
    alerts,
    clearAlerts,
    addAppAlert,

    toastComplete,

    pendingToastAlerts,

    removeAppAlert,
    removeAppAlerts,

    // --- state
    state
  };
});

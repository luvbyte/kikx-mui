import { defineStore } from "pinia";
import { ref, computed, reactive } from "vue";

import { defaultBackground } from "@/kikx/config";

export const useUIConfig = defineStore("uiConfig", () => {
  const state = reactive({
    bg: defaultBackground, // Default Background

    isSilent: false, // Silent
    canToast: true, // Top toast alert
    iScreen: false, // IScreen mode ( hides statusbar )
    stickBar: false, // Side stick
    navbar: true // navbar
  });

  //
  const alerts = ref([]);

  // Get pending alerts to toast
  const pendingToastAlerts = computed(() => {
    return alerts.value
      .filter(alert => !alert._toasted)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  });

  // Make alert toast complete
  function toastComplete(alertID) {
    const alert = alerts.value.find(a => a.uid === alertID);
    if (alert && !alert._toasted) {
      alert._toasted = true;
    }
  }

  // Add alert to stack
  function addAppAlert(payload) {
    // Find existing alert
    const alert = alerts.value.find(
      a => a.uid === payload.uid && a.name === payload.name
    );

    // Create new alert
    if (!alert) {
      alerts.value.push({
        ...payload,
        _toasted: !state.canToast || payload.silent // Mark as toasted only if toasts or disabled as silent
      });
      return;
    }

    // Update existing alert and make it pending for toast again
    Object.assign(alert, {
      ...payload,
      _toasted: true
    });
  }

  // Clear all alerts
  function clearAlerts() {
    alerts.value.splice(0);
  }

  // Remove only app alerts
  function removeAppAlerts(appID) {
    for (let i = alerts.value.length - 1; i >= 0; i--) {
      if (alerts.value[i].id === appID) {
        alerts.value.splice(i, 1);
      }
    }
  }

  // Remove app alert by alert ID
  function removeAppAlert(alertID) {
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

import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAlertsStore = defineStore("alertStore", () => {
  const alerts = ref([]);

  // Get pending alerts to toast
  // not toasted && isCode and label
  const pendingAlerts = computed(() => {
    return (
      alerts.value
        .filter(
          alert => !alert._toasted && (!alert.extra.isCode || alert.label)
        )
        // .filter(alert => {
        //   if (alert._toasted) return false;
        //   if (alert.extra.isCode && !alert.extra.label) return false;
        //   return true;
        // })
        // .filter(
        //   alert => !alert._toasted && !alert.extra.isCode && alert.extra.label
        // )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    );
  });

  // Complete alert
  function alertComplete(alertID) {
    const alert = alerts.value.find(a => a.uid === alertID);
    if (alert && !alert._toasted) {
      alert._toasted = true;
    }
  }

  // Add alert
  function addAlert(payload, silent = false) {
    // Find existing alert
    const alert = alerts.value.find(
      a => a.uid === payload.uid && a.name === payload.name
    );

    // Create new alert
    if (!alert) {
      alerts.value.push({
        ...payload,
        _toasted: silent // Silent alert
      });
      return;
    }

    // Update existing alert and make it pending for toast again
    Object.assign(alert, {
      ...payload,
      _toasted: silent
    });
  }

  // Clear all alerts
  function clearAlerts(sticky = true) {
    if (sticky) {
      alerts.value = [];
    } else {
      alerts.value = alerts.value.filter(alert => alert.sticky);
    }
  }

  // Remove app alerts
  function removeAlerts(appID) {
    for (let i = alerts.value.length - 1; i >= 0; i--) {
      if (alerts.value[i].id === appID) {
        alerts.value.splice(i, 1);
      }
    }
  }

  // Remove app alert by alert ID
  function removeAlert(alertID) {
    const index = alerts.value.findIndex(a => a.uid === alertID);
    if (index !== -1) {
      alerts.value.splice(index, 1);
    }
  }

  return {
    alerts,
    addAlert,
    clearAlerts,

    pendingAlerts,
    alertComplete,

    removeAlert,
    removeAlerts
  };
});

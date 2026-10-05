import { defineStore } from "pinia";
import { ref, computed, reactive } from "vue";

import { defaultBackground } from "@/kikx/config";

export const useUIConfig = defineStore("uiConfig", () => {
  const state = reactive({
    bg: defaultBackground, // Default Background

    isSilent: false, // Silent
    hideAlert: false, // Hide alert
    iScreen: false, // IScreen mode ( hides statusbar )
    navbar: true, // navbar
    swipeNav: false, // Swipe Navigation

    alertSliderPrefix: "",
    touchSprinkle: "gold", // touch sprinkle effects
    snowParticles: "none", // bg snow particles
    bgBlur: 1,

    appIconFocusAnimation: "jello",

    swipeNavPosition: {
      x: 0,
      y: 0,
      left: false
    },

    filePicker: {
      view: "list"
    },

    // Settings
    networkIcon: true,
    // Block Alerts
    blockAlerts: false,

    // Navbar Layout
    navLayout: "normal",

    // Apps menu icons style
    iconsStyle: "solid",
    splash: "orbit",  // orbit, hide, ripple, static
    batteryIcon: "circle",
    haptic: "crisp",

    autoHideAppCSwitch: true,
    enableAppActions: true
  });

  return { state };
});

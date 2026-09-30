import { Client } from "./client";
import { fetchData } from "./api";
import { blobToText } from "./utils";

import { getUrl, muiPath, defaultBackground, DEV } from "./config";

import { useUIConfig } from "@/stores/kikx";

import { toRaw } from "vue";

import { z } from "zod";

// Validation scheme
const muiConfigSchema = z.object({
  bg: z.string(),

  isSilent: z.boolean(),
  hideAlert: z.boolean(),
  iScreen: z.boolean(),
  swipeNav: z.boolean(),
  navbar: z.boolean(),

  // Alert slider prefix icon
  alertSliderPrefix: z.string(),

  // App icon active animation
  appIconFocusAnimation: z.enum([
    "jello",
    "fadeIn",
    "pulse",
    "zoomIn",
    "rubberBand",
    "flip",
    "tada",
    "wobble",
    "swing",
    "flipInX"
  ]),

  // Touch sprinkle effects
  touchSprinkle: z.enum([
    "white",
    "ocean",
    "rainbow",
    "fire",
    "neon",
    "candy",
    "gold",
    "ice",
    "sunset",
    "purple",
    "emerald",
    "none"
  ]),

  // Bg Snow particle
  snowParticles: z.enum([
    "white",
    "ocean",
    "rainbow",
    "fire",
    "neon",
    "candy",
    "gold",
    "ice",
    "sunset",
    "purple",
    "emerald",
    "none"
  ]),

  bgBlur: z.number(),

  // Navigation bar layouts
  navLayout: z.enum(["normal", "reverse"]),
  // App icons style
  iconsStyle: z.enum(["solid", "wrap", "icon"]),
  // App opening animation
  splash: z.enum(["static", "pulse", "hide"]),
  // Battery icon style
  batteryIcon: z.enum(["box", "circle", "hide"]),
  // Haptics
  haptic: z.enum(["soft", "crisp", "off"]),
  // Network Icon
  networkIcon: z.boolean(),
  // Block Alerts
  blockAlerts: z.boolean(),

  // Swipe nav position
  swipeNavPosition: z.object({
    x: z.number(),
    y: z.number(),
    left: z.boolean()
  }),

  // Advance options
  autoHideAppCSwitch: z.boolean(),
  useModuleReplace: z.boolean(),
  enableAppActions: z.boolean()
});

// Client Instance
const client = new Client();

export function fetchAppsList() {
  const url = getUrl("/api/apps/list");

  return fetchData(url, {
    method: "POST",
    body: {
      client_id: client.clientID
    }
  });
}

export function requestOpenApp(name, options, clientID) {
  const url = getUrl("/open-app");

  return fetchData(url, {
    method: "POST",
    body: {
      name,
      options,
      client_id: clientID
    }
  });
}

export function requestCloseApp(appID, clientID) {
  const url = getUrl("/close-app");

  return fetchData(url, {
    method: "POST",
    body: {
      app_id: appID,
      client_id: clientID
    }
  });
}

// Send post message to app
export function postAppMessage(appID, payload = null) {
  const app = document.getElementById(`app_${appID}`);

  if (!app) return;

  app.contentWindow.postMessage(payload, "*");
}

export function postAppMessageEvent(appID, event, payload = {}) {
  return postAppMessage(appID, {
    event,
    payload
  });
}

// MUI config
export const muiConfig = {
  configFilePath: muiPath + "/config.json",

  // Get object from store values
  getConfig() {
    const uiConfigStore = useUIConfig();
    return toRaw(uiConfigStore.state);
  },

  // Assign object values to store values
  parseConfig(data) {
    const uiConfigStore = useUIConfig();
    const validated = muiConfigSchema.parse(data);
    uiConfigStore.$patch(store => {
      Object.assign(store.state, validated);
    });
  },

  // Load config
  async load() {
    try {
      const res = await client.fs.readFile(this.configFilePath);
      if (!res.data) {
        throw Error("Data not found");
      }
      const data = JSON.parse(await blobToText(res.data));
      this.parseConfig(data);
    } catch (err) {
      console.log("Error loading config: ", err);
      await this.save();
    }
  },

  // Save config
  async save() {
    const config = await this.getConfig();
    await client.fs.writeFile(
      this.configFilePath,
      JSON.stringify(config),
      true
    );
  }
};

// Auto login for development
export async function devLogin(key) {
  if (!DEV) return;

  const url = getUrl("/dev/generate");

  const { access_token } = await fetchData(url, {
    params: {
      key,
      ui: "mui"
    }
  });

  document.cookie = `access_token=${access_token}`;
}

// Get client
export function useClient() {
  return client;
}

// Get FileSystem
export function getFS() {
  return useClient().fs;
}

// Get System
export function getSystem() {
  return useClient().system;
}

export function getMicro() {
  return useClient().micro;
}

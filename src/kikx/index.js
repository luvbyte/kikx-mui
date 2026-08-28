import { Client } from "./client";
import { request } from "./api";
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

  // App icon active animation
  appIconFocusAnimation: z.string(),

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
  })
});

// Client Instance
const client = new Client();

export async function fetchAppsList() {
  try {
    return await request("/api/apps/list", {
      method: "POST",
      body: {
        client_id: client.clientID
      },
      fallbackMessage: "Failed to fetch apps list"
    });
  } catch {
    return [];
  }
}

export function requestOpenApp(name, options, clientID) {
  return request("/open-app", {
    method: "POST",
    body: {
      name,
      options,
      client_id: clientID
    },
    fallbackMessage: `Failed to open "${name}"`
  });
}

export function requestCloseApp(appID, clientID) {
  return request("/close-app", {
    method: "POST",
    body: {
      app_id: appID,
      client_id: clientID
    },
    fallbackMessage: "Failed to close app"
  });
}

// Send post message to app
export function postAppMessage(appID, payload) {
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
    await client.fs.createDirectory(muiPath);
    await client.fs.writeFile(this.configFilePath, JSON.stringify(config));

    console.log("Config saved: ", config);
  }
};

// Auto login for development
export async function devLogin(key, ui = "mui") {
  if (!DEV) return;
  try {
    // const res = await fetch("http://localhost:8000/generate?key=" + key);
    const res = await fetch(getUrl(`/generate?key=${key}&ui=${ui}`));
    const { access_token } = await res.json();
    document.cookie = `access_token=${access_token}`;
  } catch (err) {
    console.error("Login error:", err);
  }
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

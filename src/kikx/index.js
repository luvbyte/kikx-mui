import { Client, getClientID } from "./client";
import { getUrl, muiPath, defaultBackground } from "./config";

import { FileSystemService, SystemService } from "./service";

import { blobToText } from "./utils";

import { toRaw } from "vue";

import { useUIConfig } from "@/stores/kikx";

import { z } from "zod";

const muiConfigSchema = z.object({
  isSilent: z.boolean(),
  canToast: z.boolean(),
  isFullScreen: z.boolean(),
  stickBar: z.boolean(),
  bg: z.string(),
  iScreen: z.boolean(),
  fMode: z.boolean()
});

const client = new Client();
const fs = new FileSystemService();
const system = new SystemService();

// Fetch apps list
async function fetchAppsList() {
  const res = await fetch(getUrl("/api/apps/list"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: client.clientID
    })
  });

  return await res.json();
}

const muiConfig = {
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
      const res = await fs.readFile(this.configFilePath);
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
    await fs.createDirectory(muiPath);
    await fs.writeFile(this.configFilePath, JSON.stringify(config));

    console.log("Config saved: ", config);
  }
};

export { client, fs, system, muiConfig, fetchAppsList };

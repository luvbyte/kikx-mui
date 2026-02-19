import { defineStore } from "pinia";
import { ref, computed, reactive } from "vue";

import { defaultBackground } from "@/kikx/config"

export const useUIConfig = defineStore("uiConfig", () => {
  const state = reactive({
    isSilent: false,
    canToast: false,
    isFullScreen: false,
    stickBar: true,
    bg: defaultBackground,
    iScreen: false,
    fMode: true
  });

  //
  const notifications = ref([
    {
      title: "Test1",
      msg: "Test message 1 rfgrf dghtr dsdcfrrfvv ffreereeerrrrrrrr ejjejjejerjejjj iududjjdjj jrjjdjjfjrjjejjrjjrjj jj jjdjjdjjcj ",
      type: "info"
    },
    {
      title: "Test1",
      msg: "Test message 1",
      type: "error"
    },
    {
      title: "Test1",
      msg: "Test message 1",
      type: "warning"
    },
    {
      title: "Test1",
      msg: "Test message 1",
      type: "warning"
    },
    {
      title: "Test1",
      msg: "Test message 1",
      type: "warning"
    }
  ]);

  return {
    notifications,
    state
  };
});

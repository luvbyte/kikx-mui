import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUIConfig = defineStore("uiConfig", () => {
  const isSilent = ref<boolean>(false);
  const canToast = ref<boolean>(false);
  const isFullScreen = ref<boolean>(false);

  const stickBar = ref<boolean>(true);

  const background = ref<string>("");

  // immersive full screen only on apps
  const iScreen = ref<boolean>(false);
  const fMode = ref<boolean>(true);
  
  const showSettings = ref(false)
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
  return { isSilent, canToast, isFullScreen, notifications, iScreen, stickBar, fMode, showSettings };
});

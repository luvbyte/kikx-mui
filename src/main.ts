import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";

import { vSwipe, vSwipeStop } from "@/directives/swipe.js";
import draggable from "@/directives/draggable.js";
import "./style.css";

import "@/kikx/index.ts";

const app = createApp(App);

app.use(Vue3Toastify, {
  autoClose: 2000
});

app.config.globalProperties.$toast = toast;

app.directive("swipe", vSwipe);
app.directive("swipe-stop", vSwipeStop);

app.use(createPinia());

app.mount("#app");

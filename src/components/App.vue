<script setup lang="ts">
  import { finalUrl } from "@/kikx/config";

  const props = defineProps(["app"]);
</script>

<template>
  <iframe
    :name="app.id"
    :src="finalUrl(app.url)"
    :sandbox="app.iframe.sandbox"
    :allowFullscreen="app.iframe.allowfullscreen"
    :allow="app.iframe.allow"
    :loading="app.iframe.loading"
    scrolling="no"
    :referrerPolicy="app.iframe.referrerpolicy"
  ></iframe>
</template>

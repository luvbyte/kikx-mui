<template>
  <div
    @click.self="handleClose"
    class="fscreen flex flex-col justify-end text-white bg-black/80"
  >
    <!-- Bottom Share Panel -->
    <Transition name="slide-up">
      <div
        v-if="!loading"
        class="w-full h-[60%] p-2 px-4 rounded-t-3xl bg-white/20 flex flex-col gap-2"
      >
        <!-- Header -->
        <div class="py-2 flex justify-between items-center">
          <h1 class="text-xl">
            Share <span class="capitalize">{{ itemType }}</span>
          </h1>
          <button @click="handleClose">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                fill="currentColor"
                d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
              />
            </svg>
          </button>
        </div>
        <!-- If image -->
        <div
          v-if="fileInfo && fileInfo.image_type"
          class="p-2 flex items-center justify-center pb-4"
        >
          <Thumbnail :path="item" class="w-22 h-22" />
        </div>
        <!-- Copy -->
        <div class="p-2 bg-white/20 rounded-lg flex items-center gap-2">
          <img
            class="w-12 h-12 rounded-lg"
            :src="getImageUrl(options.app?.icon)"
          />
          <div class="flex-1 flex flex-col justify-center">
            <h1 class="text-2xl leading-tight">{{ options.app.title }}</h1>
            <p class="leading-6 max-h-12 overflow-y-auto">
              {{ itemType === "file" ? fileInfo.name : item }}
            </p>
          </div>
          <button
            v-if="itemType !== 'file'"
            class="p-1 rounded-lg"
            @click="copyText"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <g fill="none" stroke="currentColor" stroke-width="1.5">
                <path
                  d="M6 11c0-2.828 0-4.243.879-5.121C7.757 5 9.172 5 12 5h3c2.828 0 4.243 0 5.121.879C21 6.757 21 8.172 21 11v5c0 2.828 0 4.243-.879 5.121C19.243 22 17.828 22 15 22h-3c-2.828 0-4.243 0-5.121-.879C6 20.243 6 18.828 6 16z"
                />
                <path
                  d="M6 19a3 3 0 0 1-3-3v-6c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h4a3 3 0 0 1 3 3"
                  opacity=".5"
                />
              </g>
            </svg>
          </button>
        </div>
        <!-- File option -->
        <div
          v-if="itemType === 'file' && fileInfo"
          class="py-2 flex justify-center items-center"
        >
          <button
            v-if="!fileInfo.directory"
            @click="downloadFile"
            class="btn btn-sm bg-white/60"
          >
            Download
          </button>
        </div>

        <!-- Apps -->
        <div
          class="w-full flex flex-nowrap overflow-x-auto gap-2 scrollbar-hide"
          @click="handleClose"
        >
          <div
            v-for="app in apps"
            :key="app.name"
            @click="openUsingApp(app.name)"
            class="flex-shrink-0 flex flex-col items-center"
          >
            <img class="w-24 h-24 rounded-xl" :src="getImageUrl(app.icon)" />
            <h1 class="truncate">{{ app.title }}</h1>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onBeforeMount } from "vue";
  import { getSystem, getFS } from "@/kikx";
  import { getImageUrl } from "@/kikx/config";

  import Thumbnail from "@/components/utils/Thumbnail.vue";

  const props = defineProps({
    options: Object,
    app: Object
  });

  const emit = defineEmits(["close", "shareUsingApp"]);

  const system = getSystem();
  const fs = getFS();

  const apps = ref([]);
  const loading = ref(true);

  const fileInfo = ref(null);

  const item = props.options.item;

  // Share item type
  const itemType = (() => {
    if (/^https?:\/\//i.test(item)) {
      return "link";
    }

    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(item)) {
      return "file";
    }

    return "text";
  })();

  async function copyText() {
    try {
      await navigator.clipboard.writeText(item);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  async function downloadFile() {
    if (itemType !== "file" || fileInfo.value.directory) return;

    const filename = fileInfo.value.name;

    const res = await fs.readFile(item);

    if (res.error) return;

    const blob = res.data;

    // Create a download link
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleClose() {
    emit("close");
  }

  function openUsingApp(appName) {
    emit("shareUsingApp", appName, {
      item,
      itemType
    });
  }

  onMounted(async () => {
    if (itemType === "file") {
      const res = await fs.getFileInfo(item);
      if (res.error) return;

      fileInfo.value = res.data;
    }

    // Load all installed apps
    apps.value = await system.fetchAppsList(true);
    // Show apps screen
    loading.value = false;
  });
</script>

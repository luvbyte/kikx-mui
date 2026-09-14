<script setup>
  import { ref, onMounted } from "vue";
  import { getSystem, getFS } from "@/kikx";
  import { getImageUrl } from "@/kikx/config";

  import ImagePreview from "@/components/utils/ImagePreview.vue";
  import ScrollingText from "@/components/ui/ScrollingText.vue";

  const props = defineProps({
    options: {
      type: Object,
      required: true
    }
  });
  const emit = defineEmits(["close", "shareUsingApp"]);

  const system = getSystem();
  const fs = getFS();

  const apps = ref([]);
  const showPanel = ref(false);

  const fileInfo = ref(null);
  const fileAbsPath = ref(false);

  const item = String(props.options.item);

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

  function getExposeMinutes(sizeBytes, speedMbps = 5) {
    const bits = sizeBytes * 8;
    const seconds = bits / (speedMbps * 1_000_000);

    // Add 2x safety margin
    const minutes = (seconds * 2) / 60;

    // Minimum 5 min, maximum 240 min
    return Math.min(240, Math.max(5, Math.ceil(minutes)));
  }

  async function downloadFile() {
    if (itemType !== "file" || fileInfo.value.directory) return;

    const filename = fileInfo.value.name;
    const fileSize = fileInfo.value.size_bytes;
    const expireMinutes = getExposeMinutes(fileSize);

    const { data, error } = await fs.expose(item, expireMinutes);
    if (error) return;

    const url = fs.getServeAbsUrl(data.uid);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function handleClose() {
    showPanel.value = false;
  }

  function openUsingApp(appName) {
    emit("shareUsingApp", appName, {
      item,
      itemType
    });
  }

  onMounted(async () => {
    if (itemType === "file") {
      const { data, error } = await fs.getFileInfo(item);

      if (error) {
        handleClose();
        return;
      }

      fileInfo.value = data;
    }

    // Load all installed apps
    apps.value = await system.fetchAppsList(true);
    // Show apps screen
    showPanel.value = true;
  });
</script>

<template>
  <div
    @click.self="handleClose"
    class="fixed inset-0 z-50 flex flex-col justify-end text-white bg-black/60 backdrop-blur-[2px]"
  >
    <!-- Image Preview -->
    <Transition name="fade-scale">
      <div
        v-if="showPanel && fileInfo?.image_type"
        class="flex items-center justify-center p-4"
      >
        <ImagePreview
          :path="item"
          class="fscreen overflow-hidden rounded-2xl object-contain shadow-2xl"
        />
      </div>
    </Transition>

    <!-- Bottom Share Sheet -->
    <Transition name="slide-up" @after-leave="emit('close')">
      <div
        v-if="showPanel"
        class="relative w-full min-h-[50%] nax-h-[50%] overflow-hidden rounded-t-[28px] bg-[#202124]/95 shadow-[0_-8px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-3">
          <div>
            <h1 class="text-lg font-medium tracking-tight">
              Share
              <span class="capitalize">{{ itemType }}</span>
            </h1>
          </div>

          <button
            @click="handleClose"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition active:scale-90 hover:bg-white/15"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
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

        <!-- Content Card -->
        <div class="px-4">
          <div
            class="flex items-center gap-3 rounded-2xl bg-white/[0.07] px-3 py-3 ring-1 ring-white/[0.06]"
          >
            <!-- App Icon -->
            <img
              class="h-12 w-12 shrink-0 rounded-xl object-cover"
              :src="getImageUrl(options.app.icon)"
            />

            <!-- Text -->
            <div class="min-w-0 flex-1">
              <h1 class="truncate text-[16px] font-medium">
                {{ options.app.title }}
              </h1>

              <p
                class="mt-0.5 max-h-10 overflow-y-auto break-all text-[13px] leading-5 text-white/55"
              >
                {{ itemType === "file" ? fileInfo.name : item }}
              </p>
            </div>

            <!-- Copy -->
            <button
              v-if="itemType !== 'file'"
              @click="copyText"
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 transition active:scale-90 hover:bg-white/15"
              aria-label="Copy"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
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
        </div>

        <!-- File Actions -->
        <div v-if="itemType === 'file' && fileInfo" class="px-4 pt-3">
          <div
            class="flex items-center gap-3 rounded-2xl bg-white/[0.05] px-3 py-2.5"
          >
            <!-- Download -->
            <button
              v-if="!fileInfo.directory"
              @click="downloadFile"
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition active:scale-90 hover:bg-white/15"
              aria-label="Download"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                viewBox="0 0 1024 1024"
              >
                <path
                  fill="currentColor"
                  d="M624 706.3h-74.1V464c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v242.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.7a8 8 0 0 0 12.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9"
                />
                <path
                  fill="currentColor"
                  d="M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7c-23.5-24.2-36-56.8-34.9-90.6c.9-26.4 9.9-51.2 26.2-72.1c16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9l13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0 1 52.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9c15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5l37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 0 1-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3"
                />
              </svg>
            </button>

            <!-- Path -->
            <div class="min-w-0 flex-1">
              <ScrollingText
                @click="fileAbsPath = !fileAbsPath"
                :text="fileAbsPath ? fileInfo.absolute_path : item"
                class="block w-full text-sm text-white/65"
              />
            </div>
          </div>
        </div>

        <!-- Apps -->
        <div class="mt-4 px-4">
          <div
            class="flex gap-5 overflow-x-auto pb-5 scrollbar-hide snap-x"
            @click="handleClose"
          >
            <div
              v-for="app in apps"
              :key="app.name"
              @click="openUsingApp(app.name)"
              class="flex w-[72px] shrink-0 snap-start cursor-pointer flex-col items-center gap-1.5 transition active:scale-90"
            >
              <!-- Icon -->
              <div
                class="h-16 w-16 overflow-hidden rounded-[18px] shadow-lg ring-1 ring-white/10"
              >
                <img
                  class="h-full w-full object-cover"
                  :src="getImageUrl(app.icon)"
                />
              </div>

              <!-- App Name -->
              <h1
                class="w-full truncate text-center text-[12px] font-normal text-white/80"
              >
                {{ app.title }}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

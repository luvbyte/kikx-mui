<script setup>
  import { ref, reactive, computed, onMounted } from "vue";

  import { getFS, muiConfig } from "@/kikx";
  import { getImageUrl, defaultBackground } from "@/kikx/config";
  import { useUIConfig } from "@/stores/kikx";

  import Loading from "@/components/Loading.vue";

  const props = defineProps({
    options: {
      type: Object,
      require: false
    }
  });
  const emit = defineEmits(["close"]);

  const fs = getFS();

  const uiConfig = useUIConfig();

  const showPanel = ref(false);
  const images = ref([]);
  const selectedImage = ref(null);
  const customUrl = ref("");
  const errorText = ref("");

  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];

  const imagePaths = reactive([
    {
      name: "LOCAL",
      virtual: "home://share/images/bg",
      url: "/files/images/bg",
      canUpdate: true
    }
  ]);

  const currentPathVirtual = ref(imagePaths[0].virtual);

  const currentPath = computed(() =>
    imagePaths.find(p => p.virtual === currentPathVirtual.value)
  );

  const basePath = computed(() =>
    currentPath.value.url.endsWith("/")
      ? currentPath.value.url
      : currentPath.value.url + "/"
  );

  const offset = ref(0);
  const limit = ref(10);

  const hasMore = ref(false);
  const loadingMore = ref(false);

  // Fetch images list
  async function fetchImages() {
    const { virtual } = currentPath.value;

    const { data, error } = await fs.listFiles(virtual, {
      offset: offset.value,
      limit: limit.value,
      sort: "modified",
      asc: false
    });

    loadingMore.value = false;

    if (error) {
      errorText.value = error.detail || "Failed to load images.";
      return [];
    }

    hasMore.value = data.has_more;

    return data.files
      .filter(
        file =>
          !file.directory && imageExtensions.includes(file.suffix.toLowerCase())
      )
      .map(file => basePath.value + file.name);
  }

  // Load more images
  async function loadMore() {
    if (loadingMore.value || !hasMore.value) return;

    loadingMore.value = true;
    offset.value += limit.value;

    images.value.push(...(await fetchImages()));
  }

  // Render Images
  async function renderImages() {
    offset.value = 0;
    images.value = [];

    // await fs.createDirectory(virtual);

    images.value = await fetchImages();
  }

  // On images scroll load more
  function onScroll(e) {
    const el = e.currentTarget;

    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
      loadMore();
    }
  }

  // Select Image
  function selectImage(src) {
    selectedImage.value = src;
    uiConfig.state.bg = src;
  }

  // Delete Image
  async function handleDeleteSelectedImage() {
    errorText.value = "";

    if (selectedImage.value === defaultBackground) {
      errorText.value = "Can't delete default background";
      return;
    }

    if (!currentPath.value.canUpdate) return;
    if (!selectedImage.value) {
      errorText.value = "No image selected.";
      return;
    }

    const fileName = selectedImage.value.replace(basePath.value, "");
    const fullPath = `${currentPath.value.virtual}/${fileName}`;

    const { data, error } = await fs.deleteFile(fullPath);
    if (error) {
      errorText.value = error.detail || "Delete failed.";
      return;
    }

    images.value = images.value.filter(i => i !== selectedImage.value);
    selectImage(defaultBackground);
  }

  // Upload Image
  async function handleImageUpload(event) {
    errorText.value = "";

    if (!currentPath.value.canUpdate) return;

    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      errorText.value = "Only image files allowed.";
      return;
    }

    const ext = file.name.substring(file.name.lastIndexOf("."));
    const randomId = Math.random().toString(36).substring(2, 10);
    const newFileName = `${randomId}${ext}`;

    const renamedFile = new File([file], newFileName, {
      type: file.type
    });

    const { data, error } = await fs.uploadFile(
      renamedFile,
      currentPath.value.virtual
    );
    if (error) {
      errorText.value = error.detail || "Upload failed.";
      return;
    }

    const imageUrl = basePath.value + newFileName;
    images.value.unshift(imageUrl);
    selectImage(imageUrl);
  }

  // Custum URL
  function setBackgroundCustomUrl() {
    errorText.value = "";

    if (customUrl.value.length <= 0) return;

    const test = new Image();
    test.onload = () => {
      images.value.unshift(customUrl.value);
      selectImage(customUrl.value);
      customUrl.value = "";
    };
    test.onerror = () => {
      errorText.value = "Failed to load image.";
    };

    test.src = customUrl.value;
  }

  function handleClose() {
    showPanel.value = false;
  }

  // Copy Wallpaper to /files
  async function fetchWallpaperUrl(url) {
    const info = await fs.getFileInfo(url);

    if (info.error) {
      throw new Error("Error fetching file");
    }

    const { name, image_type, suffix, size_bytes, kikxpath } = info.data;

    const isImage = Boolean(image_type);
    const isVideo = suffix === ".mp4";

    // Must be an image or video
    if (!isImage && !isVideo) {
      throw new Error("Require image or video type");
    }

    // Images must be less than 25 MB
    if (isImage && size_bytes >= 25 * 1024 * 1024) {
      throw new Error("Image size must be less than 25 MB");
    }

    // Videos must be less than 50 MB
    if (isVideo && size_bytes >= 50 * 1024 * 1024) {
      throw new Error("Video size must be less than 50 MB");
    }

    const tempDir = "images/bg/.active_bg";
    const tempFile = `${tempDir}/${name}`;

    // Clear previous active wallpaper
    await fs.deleteDirectory(`home://share/${tempDir}`).catch(() => {});

    const { error } = await fs.copyFile(
      kikxpath,
      `home://share/${tempFile}`,
      true
    );

    if (error) {
      throw new Error("Error setting wallpaper");
    }

    return `/files/${tempFile}`;
  }

  // Init with options
  async function init() {
    if (!props.options) return false;

    const url = String(props.options.url || "");
    const app = props.options.app;

    if (url.startsWith("http://") || url.startsWith("https://")) {
      customUrl.value = url;
      setBackgroundCustomUrl();
      return true;
    }

    if (url.startsWith("/files")) {
      selectImage(url);
      return true;
    }

    try {
      const wallpaperUrl = await fetchWallpaperUrl(url);

      selectImage(wallpaperUrl);

      return true;
    } catch (err) {
      errorText.value = err.message || "Error loading wallpaper";
      return false;
    }
  }

  const success = () => {
    emit("close", {
      success: true,
      error: null
    });
  };

  const error = error => {
    emit("close", {
      success: false,
      error
    });
  };

  onMounted(async () => {
    setTimeout(() => (showPanel.value = true), 300);
    // Init
    (await init()) ? success() : await renderImages();
  });
</script>

<template>
  <div
    @click.self="handleClose"
    class="fscreen flex flex-col justify-between text-white"
  >
    <!-- Top bar -->
    <Transition name="slide-down" mode="out-in" @after-leave="error(errorText)">
      <div
        v-if="showPanel"
        :key="currentPathVirtual"
        class="flex flex-col gap-2 items-center bg-black/40 p-2 py-4 shadow-lg"
      >
        <div class="flex gap-2 items-center w-full">
          <!-- URL input -->
          <input
            v-model="customUrl"
            placeholder="Image url"
            class="input input-sm bg-transparent border-white focus:outline-none placeholder:opacity-60"
          />
          <div v-if="currentPath.canUpdate" class="flex items-center gap-2">
            <label class="btn btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                >
                  <path
                    d="m3 16l4.47-4.47a1.81 1.81 0 0 1 2.56 0L14 15.5m1.5 1.5L14 15.5m7 .5l-2.47-2.47a1.81 1.81 0 0 0-2.56 0L14 15.5"
                  />
                  <path
                    d="M12 2.5c-4.23 0-6.345 0-7.747 1.198q-.3.256-.555.555C2.5 5.655 2.5 7.77 2.5 12s0 6.345 1.198 7.747q.256.3.555.555C5.655 21.5 7.77 21.5 12 21.5s6.345 0 7.747-1.198q.3-.256.555-.555C21.5 18.345 21.5 16.23 21.5 12m-6-6.5c.59-.607 2.16-3 3-3s2.41 2.393 3 3m-3-2.5v6.5"
                  />
                </g>
              </svg>
              <input
                type="file"
                hidden
                accept="image/*"
                @change="handleImageUpload"
              />
            </label>
            <button
              v-if="customUrl"
              class="btn btn-sm btn-success"
              @click="setBackgroundCustomUrl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 1200 1200"
              >
                <path d="M0 0h1200v1200H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M600 0C268.63 0 0 268.63 0 600s268.63 600 600 600s600-268.63 600-600S931.369 0 600 0m0 130.371c259.369 0 469.556 210.325 469.556 469.629S859.369 1069.556 600 1069.556c-259.37 0-469.556-210.251-469.556-469.556C130.445 340.696 340.63 130.371 600 130.371m229.907 184.717L482.153 662.915L369.36 550.122L258.691 660.718l112.793 112.793l111.401 111.401l110.597-110.669l347.826-347.754z"
                />
              </svg>
            </button>
            <button
              v-else
              class="btn btn-sm btn-error"
              @click="handleDeleteSelectedImage"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                >
                  <path
                    d="m3 16l4.47-4.47a1.81 1.81 0 0 1 2.56 0L14 15.5m1.5 1.5L14 15.5m7 .5l-2.47-2.47a1.81 1.81 0 0 0-2.56 0L14 15.5"
                  />
                  <path
                    d="M12 2.5c-4.23 0-6.345 0-7.747 1.198q-.3.256-.555.555C2.5 5.655 2.5 7.77 2.5 12s0 6.345 1.198 7.747q.256.3.555.555C5.655 21.5 7.77 21.5 12 21.5s6.345 0 7.747-1.198q.3-.256.555-.555C21.5 18.345 21.5 16.23 21.5 12m0-3.5l-3-3m0 0l-3-3m3 3l3-3m-3 3l-3 3"
                  />
                </g>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="errorText" class="text-error italic text-sm font-bold">
          <span class="text-white"> {{ options?.app?.name }} </span>
          {{ errorText }}
        </div>
      </div>
    </Transition>

    <!-- Bottom image panel -->
    <Transition name="slide-up" mode="out-in">
      <div
        v-if="showPanel"
        :key="currentPathVirtual"
        class="bg-black/40 p-2 py-4"
      >
        <div
          class="flex gap-2 overflow-x-auto scrollbar-hide"
          @scroll="onScroll"
        >
          <!-- Default Background Image -->
          <div class="flex-none w-32 aspect-[9/16]">
            <img
              :src="getImageUrl(defaultBackground)"
              @click="selectImage(defaultBackground)"
              class="w-full h-full object-cover rounded cursor-pointer border-2 transition"
              :class="
                selectedImage === defaultBackground
                  ? 'border-white/80'
                  : 'border-white/20'
              "
            />
          </div>
          <div
            v-for="img in images"
            :key="img"
            class="flex-none w-32 aspect-[9/16]"
          >
            <img
              :src="getImageUrl(img)"
              @click="selectImage(img)"
              class="w-full h-full object-cover rounded cursor-pointer border-2 transition"
              :class="
                selectedImage === img ? 'border-white/80' : 'border-white/20'
              "
            />
          </div>
          <div
            v-if="loadingMore"
            class="flex-none w-32 aspect-[9/16] flex items-center justify-center border-2 border-white/20"
          >
            <Loading class="opacity-60" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

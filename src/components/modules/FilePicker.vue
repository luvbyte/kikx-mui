<template>
  <div data-theme="dark" class="fixed inset-0 z-50 flex flex-col bg-base-100">
    <!-- Header -->
    <header
      class="h-16 shrink-0 flex items-center gap-2 px-2 border-b border-base-300"
    >
      <!-- App Icon -->
      <FadeImage
        class="h-12 w-12 shrink-0 rounded-xl object-cover"
        :src="getUrl(options.app.manifest.icon)"
      />

      <!-- Title + Protocol -->
      <div class="flex-1 min-w-0 flex items-center gap-2">
        <!-- Current path -->
        <div class="flex-1 min-w-0">
          <div class="font-semibold truncate">
            {{ title }}
          </div>

          <div class="text-xs opacity-50 truncate">
            {{ currentDirectory }}
          </div>
        </div>
      </div>

      <!-- Search -->
      <button
        type="button"
        class="btn btn-ghost btn-circle"
        @click="showSearch = !showSearch"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke="currentColor"
            stroke-width="2"
            d="m21 21-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
          />
        </svg>
      </button>

      <!-- View mode -->
      <button
        type="button"
        class="btn btn-ghost btn-circle"
        @click="viewMode = viewMode === 'list' ? 'grid' : 'list'"
      >
        <!-- List -->
        <svg
          v-if="viewMode === 'list'"
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 6h14M5 12h14M5 18h14"
          />
        </svg>

        <!-- Grid -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke="currentColor"
            stroke-width="2"
            d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"
          />
        </svg>
      </button>
    </header>

    <!-- Search -->
    <div v-if="showSearch" class="shrink-0 px-3 py-2 border-b border-base-300">
      <div
        class="w-full max-w-md mx-auto h-10 flex items-center gap-2 px-3 rounded-xl bg-base-200 border border-base-300"
      >
        <!-- Search icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 shrink-0 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-width="2"
            d="m21 21-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
          />
        </svg>

        <!-- Search input -->
        <input
          v-model="search"
          type="search"
          placeholder="Search files"
          class="flex-1 min-w-0 bg-transparent border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus:border-0"
        />

        <!-- Clear -->
        <button
          v-if="search"
          type="button"
          class="shrink-0 w-6 h-6 flex items-center justify-center rounded-full opacity-50 hover:opacity-100 hover:bg-base-300"
          @click="search = ''"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Toolbar -->
    <div
      class="flex justify-between items-center gap-2 w-full p-2 border-b border-base-300"
    >
      <!-- Back -->
      <button
        type="button"
        class="btn btn-sm btn-ghost btn-circle shrink-0"
        @click="goBack"
        :disabled="loading"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div class="flex gap-2 items-center">
        <!-- Protocol -->
        <div class="dropdown dropdown-bottom">
          <button
            tabindex="0"
            type="button"
            class="h-8 px-2.5 rounded-lg bg-base-200 border border-base-300 flex items-center gap-1.5 text-xs font-medium hover:bg-base-300 transition"
            :disabled="loading"
          >
            <span> {{ getProtocol(currentDirectory) }}:// </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-3.5 h-3.5 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m6 9 6 6 6-6"
              />
            </svg>
          </button>

          <ul
            tabindex="0"
            class="dropdown-content z-[60] menu menu-xs p-1 mt-1 w-32 rounded-lg bg-base-200 border border-base-300 shadow-xl"
          >
            <li>
              <button type="button" @click="switchProtocol('home://')">
                home://
              </button>
            </li>

            <li>
              <button type="button" @click="switchProtocol('os://')">
                os://
              </button>
            </li>

            <li>
              <button type="button" @click="switchProtocol('osr://')">
                osr://
              </button>
            </li>

            <li>
              <button type="button" @click="switchProtocol('root://')">
                root://
              </button>
            </li>
          </ul>
        </div>

        <!-- Hidden Files -->
        <button
          type="button"
          class="btn btn-sm btn-ghost btn-circle shrink-0"
          :class="{
            'text-primary bg-primary/10': showHidden
          }"
          :disabled="loading"
          :title="showHidden ? 'Hide hidden files' : 'Show hidden files'"
          @click="
            showHidden = !showHidden;
            loadFiles();
          "
        >
          <!-- Eye -->
          <svg
            v-if="showHidden"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
            />

            <circle cx="12" cy="12" r="2.5" stroke-width="1.8" />
          </svg>

          <!-- Eye Off -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 3l18 18"
            />

            <path
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.6 5.2A10.8 10.8 0 0112 5c6 0 9.5 7 9.5 7a17.5 17.5 0 01-3.2 3.8M6.2 6.2C3.6 8.2 2.5 12 2.5 12s3.5 7 9.5 7c1.4 0 2.7-.3 3.8-.8"
            />

            <path
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.9 9.9a3 3 0 104.2 4.2"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div
      ref="breadcrumbRef"
      class="shrink-0 border-b border-base-300 overflow-x-auto scrollbar-hide"
    >
      <div
        class="w-max min-w-full px-4 py-2 flex items-center gap-1 text-sm whitespace-nowrap"
      >
        <button
          type="button"
          class="font-medium"
          @click="navigateTo(rootDirectory)"
        >
          {{ rootName }}
        </button>

        <template v-for="item in breadcrumbs" :key="item.path">
          <span class="opacity-40">/</span>

          <button type="button" @click="navigateTo(item.path)">
            {{ item.name }}
          </button>
        </template>
      </div>
    </div>

    <!-- Content -->
    <main
      ref="contentRef"
      class="flex-1 min-h-0 overflow-y-auto"
      @scroll="handleScroll"
    >
      <Loading v-if="loading" />

      <!-- Error -->
      <div
        v-else-if="error"
        class="h-full flex flex-col items-center justify-center px-6 text-center"
      >
        <div class="text-error mb-3">
          {{ error }}
        </div>

        <button type="button" class="btn btn-sm btn-outline" @click="loadFiles">
          Retry
        </button>
      </div>

      <!-- Empty -->
      <div
        v-else-if="sortedFiles.length === 0"
        class="h-full flex flex-col items-center justify-center opacity-50 px-6 text-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-14 h-14 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke="currentColor"
            stroke-width="1.5"
            d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
          />
        </svg>

        <span>
          {{ search ? "No matching files" : "Folder is empty" }}
        </span>
      </div>

      <!-- List -->
      <div v-else-if="viewMode === 'list'" class="divide-y divide-base-300">
        <div
          v-for="file in sortedFiles"
          :key="file.kikxpath"
          class="group flex items-center gap-3 px-4 py-3 transition"
          :class="{
            'bg-primary/10': isSelected(file)
          }"
        >
          <!-- Main file/folder area -->
          <button
            type="button"
            class="flex-1 min-w-0 flex items-center gap-3 text-left"
            @click="handleFileClick(file)"
          >
            <!-- Icon -->
            <div
              class="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center overflow-hidden"
              :class="
                file.directory ? 'bg-warning/15 text-warning' : 'bg-base-200'
              "
            >
              <Thumbnail
                v-if="!file.directory && isImage(file)"
                :path="file.kikxpath"
              />

              <!-- Folder -->
              <svg
                v-else-if="file.directory"
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                  d="M3 7a2 2 0 012-2h5l2 2h9a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                />
              </svg>

              <!-- File -->
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 opacity-60"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-width="1.8"
                  d="M6 3h8l4 4v14H6z"
                />
                <path stroke="currentColor" stroke-width="1.8" d="M14 3v5h5" />
              </svg>
            </div>

            <!-- Information -->
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">
                {{ file.name }}
              </div>

              <div class="text-xs opacity-50 mt-0.5 truncate">
                <span v-if="!file.directory">
                  {{ formatSize(file.size_bytes) }}
                </span>
                <span v-else> {{ file.items_count }} Items </span>

                <span v-if="file.modified">
                  ·
                  {{ formatDate(file.modified) }}
                </span>
              </div>
            </div>
          </button>

          <!-- Selected -->
          <div
            v-if="!file.directory && isSelected(file)"
            class="w-6 h-6 shrink-0 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M5 14.5s1.5 0 3.5 3.5c0 0 5.559-9.167 10.5-11"
              />
            </svg>
          </div>

          <!-- Open directory -->
          <button
            v-if="file.directory"
            type="button"
            class="w-9 h-9 shrink-0 flex items-center justify-center rounded-full hover:bg-base-300"
            @click.stop="openDirectory(file)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m9 18 6-6-6-6"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3">
        <div
          v-for="file in sortedFiles"
          :key="file.kikxpath"
          class="relative rounded-2xl p-2 flex flex-col items-center gap-2 transition"
          :class="{
            'bg-primary/10': isSelected(file)
          }"
        >
          <!-- Preview / Open -->
          <button
            type="button"
            class="w-full"
            @click="
              file.directory ? openDirectory(file) : handleFileClick(file)
            "
          >
            <div
              class="w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center"
              :class="
                file.directory ? 'bg-warning/15 text-warning' : 'bg-base-200'
              "
            >
              <!-- Image -->
              <Thumbnail
                v-if="!file.directory && isImage(file)"
                :path="file.kikxpath"
              />

              <!-- Folder -->
              <svg
                v-else-if="file.directory"
                xmlns="http://www.w3.org/2000/svg"
                class="w-12 h-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke="currentColor"
                  stroke-width="1.7"
                  d="M3 7a2 2 0 012-2h5l2 2h9a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                />
              </svg>

              <!-- File -->
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="w-10 h-10 opacity-60"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-width="1.5"
                  d="M6 3h8l4 4v14H6z"
                />
                <path stroke="currentColor" stroke-width="1.5" d="M14 3v5h5" />
              </svg>
            </div>
          </button>

          <!-- Name -->
          <span class="w-full text-sm truncate text-center">
            {{ file.name }}
          </span>

          <!-- File selection -->
          <span
            v-if="isSelected(file)"
            class="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-primary-content text-xs flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M5 14.5s1.5 0 3.5 3.5c0 0 5.559-9.167 10.5-11"
              />
            </svg>
          </span>
        </div>
      </div>

      <!-- Loading more -->
      <div v-if="loadingMore" class="flex items-center justify-center py-5">
        <Loading />
      </div>

      <!-- End 
      <div
        v-else-if="!hasMore && files.length > 0"
        class="flex items-center justify-center py-4 text-xs opacity-40"
      >
        {{ files.length }} of {{ total }} items
      </div>
      -->

      <!-- Bottom trigger -->
      <div v-else-if="hasMore" class="h-10"></div>
    </main>

    <!-- Bottom Action Bar -->
    <div class="shrink-0 border-t border-base-300 bg-base-100 p-3">
      <div class="flex justify-end items-center gap-3">
        <!-- Directory picker -->
        <template v-if="type === 'directory'">
          <button type="button" class="btn btn-ghost" @click="cancel">
            Cancel
          </button>

          <button type="button" class="btn btn-primary" @click="confirm">
            Select this folder
          </button>
        </template>

        <!-- File picker -->
        <template v-else>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium truncate">
              {{ selectedCountText }}
            </div>

            <div class="text-xs opacity-50 truncate">
              {{ selectionHint }}
            </div>
          </div>

          <button type="button" class="btn btn-ghost" @click="cancel">
            Cancel
          </button>

          <button
            type="button"
            class="btn btn-primary"
            :disabled="!canConfirm"
            @click="confirm"
          >
            {{ confirmText }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";

  import { getUrl } from "@/kikx/config";
  import { getFS } from "@/kikx";
  import { useUIConfig } from "@/stores/kikx";

  import Loading from "@/components/Loading.vue";
  import FadeImage from "@/components/ui/FadeImage.vue";
  import Thumbnail from "@/components/utils/Thumbnail.vue";

  const props = defineProps({
    options: {
      type: Object,
      required: true
    }
  });

  const emit = defineEmits(["close"]);

  const fs = getFS();

  const uiConfig = useUIConfig();

  // --------------------------------------------------
  // Options
  // --------------------------------------------------

  const title = computed(() => {
    if (props.options.title) {
      return props.options.title;
    }

    switch (props.options.type) {
      case "directory":
        return "Select Directory";
      case "files":
        return "Select Files";
      case "file":
      default:
        return "Select File";
    }
  });

  const rootDirectory = computed(() => props.options.path || "home://");

  const type = computed(() => props.options.type || "file");

  const multiple = computed(() => type.value === "files");

  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const currentDirectory = ref(rootDirectory.value);

  const files = ref([]);

  const loading = ref(false);
  const loadingMore = ref(false);

  const showSearch = ref(false);
  const showHidden = ref(false);

  const error = ref("");
  const search = ref("");

  const breadcrumbRef = ref(null);

  const viewMode = computed({
    get() {
      return uiConfig.state.filePicker.view || props.options.viewMode || "list";
    },
    set(value) {
      uiConfig.state.filePicker.view = value;
    }
  });

  const sort = ref(props.options.sort || "name");

  const asc = ref(props.options.asc ?? true);

  const selected = ref([]);

  const extensions = computed(() => {
    if (typeof props.options.accept !== "string") return [];

    return props.options.accept
      .split(",")
      .map(ext => ext.trim())
      .filter(Boolean)
      .map(ext => (ext.startsWith(".") ? ext : `.${ext}`));
  });

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const PAGE_SIZE = 100;

  const offset = ref(0);

  const total = ref(0);

  const hasMore = ref(true);

  const contentRef = ref(null);

  // --------------------------------------------------
  // Protocol roots
  // --------------------------------------------------

  const ROOTS = new Set(["home://", "os://", "osr://", "root://"]);

  // --------------------------------------------------
  // Protocol helpers
  // --------------------------------------------------

  const getProtocol = path => {
    if (!path) {
      return null;
    }

    const match = path.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):\/\//);

    return match ? match[1] : null;
  };

  const getProtocolRoot = path => {
    const protocol = getProtocol(path);

    if (!protocol) {
      return null;
    }

    return `${protocol}://`;
  };

  const isProtocolRoot = path => {
    return ROOTS.has(path);
  };

  const switchProtocol = protocol => {
    if (!protocol) {
      return;
    }

    // Close dropdown
    document.activeElement?.blur();

    // Already using this protocol
    if (getProtocol(currentDirectory.value) === getProtocol(protocol)) {
      return;
    }

    // Switch directly to the new protocol root
    currentDirectory.value = protocol;

    search.value = "";

    selected.value = [];

    loadFiles();
  };

  // --------------------------------------------------
  // Root name
  // --------------------------------------------------

  const rootName = computed(() => {
    const protocol = getProtocol(rootDirectory.value);

    switch (protocol) {
      case "home":
        return "Home";

      case "os":
        return "OS";

      case "osr":
        return "OS Root";

      case "root":
        return "Storage";

      default:
        return protocol ? protocol.toUpperCase() : "Files";
    }
  });

  // --------------------------------------------------
  // Breadcrumbs
  // --------------------------------------------------

  const scrollBreadcrumbToRight = async () => {
    await nextTick();

    const element = breadcrumbRef.value;

    if (!element) {
      return;
    }

    element.scrollTo({
      left: element.scrollWidth,
      behavior: "smooth"
    });
  };

  const breadcrumbs = computed(() => {
    const root = rootDirectory.value;
    const current = currentDirectory.value;

    if (!root || !current) {
      return [];
    }

    if (root === current) {
      return [];
    }

    const protocolRoot = getProtocolRoot(current);

    if (!protocolRoot) {
      return [];
    }

    const currentWithoutRoot = current
      .slice(protocolRoot.length)
      .replace(/^\/+|\/+$/g, "");

    if (!currentWithoutRoot) {
      return [];
    }

    const result = [];

    let path = protocolRoot;

    const parts = currentWithoutRoot.split("/");

    for (const name of parts) {
      path += name;

      result.push({
        name,
        path
      });

      path += "/";
    }

    return result;
  });

  // --------------------------------------------------
  // Files
  // --------------------------------------------------

  const sortedFiles = computed(() => {
    return files.value.filter(file => {
      // Directory picker: show directories only
      if (type.value === "directory" && !file.directory) {
        return false;
      }

      // Extension filter: only apply to files
      if (!file.directory && extensions.value.length > 0) {
        if (!extensions.value.includes(file.suffix)) {
          return false;
        }
      }

      // Hide hidden files/directories
      if (!showHidden.value && file.name.startsWith(".")) {
        return false;
      }

      return true;
    });
  });

  // --------------------------------------------------
  // Selection
  // --------------------------------------------------

  const selectedCountText = computed(() => {
    const count = selected.value.length;

    if (!count) {
      return "Nothing selected";
    }

    return `${count} item${count > 1 ? "s" : ""} selected`;
  });

  const selectionHint = computed(() => {
    switch (type.value) {
      case "files":
        return "Select one or more files";

      case "directory":
        return "Select a folder";

      default:
        return "Select a file";
    }
  });

  const canConfirm = computed(() => {
    if (type.value === "directory") {
      return true;
    }

    return selected.value.length > 0;
  });

  const confirmText = computed(() => {
    return type.value === "directory" ? "Select" : "Open";
  });

  // --------------------------------------------------
  // Load files
  // --------------------------------------------------

  const loadFiles = async () => {
    if (loading.value || loadingMore.value) {
      return;
    }

    loading.value = true;
    error.value = "";

    offset.value = 0;
    total.value = 0;
    hasMore.value = true;

    try {
      const result = await fs.listFiles(currentDirectory.value, {
        offset: 0,
        limit: PAGE_SIZE,
        sort: sort.value,
        asc: asc.value,
        filter: type.value === "directory" ? "directories" : "all",
        search: search.value.trim(),
        thumbnails: true
      });

      const data = result?.data;
      const requestError = result?.error;

      if (requestError) {
        error.value =
          requestError.message || requestError.detail || "Unable to load files";

        files.value = [];

        offset.value = 0;
        total.value = 0;
        hasMore.value = false;

        return;
      }

      const newFiles = data?.files || [];

      files.value = newFiles;

      offset.value = newFiles.length;

      total.value = data?.total ?? newFiles.length;

      hasMore.value = data?.has_more ?? offset.value < total.value;

      // selected.value = [];
      if (type.value !== "files") {
        selected.value = [];
      }

      await nextTick();

      await checkScroll();
    } catch (err) {
      error.value = err?.message || "Unable to load files";

      files.value = [];

      hasMore.value = false;
    } finally {
      loading.value = false;
    }
  };

  // --------------------------------------------------
  // Load more
  // --------------------------------------------------

  const loadMore = async () => {
    if (loading.value || loadingMore.value || !hasMore.value) {
      return;
    }

    loadingMore.value = true;

    const currentOffset = offset.value;

    try {
      const result = await fs.listFiles(currentDirectory.value, {
        offset: currentOffset,
        limit: PAGE_SIZE,
        sort: sort.value,
        asc: asc.value,
        filter: type.value === "directory" ? "directories" : "all",
        search: search.value.trim(),
        thumbnails: true
      });

      const data = result?.data;
      const requestError = result?.error;

      if (requestError) {
        return;
      }

      const newFiles = data?.files || [];

      const existingPaths = new Set(files.value.map(file => file.kikxpath));

      const uniqueFiles = newFiles.filter(
        file => !existingPaths.has(file.kikxpath)
      );

      files.value.push(...uniqueFiles);

      offset.value = currentOffset + newFiles.length;

      total.value = data?.total ?? total.value;

      hasMore.value = data?.has_more ?? offset.value < total.value;

      await nextTick();

      await checkScroll();
    } catch (err) {
      console.error("Failed to load more files:", err);
    } finally {
      loadingMore.value = false;
    }
  };

  // --------------------------------------------------
  // Check scroll
  // --------------------------------------------------

  const checkScroll = async () => {
    await nextTick();

    const element = contentRef.value;

    if (!element || !hasMore.value || loadingMore.value) {
      return;
    }

    if (element.scrollHeight <= element.clientHeight + 300) {
      await loadMore();
    }
  };

  // --------------------------------------------------
  // Infinite scroll
  // --------------------------------------------------

  const handleScroll = event => {
    const element = event.target;

    const distanceFromBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight;

    if (distanceFromBottom < 300) {
      loadMore();
    }
  };

  // --------------------------------------------------
  // Navigation
  // --------------------------------------------------

  const navigateTo = async path => {
    if (!path) return;

    currentDirectory.value = path;
    search.value = "";

    if (type.value !== "files") {
      selected.value = [];
    }

    await loadFiles();

    scrollBreadcrumbToRight();
  };

  // --------------------------------------------------
  // Go back
  // --------------------------------------------------

  const goBack = () => {
    const current = currentDirectory.value;

    const root = rootDirectory.value;

    // Already at the selected root.
    if (current === root) {
      cancel();
      return;
    }

    // Protocol root.
    if (isProtocolRoot(current)) {
      cancel();
      return;
    }

    const protocolRoot = getProtocolRoot(current);

    if (!protocolRoot) {
      navigateTo(root);
      return;
    }

    // Remove trailing slash.
    const normalized = current.replace(/\/+$/, "");

    // Remove protocol root.
    const relative = normalized.slice(protocolRoot.length);

    // We are directly inside the protocol root.
    if (!relative.includes("/")) {
      navigateTo(protocolRoot);
      return;
    }

    // Go to parent directory.
    const parentRelative = relative.slice(0, relative.lastIndexOf("/"));

    const parent = protocolRoot + parentRelative + "/";

    navigateTo(parent);
  };

  // --------------------------------------------------
  // File click
  // --------------------------------------------------

  const handleFileClick = file => {
    if (!file) {
      return;
    }

    // Directories are never selectable in file/file(s) mode.
    if (file.directory) {
      navigateTo(file.kikxpath);
      return;
    }

    // Directory picker does not select individual files.
    if (type.value === "directory") {
      return;
    }

    // File selection.
    toggleSelection(file);
  };

  // --------------------------------------------------
  // Open directory
  // --------------------------------------------------

  const openDirectory = file => {
    if (!file?.directory) {
      return;
    }

    navigateTo(file.kikxpath);
  };

  // --------------------------------------------------
  // Selection
  // --------------------------------------------------

  const toggleSelection = file => {
    if (!file) {
      return;
    }

    // Single selection.
    if (!multiple.value) {
      selected.value = [file];

      return;
    }

    const index = selected.value.findIndex(
      item => item.kikxpath === file.kikxpath
    );

    if (index === -1) {
      selected.value.push(file);
    } else {
      selected.value.splice(index, 1);
    }
  };

  const isSelected = file => {
    return selected.value.some(item => item.kikxpath === file.kikxpath);
  };

  // --------------------------------------------------
  // Confirm
  // --------------------------------------------------

  const confirm = async () => {
    // Directory picker: select the currently opened folder.
    if (type.value === "directory") {
      emit("close", {
        action: "select",
        value: currentDirectory.value
      });

      return;
    }

    if (!selected.value.length) {
      return;
    }

    const paths = multiple.value
      ? selected.value.map(file => file.kikxpath)
      : [selected.value[0].kikxpath];

    try {
      const result = await fs.batchExpose(paths, 10);

      const data = result?.data;
      const requestError = result?.error;

      if (requestError) {
        reject(
          requestError.message ||
            requestError.detail ||
            "Unable to expose files"
        );

        return;
      }

      emit("close", {
        action: "select",
        value: multiple.value ? data?.items || [] : data?.items?.[0] || null
      });
    } catch (err) {
      reject(err?.message || "Unable to select files");
    }
  };

  // --------------------------------------------------
  // Cancel
  // --------------------------------------------------

  const cancel = () => {
    emit("close", {
      action: "cancel",
      value: null
    });
  };

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  const reject = message => {
    emit("close", {
      action: "error",
      value: message
    });
  };

  // --------------------------------------------------
  // Images
  // --------------------------------------------------

  const isImage = file => {
    return [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"].includes(
      file.suffix?.toLowerCase()
    )
      ? true
      : false;
  };

  const getThumbnail = file => {
    return fs.thumbnail(file.kikxpath);
  };

  // --------------------------------------------------
  // Formatting
  // --------------------------------------------------

  const formatSize = size => {
    if (size == null) {
      return "";
    }

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 ** 2) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    if (size < 1024 ** 3) {
      return `${(size / 1024 ** 2).toFixed(1)} MB`;
    }

    return `${(size / 1024 ** 3).toFixed(1)} GB`;
  };

  const formatDate = timestamp => {
    if (!timestamp) {
      return "";
    }

    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric"
    });
  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  let searchTimer = null;

  watch(search, () => {
    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {
      loadFiles();
    }, 300);
  });

  // --------------------------------------------------
  // Options watcher
  // --------------------------------------------------

  watch(
    () => [props.options.path, props.options.type],
    () => {
      currentDirectory.value = rootDirectory.value;

      selected.value = [];

      loadFiles();
    }
  );

  // --------------------------------------------------
  // Sorting watcher
  // --------------------------------------------------

  watch(
    () => [sort.value, asc.value],
    () => {
      loadFiles();
    }
  );

  // --------------------------------------------------
  // Mount
  // --------------------------------------------------

  onMounted(() => {
    currentDirectory.value = rootDirectory.value;

    loadFiles();
  });

  // --------------------------------------------------
  // Cleanup
  // --------------------------------------------------

  onUnmounted(() => {
    clearTimeout(searchTimer);
  });
</script>

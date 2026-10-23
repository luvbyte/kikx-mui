<template>
  <section class="flex min-h-0 flex-1 flex-col text-white">
    <div
      class="flex items-center justify-between gap-2 border-y border-white/10 bg-white/5 px-3 py-2.5"
    >
      <div>
        <h2 class="text-sm font-semibold">Micro</h2>

        <p class="text-xs text-white/40">Running Micro Services</p>
      </div>

      <div
        class="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/10 px-2 text-xs font-semibold text-white/70"
      >
        {{ totalServices }}
      </div>
    </div>

    <div v-if="!processing" class="scrollbar-hide flex-1 space-y-2 overflow-y-auto p-2">
      <!-- Empty state -->
      <div
        v-if="!activeServices || !Object.keys(activeServices).length"
        class="flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <h3 class="text-sm font-medium text-white/70">No active services</h3>

        <p class="mt-1 text-xs text-white/35">Running micro services will appear here.</p>
      </div>

      <!-- App Groups -->
      <div v-for="(services, appName) in activeServices" :key="appName" class="space-y-2">
        <!-- App Group Header -->
        <div class="flex items-center justify-between gap-2 px-1">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/15"
          >
            <!-- App Icon -->
            <img class="shrink-0 rounded-xl object-cover" :src="getAppIconUrl(appName, services)" />
          </div>

          <div class="min-w-0 flex-1">
            <h3 class="truncate text-xs font-semibold">
              {{ appName }}
            </h3>

            <p class="text-[11px] text-white/35">
              {{ services.length }}
              {{ services.length === 1 ? "service" : "services" }}
            </p>
          </div>

          <button
            class="rounded border border-white/10 p-1 text-red-400 active:bg-white/20 disabled:bg-gray-400/10"
            @click="() => removeAppServices(appName)"
            :disabled="processing"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              class="bi bi-stop-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5"
              />
            </svg>
          </button>
        </div>

        <!-- Services -->
        <div
          v-for="service in services"
          :key="`${appName}-${service.name}`"
          class="rounded-2xl border border-white/10 bg-white/5 p-3"
        >
          <!-- Service Header -->
          <div class="flex items-center justify-between gap-3">
            <h3 class="truncate text-sm font-semibold">
              {{ service.name }}
            </h3>

            <!-- Running Status -->
            <span
              v-if="service.status?.running"
              class="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Running
            </span>

            <span
              v-else-if="service.status?.completed"
              class="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/40"
            >
              Completed
            </span>

            <span
              v-else
              class="shrink-0 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-300"
            >
              Stopped
            </span>
          </div>

          <!-- App Info -->
          <div class="mt-3 space-y-1 rounded-xl border border-white/5 bg-black/10 p-2.5">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs text-white/40"> App Title </span>

              <span class="truncate text-xs text-white/60">
                {{ service.app?.title }}
              </span>
            </div>

            <div class="flex items-center justify-between gap-2">
              <span class="text-xs text-white/40"> App Name </span>

              <span class="truncate text-xs text-white/60">
                {{ service.app?.name }}
              </span>
            </div>

            <div class="flex items-center justify-between gap-2">
              <span class="text-xs text-white/40"> App ID </span>

              <span class="max-w-[65%] truncate text-xs text-white/50">
                {{ service.app?.id }}
              </span>
            </div>

            <div v-if="service.app?.sudo" class="mt-2 flex items-center justify-between">
              <span class="text-xs text-white/40"> Permission </span>

              <span
                class="bg-secondary/20 border-secondary/30 rounded-md border px-2 py-0.5 text-xs font-semibold"
              >
                Sudo
              </span>
            </div>
          </div>

          <!-- Process -->
          <div class="mt-2.5 rounded-xl border border-white/5 bg-black/10 p-2.5">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-medium text-white/60"> Process </span>

              <span v-if="service.process?.returncode !== null" class="text-xs text-white/35">
                Exit {{ service.process.returncode }}
              </span>

              <span v-else class="text-xs text-emerald-300/70"> Active </span>
            </div>

            <p
              v-if="service.process?.cmd?.length"
              class="mt-2 text-[11px] leading-relaxed break-all text-white/35"
            >
              {{ service.process.cmd.join(" ") }}
            </p>
          </div>

          <!-- Config -->
          <div v-if="service.config" class="mt-2.5 grid grid-cols-3 gap-1.5">
            <div class="rounded-xl border border-white/5 bg-black/10 px-2 py-2">
              <p class="text-[10px] text-white/30">Main</p>

              <p class="mt-0.5 truncate text-xs text-white/55">
                {{ service.config.main || "—" }}
              </p>
            </div>

            <div class="rounded-xl border border-white/5 bg-black/10 px-2 py-2">
              <p class="text-[10px] text-white/30">Stdout</p>

              <p class="mt-0.5 text-xs text-white/55">
                {{ service.config.stdout ? "On" : "Off" }}
              </p>
            </div>

            <div class="rounded-xl border border-white/5 bg-black/10 px-2 py-2">
              <p class="text-[10px] text-white/30">Persistent</p>

              <p class="mt-0.5 text-xs text-white/55">
                {{ service.config.persistent ? "Yes" : "No" }}
              </p>
            </div>
          </div>

          <!-- Error -->
          <div
            v-if="service.process?.error"
            class="mt-2.5 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5"
          >
            <p class="text-xs wrap-break-word text-red-300/80">
              {{ service.process.error }}
            </p>
          </div>

          <!-- Footer -->
          <div class="mt-3 flex items-center justify-between gap-2 border-t border-white/5 pt-2.5">
            <div class="flex items-center gap-1.5 text-xs text-white/40">
              <span>Started</span>
              <TimeStampRelative :timestamp="service.created_at" />
            </div>

            <button
              class="rounded border border-white/10 p-1 text-red-400 active:bg-white/20 disabled:bg-gray-400/10"
              @click="() => removeAppServices(appName, service.name)"
              :disabled="processing"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                class="bi bi-stop-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { ref, computed, onMounted } from "vue";
  import { getMicro } from "@/kikx";
  import { getAppPublicUrl } from "@/kikx/config";

  import TimeStampRelative from "@/components/utils/TimeStampRelative.vue";

  const micro = getMicro();

  const activeServices = ref({});
  const processing = ref(false);

  const totalServices = computed(() => {
    return Object.values(activeServices.value).reduce(
      (total, services) => total + (Array.isArray(services) ? services.length : 0),
      0
    );
  });

  function getAppIconUrl(appName, services) {
    const icon = services?.[0]?.app?.icon;

    if (!icon) return null;

    return getAppPublicUrl(appName, icon);
  }

  async function fetchMicroServices() {
    processing.value = true;

    try {
      const { data, error } = await micro.listServices();

      if (error) {
        console.error("Failed to fetch micro services:", error.detail);
        return;
      }

      activeServices.value = data && typeof data === "object" ? data : {};
    } catch (error) {
      console.error("Failed to fetch micro services:", error);
    } finally {
      processing.value = false;
    }
  }

  async function removeAppServices(appName, serviceName) {
    try {
      const { error } = await micro.removeAppServices(appName, serviceName);

      if (error) {
        console.error("Failed to remove app services:", error.detail);
        return;
      }

      await fetchMicroServices();
    } catch (error) {
      console.error("Failed to remove app services:", error);
    }
  }

  onMounted(fetchMicroServices);
</script>

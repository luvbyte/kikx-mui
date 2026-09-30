<template>
  <section class="flex-1 flex flex-col min-h-0 text-white">
    <div
      class="px-3 py-2.5 flex justify-between items-center gap-2 bg-white/5 border-y border-white/10"
    >
      <div>
        <h2 class="text-sm font-semibold">Micro</h2>

        <p class="text-xs text-white/40">Running Micro Services</p>
      </div>

      <div
        class="min-w-7 h-7 px-2 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white/70"
      >
        <!-- I want all apps combined list length -->
        {{ totalServices }}
      </div>
    </div>

    <div v-if="!processing" class="p-2 flex-1 space-y-2 scrollbar-hide">
      <!-- Empty state -->
      <div
        v-if="!activeServices || !Object.keys(activeServices).length"
        class="h-full flex flex-col items-center justify-center text-center px-6"
      >
        <h3 class="text-sm font-medium text-white/70">No active services</h3>

        <p class="mt-1 text-xs text-white/35">
          Running micro services will appear here.
        </p>
      </div>

      <!-- App Groups -->
      <div
        v-for="(services, appName) in activeServices"
        :key="appName"
        class="space-y-2"
      >
        <!-- App Group Header -->
        <div class="flex items-center justify-between gap-2 px-1">
          <div
            class="w-10 h-10 shrink-0 rounded-xl bg-white/15 border border-white/10 flex items-center justify-center"
          >
            <!-- App Icon -->
            <img
              class="shrink-0 rounded-xl object-cover"
              :src="getAppIconUrl(appName, services)"
            />
          </div>

          <div class="min-w-0 flex-1">
            <h3 class="text-xs font-semibold truncate">
              {{ appName }}
            </h3>

            <p class="text-[11px] text-white/35">
              {{ services.length }}
              {{ services.length === 1 ? "service" : "services" }}
            </p>
          </div>

          <button
            class="p-1 border border-white/10 active:bg-white/20 disabled:bg-gray-400/10 text-red-400 rounded"
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
          class="p-3 rounded-2xl bg-white/5 border border-white/10"
        >
          <!-- Service Header -->
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-sm font-semibold truncate">
              {{ service.name }}
            </h3>

            <!-- Running Status -->
            <span
              v-if="service.status?.running"
              class="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Running
            </span>

            <span
              v-else-if="service.status?.completed"
              class="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-white/40 border border-white/10"
            >
              Completed
            </span>

            <span
              v-else
              class="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-400/10 text-amber-300 border border-amber-400/20"
            >
              Stopped
            </span>
          </div>

          <!-- App Info -->
          <div
            class="mt-3 space-y-1 p-2.5 rounded-xl bg-black/10 border border-white/5"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs text-white/40"> App Title </span>

              <span class="text-xs text-white/60 truncate">
                {{ service.app?.title }}
              </span>
            </div>

            <div class="flex items-center justify-between gap-2">
              <span class="text-xs text-white/40"> App Name </span>

              <span class="text-xs text-white/60 truncate">
                {{ service.app?.name }}
              </span>
            </div>

            <div class="flex items-center justify-between gap-2">
              <span class="text-xs text-white/40"> App ID </span>

              <span class="text-xs text-white/50 truncate max-w-[65%]">
                {{ service.app?.id }}
              </span>
            </div>

            <div
              v-if="service.app?.sudo"
              class="mt-2 flex items-center justify-between"
            >
              <span class="text-xs text-white/40"> Permission </span>

              <span
                class="px-2 py-0.5 rounded-md bg-secondary/20 border border-secondary/30 text-xs font-semibold"
              >
                Sudo
              </span>
            </div>
          </div>

          <!-- Process -->
          <div
            class="mt-2.5 p-2.5 rounded-xl bg-black/10 border border-white/5"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-medium text-white/60"> Process </span>

              <span
                v-if="service.process?.returncode !== null"
                class="text-xs text-white/35"
              >
                Exit {{ service.process.returncode }}
              </span>

              <span v-else class="text-xs text-emerald-300/70"> Active </span>
            </div>

            <p
              v-if="service.process?.cmd?.length"
              class="mt-2 text-[11px] leading-relaxed text-white/35 break-all"
            >
              {{ service.process.cmd.join(" ") }}
            </p>
          </div>

          <!-- Config -->
          <div v-if="service.config" class="mt-2.5 grid grid-cols-3 gap-1.5">
            <div class="px-2 py-2 rounded-xl bg-black/10 border border-white/5">
              <p class="text-[10px] text-white/30">Main</p>

              <p class="mt-0.5 text-xs text-white/55 truncate">
                {{ service.config.main || "—" }}
              </p>
            </div>

            <div class="px-2 py-2 rounded-xl bg-black/10 border border-white/5">
              <p class="text-[10px] text-white/30">Stdout</p>

              <p class="mt-0.5 text-xs text-white/55">
                {{ service.config.stdout ? "On" : "Off" }}
              </p>
            </div>

            <div class="px-2 py-2 rounded-xl bg-black/10 border border-white/5">
              <p class="text-[10px] text-white/30">Persistent</p>

              <p class="mt-0.5 text-xs text-white/55">
                {{ service.config.persistent ? "Yes" : "No" }}
              </p>
            </div>
          </div>

          <!-- Error -->
          <div
            v-if="service.process?.error"
            class="mt-2.5 px-3 py-2.5 rounded-xl bg-red-400/10 border border-red-400/20"
          >
            <p class="text-xs text-red-300/80 break-words">
              {{ service.process.error }}
            </p>
          </div>

          <!-- Footer -->
          <div
            class="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2"
          >
            <div class="flex items-center gap-1.5 text-xs text-white/40">
              <span>Started</span>
              <TimeStampRelative :timestamp="service.created_at" />
            </div>

            <button
              class="p-1 border border-white/10 active:bg-white/20 disabled:bg-gray-400/10 text-red-400 rounded"
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

  const processing = ref(true);

  const totalServices = computed(() => {
    return Object.values(activeServices.value).reduce(
      (total, services) => total + services.length,
      0
    );
  });

  function getAppIconUrl(appName, services) {
    return getAppPublicUrl(appName, services[0].app.icon);
  }

  async function fetchMicroServices() {
    processing.value = true;

    const { data, error } = await micro.listServices();

    processing.value = false;

    if (error) {
      console.error(error.detail);
      return;
    }

    activeServices.value = data || {};
  }

  async function removeAppServices(appName, serviceName) {
    processing.value = true;

    // Ignore errors and re-fetch
    await micro.removeAppServices(appName, serviceName);
    await fetchMicroServices();

    processing.value = false;
  }

  onMounted(fetchMicroServices);
</script>

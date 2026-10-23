<template>
  <Loading v-if="loading" class="text-white" />

  <div
    v-else
    class="flex flex-1 flex-col overflow-y-auto bg-linear-to-b from-slate-900/20 to-black/10 text-white"
  >
    <!-- Header -->
    <div class="border-b border-white/10 bg-white/10 px-3 py-2">
      <div class="flex min-w-0 items-center gap-3">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/15"
        >
          <span class="text-base font-bold">
            {{ info.user.name?.charAt(0)?.toUpperCase() }}
          </span>
        </div>

        <div class="min-w-0 flex-1">
          <h1 class="truncate text-base font-semibold text-white">
            {{ info.user.name }}
          </h1>
        </div>

        <div
          class="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1"
        >
          <span class="text-xs font-medium text-emerald-300">
            <TimeStampRelative :timestamp="info.created_at" />
          </span>
        </div>
      </div>
    </div>

    <!-- Session -->
    <div class="p-2">
      <div class="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <!-- Session ID -->
        <div class="flex items-center justify-between gap-2 px-3 py-2">
          <div class="min-w-0">
            <h3 class="text-xs font-medium text-white/80">Session ID</h3>
            <p class="truncate text-[11px] text-white/40">
              {{ revealID ? info.id : "Hidden" }}
            </p>
          </div>

          <button
            @click="revealID = !revealID"
            class="shrink-0 rounded-md border border-white/10 bg-white/10 px-2 py-1 text-[11px]"
          >
            {{ revealID ? "Hide" : "Reveal" }}
          </button>
        </div>

        <div class="border-t border-white/10"></div>

        <!-- Access Token -->
        <div class="flex items-center justify-between gap-2 px-3 py-2">
          <div class="min-w-0">
            <h3 class="text-xs font-medium text-white/80">Access Token</h3>
            <p class="truncate text-[11px] text-white/40">
              {{ revealAccessToken ? info.access_token : "••••••••••••••••" }}
            </p>
          </div>

          <button
            @click="revealAccessToken = !revealAccessToken"
            class="shrink-0 rounded-md border border-white/10 bg-white/10 px-2 py-1 text-[11px]"
          >
            {{ revealAccessToken ? "Hide" : "Reveal" }}
          </button>
        </div>
      </div>
    </div>
    <!-- Info Panels -->
    <div class="flex bg-white/10 p-2">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="box-border flex-1 rounded border border-transparent p-1 capitalize"
        :class="{ 'border-white/10 bg-white/10': tab === activeTab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <AppsInfo v-if="activeTab === 'apps'" :apps="info?.apps" />
    <MicroInfo v-else-if="activeTab === 'micro'" />
    <SessionsInfo v-else-if="activeTab === 'sessions'" />
  </div>
</template>

<script setup>
  import { ref, onBeforeMount, onUnmounted } from "vue";

  import { getSystem } from "@/kikx";

  import Loading from "@/components/Loading.vue";
  import TimeStampRelative from "@/components/utils/TimeStampRelative.vue";

  import AppsInfo from "./AppsInfo.vue";
  import MicroInfo from "./MicroInfo.vue";
  import SessionsInfo from "./SessionsInfo.vue";

  const system = getSystem();

  const info = ref(null);
  const loading = ref(true);
  let intervalId = null;

  const tabs = ["apps", "micro", "sessions"];
  const activeTab = ref("apps");

  const revealID = ref(false);
  const revealAccessToken = ref(false);

  async function fetchInfo() {
    try {
      info.value = await system.getClientInfo();
    } catch (err) {
      console.error("Failed to fetch info:", err);
    }
  }

  onBeforeMount(async () => {
    await fetchInfo(); // initial fetch
    loading.value = false;

    intervalId = setInterval(() => {
      fetchInfo();
    }, 3000);
  });

  onUnmounted(() => {
    clearInterval(intervalId);
  });
</script>

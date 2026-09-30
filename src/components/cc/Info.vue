<template>
  <Loading v-if="loading" class="text-white" />

  <div
    v-else
    class="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-slate-900/20 to-black/10 text-white"
  >
    <!-- Header -->
    <div class="px-3 py-3 bg-white/10 border-b border-white/10">
      <div class="flex items-center gap-3 min-w-0">
        <div
          class="w-10 h-10 shrink-0 rounded-xl bg-white/15 border border-white/10 flex items-center justify-center"
        >
          <span class="text-base font-bold">
            {{ info.user.name?.charAt(0)?.toUpperCase() }}
          </span>
        </div>

        <div class="min-w-0 flex-1">
          <h1 class="text-base font-semibold text-white truncate">
            {{ info.user.name }}
          </h1>

          <p class="text-xs text-white/50">Active Session</p>
        </div>

        <div
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20"
        >
          <span class="text-xs font-medium text-emerald-300">
            <TimeStampRelative :timestamp="info.created_at" />
          </span>
        </div>
      </div>
    </div>

    <!-- Session -->
    <section class="text-white">
      <div
        class="px-3 py-2.5 flex items-center justify-between bg-white/5 border-b border-white/10"
      >
        <div>
          <h2 class="text-sm font-semibold">Session</h2>

          <p class="text-xs text-white/40">Session information</p>
        </div>

        <div
          class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50"
        >
          SESSION
        </div>
      </div>

      <div class="p-2 space-y-1.5">
        <!-- Session ID -->
        <div
          class="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="min-w-0">
              <h3 class="text-sm font-medium">Session ID</h3>

              <p class="text-xs text-white/40 truncate">
                {{ revealID ? info.id : "Hidden" }}
              </p>
            </div>
          </div>

          <button
            @click="revealID = !revealID"
            class="shrink-0 px-3 py-1.5 rounded-lg bg-white/10 active:bg-white/20 border border-white/10 text-xs transition"
          >
            {{ revealID ? "Hide" : "Reveal" }}
          </button>
        </div>

        <!-- Access Token -->
        <div
          class="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="min-w-0">
              <h3 class="text-sm font-medium">Access Token</h3>

              <p class="text-xs text-white/40 truncate">
                {{ revealAccessToken ? info.access_token : "••••••••••••••••" }}
              </p>
            </div>
          </div>

          <button
            @click="revealAccessToken = !revealAccessToken"
            class="shrink-0 px-3 py-1.5 rounded-lg bg-white/10 active:bg-white/20 border border-white/10 text-xs transition"
          >
            {{ revealAccessToken ? "Hide" : "Reveal" }}
          </button>
        </div>
      </div>
    </section>

    <!-- Info Panels -->
    <div class="p-2 flex bg-white/10">
      <button
        v-for="tab in tabs"
        class="flex-1 p-1 capitalize rounded"
        :class="{ 'bg-white/10 border border-white/10': tab === activeTab }"
        @click="activeTab = tab"
        :key="tab"
      >
        {{ tab }}
      </button>
    </div>

    <AppsInfo v-if="activeTab === 'apps'" :apps="info?.apps" />
    <MicroInfo v-else-if="activeTab === 'micro'" />
  </div>
</template>

<script setup>
  import { ref, onBeforeMount, onUnmounted } from "vue";

  import { getSystem } from "@/kikx";

  import Loading from "@/components/Loading.vue";
  import TimeStampRelative from "@/components/utils/TimeStampRelative.vue";
  import ScrollingText from "@/components/ui/ScrollingText.vue";

  import AppsInfo from "./AppsInfo.vue";
  import MicroInfo from "./MicroInfo.vue";

  const system = getSystem();

  const info = ref(null);
  const loading = ref(true);
  let intervalId = null;

  const tabs = ["apps", "micro"];
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

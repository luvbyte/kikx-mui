<template>
  <Loading v-if="loading" class="text-white" />

  <div
    v-else
    class="flex-1 flex flex-col overflow-y-auto  bg-gradient-to-b from-slate-900/20 to-black/10 text-white"
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

    <!-- Apps -->
    <section class="flex-1 flex flex-col min-h-0 text-white">
      <div
        class="px-3 py-2.5 flex items-center justify-between bg-white/5 border-y border-white/10"
      >
        <div>
          <h2 class="text-sm font-semibold">Apps</h2>

          <p class="text-xs text-white/40">Connected applications</p>
        </div>

        <div
          class="min-w-7 h-7 px-2 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white/70"
        >
          {{ info.apps?.length || 0 }}
        </div>
      </div>

      <div class="p-2 flex-1 space-y-2 scrollbar-hide">
        <!-- Empty state -->
        <div
          v-if="!info.apps?.length"
          class="h-full flex flex-col items-center justify-center text-center px-6"
        >
          <div
            class="w-12 h-12 mb-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"
          >
            <span class="text-xl text-white/30">◇</span>
          </div>

          <h3 class="text-sm font-medium text-white/70">No apps connected</h3>

          <p class="mt-1 text-xs text-white/35">
            Connected applications will appear here.
          </p>
        </div>

        <!-- App Card -->
        <div
          v-for="app in info.apps"
          :key="app.id"
          class="group p-3 rounded-2xl bg-white/5 border border-white/10 transition"
        >
          <!-- App Header -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-2.5 min-w-0">
              <div
                class="w-10 h-10 shrink-0 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center"
              >
                <span class="text-sm font-bold">
                  {{ app.title?.charAt(0)?.toUpperCase() }}
                </span>
              </div>

              <div class="min-w-0">
                <h3 class="text-sm font-semibold truncate">
                  {{ app.title }}
                </h3>

                <p class="text-xs text-white/40 truncate">
                  {{ app.name }}
                </p>
              </div>
            </div>

            <span
              v-if="app.sudo"
              class="shrink-0 px-2.5 py-1 rounded-md bg-secondary/20 border border-secondary/30 text-xs font-semibold"
            >
              Sudo
            </span>
          </div>

          <!-- App ID -->
          <button
            @click="toggleAppIDReveal(app.id)"
            class="mt-3 w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-black/10 border border-white/5 transition text-left"
          >
            <div class="min-w-0">
              <h3 class="text-xs font-medium text-white/60">App ID</h3>

              <p class="mt-0.5 text-xs text-white/50 truncate">
                {{
                  revealedAppNames.includes(app.id) ? app.id : "••••••••••••"
                }}
              </p>
            </div>

            <span class="shrink-0 text-xs text-white/40">
              {{ revealedAppNames.includes(app.id) ? "Hide" : "Reveal" }}
            </span>
          </button>

          <!-- Footer -->
          <div
            class="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2"
          >
            <div class="flex items-center gap-1.5 text-xs text-white/40">
              <span>Started</span>
              <TimeStampRelative :timestamp="app.created_at" />
            </div>

            <div
              v-if="app.connection.connected"
              class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Connected
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
  import { ref, onBeforeMount, onUnmounted } from "vue";

  import { getSystem } from "@/kikx";

  import Loading from "@/components/Loading.vue";
  import TimeStampRelative from "@/components/utils/TimeStampRelative.vue";
  import ScrollingText from "@/components/ui/ScrollingText.vue";

  const system = getSystem();

  const info = ref(null);
  const loading = ref(true);
  let intervalId = null;

  const revealID = ref(false);
  const revealAccessToken = ref(false);

  const revealedAppNames = ref([]);

  function toggleAppIDReveal(appID) {
    const index = revealedAppNames.value.indexOf(appID);

    if (index === -1) {
      // Not revealed → add it
      revealedAppNames.value.push(appID);
    } else {
      // Already revealed → remove it
      revealedAppNames.value.splice(index, 1);
    }
  }

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

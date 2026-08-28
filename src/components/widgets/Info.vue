<template>
  <Loading v-if="loading" class="text-white" />

  <div v-else class="flex-1 flex flex-col overflow-hidden">
    <!-- User Info -->
    <div
      class="p-2 flex justify-between items-center bg-white/20 font-semibold"
    >
      <h1 class="font-semibold text-white">{{ info.user.name }}</h1>
      <div class="text-sm text-white font-heading">
        {{ info.user.username }}
      </div>
    </div>

    <!-- Client Info -->
    <div class="flex flex-col text-white">
      <div
        class="p-2 flex justify-center items-center bg-white/30 border-y border-white/40"
      >
        <h1 class="font-semibold">Session</h1>
      </div>
      <!-- Up Time -->
      <div
        class="p-1 flex justify-between items-center bg-white/20 font-semibold"
      >
        <h1 class="text-white">Uptime</h1>
        <div class="text-sm shadow-lg">
          <TimeStampRelative :timestamp="info.created_at" />
        </div>
      </div>
      <!-- ID -->
      <div
        class="px-1 flex justify-center items-center bg-white/20 whitespace-nowrap"
      >
        <button
          @click="revealID = !revealID"
          class="text-sm bg-white/20 p-0.5 px-3 rounded-lg"
        >
          {{ revealID ? info.id : "Click to reveal session ID" }}
        </button>
      </div>
      <!-- Access Token -->
      <div
        class="p-1 flex justify-center items-center gap-2 bg-white/20 whitespace-nowrap"
      >
        <button
          @click="revealAccessToken = !revealAccessToken"
          class="text-sm bg-white/20 p-0.5 px-3 rounded-lg"
        >
          {{
            revealAccessToken
              ? info.access_token
              : "Click to reveal Access Token"
          }}
        </button>
      </div>
    </div>

    <!-- Apps Info -->
    <div class="flex-1 flex flex-col text-white overflow-y-auto">
      <div
        class="p-2 flex justify-center items-center bg-white/30 border-y border-white/40"
      >
        <h1 class="font-semibold">Apps</h1>
      </div>

      <div class="p-2 flex-1 flex flex-col overflow-y-auto gap-2 scrollbar-hide">
        <div
          v-for="app in info.apps"
          class="p-2 border-2 rounded-lg border-white/20 bg-white/20"
        >
          <div class="flex items-center justify-between">
            <h1 class="text-lg font-bold">{{ app.title }}</h1>
            <div
              class="text-sm p-0.5 px-3 rounded-lg"
              :class="app.sudo ? 'bg-secondary' : 'bg-white/20'"
            >
              {{ app.name }}
            </div>
          </div>

          <div class="divider m-0"></div>

          <div
            class="px-2 flex items-center justify-center text-sm bg-white/20 p-0.5 px-3 rounded-lg"
          >
            <button @click="toggleAppIDReveal(app.id)" class="text-sm">
              {{
                revealedAppNames.includes(app.id)
                  ? app.id
                  : "Click to reveal App ID"
              }}
            </button>
          </div>

          <div class="mt-2 flex justify-between items-center text-sm">
            <div class="flex items-center gap-1">
              <p>Started</p>
              <TimeStampRelative :timestamp="app.created_at" />
            </div>

            <div
              v-if="app.connection.connected"
              class="text-sm bg-green-400/80 p-0.5 px-3 rounded-lg"
            >
              WS Connected
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onBeforeMount, onUnmounted } from "vue";

  import { getSystem } from "@/kikx";

  import Loading from "@/components/Loading.vue";
  import TimeStampRelative from "@/components/utils/TimeStampRelative.vue";

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

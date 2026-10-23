<template>
  <section class="flex min-h-0 flex-1 flex-col text-white">
    <div
      class="flex items-center justify-between gap-2 border-y border-white/10 bg-white/5 px-3 py-2.5"
    >
      <div>
        <h2 class="text-sm font-semibold">Apps</h2>

        <p class="text-xs text-white/40">Running applications</p>
      </div>

      <div
        class="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/10 px-2 text-xs font-semibold text-white/70"
      >
        {{ apps?.length || 0 }}
      </div>
    </div>

    <div class="scrollbar-hide flex-1 space-y-2 overflow-y-auto p-2">
      <!-- Empty state -->
      <div
        v-if="!apps?.length"
        class="flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <h3 class="text-sm font-medium text-white/70">No running apps</h3>

        <p class="mt-1 text-xs text-white/35">Running applications will appear here.</p>
      </div>

      <!-- App Card -->
      <div
        v-for="app in apps || []"
        :key="app.id"
        class="group rounded-2xl border border-white/10 bg-white/5 p-3 transition"
      >
        <!-- App Header -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/15"
            >
              <!-- App Icon -->
              <img
                class="shrink-0 rounded-xl object-cover"
                :src="getAppPublicUrl(app.name, app.manifest.icon)"
              />
            </div>

            <div class="flex min-w-0 items-center gap-2.5">
              <div class="min-w-0">
                <h3 class="truncate text-sm font-semibold">
                  {{ app.title }}
                </h3>

                <p class="truncate text-xs text-white/40">
                  {{ app.name }}
                </p>
              </div>
            </div>
          </div>
          <span
            v-if="app.sudo"
            class="bg-secondary/20 border-secondary/30 shrink-0 rounded-md border px-2.5 py-1 text-xs font-semibold"
          >
            Sudo
          </span>
        </div>

        <!-- App ID -->
        <button
          @click="toggleAppIDReveal(app.id)"
          class="mt-3 flex w-full items-center justify-between gap-2 rounded-xl border border-white/5 bg-black/10 px-3 py-2.5 text-left transition"
        >
          <div class="min-w-0">
            <h3 class="text-xs font-medium text-white/60">App ID</h3>

            <p class="mt-0.5 truncate text-xs text-white/50">
              {{ revealedAppNames.includes(app.id) ? app.id : "••••••••••••" }}
            </p>
          </div>

          <span class="shrink-0 text-xs text-white/40">
            {{ revealedAppNames.includes(app.id) ? "Hide" : "Reveal" }}
          </span>
        </button>

        <!-- Footer -->
        <div class="mt-3 flex items-center justify-between gap-2 border-t border-white/5 pt-2.5">
          <div class="flex items-center gap-1.5 text-xs text-white/40">
            <span>Started</span>
            <TimeStampRelative :timestamp="app.created_at" />
          </div>

          <div
            v-if="app.connection.connected"
            class="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Connected
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { ref } from "vue";

  import { getAppPublicUrl } from "@/kikx/config";
  import TimeStampRelative from "@/components/utils/TimeStampRelative.vue";

  defineProps({
    apps: {
      type: Array,
      required: false,
    },
  });

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
</script>

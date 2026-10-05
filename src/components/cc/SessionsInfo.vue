<template>
  <section class="flex-1 flex flex-col min-h-0 text-white">
    <!-- Header -->
    <div
      class="px-3 py-2.5 flex justify-between items-center gap-2 bg-white/5 border-y border-white/10"
    >
      <div>
        <h2 class="text-sm font-semibold">Sessions</h2>

        <p class="text-xs text-white/40">Running Sessions</p>
      </div>

      <div
        class="min-w-7 h-7 px-2 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white/70"
      >
        {{ sessions.length }}
      </div>
    </div>

    <!-- Content -->
    <div v-if="!processing" class="p-2 flex-1 overflow-y-auto scrollbar-hide">
      <!-- Empty state -->
      <div
        v-if="sessions.length === 0"
        class="h-full flex items-center justify-center text-sm text-white/40"
      >
        No sessions
      </div>

      <!-- Sessions -->
      <div
        v-for="session in sessions"
        :key="session.id"
        class="session-card flex items-center justify-between gap-3 p-3 mb-2 rounded-lg bg-white/10 shadow-sm border border-white/10"
      >
        <!-- Info -->
        <div class="min-w-0 flex flex-col">
          <!-- Name + status -->
          <div class="flex gap-1 items-center min-w-0">
            <span class="font-semibold text-sm text-white truncate">
              {{ session.name || `Session ${session.id}` }}
            </span>

            <!-- Inactive icon -->
            <svg
              v-if="!session.active"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              aria-label="Inactive session"
              role="img"
              class="shrink-0 text-white/50"
            >
              <path d="M0 0h24v24H0z" fill="none" />

              <path
                fill="currentColor"
                d="M19.8 22.6L17.15 20H6.5q-2.3 0-3.9-1.6T1 14.5q0-1.92 1.19-3.42q1.19-1.51 3.06-1.93q.08-.2.15-.39q.1-.19.15-.41L1.4 4.2l1.4-1.4l18.4 18.4M6.5 18h8.65L7.1 9.95q-.05.28-.07.55q-.03.23-.03.5h-.5q-1.45 0-2.47 1.03Q3 13.05 3 14.5T4.03 17q1.02 1 2.47 1m15.1.75l-1.45-1.4q.43-.35.64-.81T21 15.5q0-1.05-.73-1.77q-.72-.73-1.77-.73H17v-2q0-2.07-1.46-3.54Q14.08 6 12 6q-.67 0-1.3.16q-.63.17-1.2.52L8.05 5.23q.88-.6 1.86-.92Q10.9 4 12 4q2.93 0 4.96 2.04Q19 8.07 19 11q1.73.2 2.86 1.5q1.14 1.28 1.14 3q0 1-.37 1.81q-.38.84-1.03 1.44m-6.77-6.72"
              />
            </svg>

            <!-- Active indicator -->
            <span
              v-else
              class="w-1.5 h-1.5 shrink-0 rounded-full bg-emerald-400"
              title="Active session"
            ></span>
          </div>

          <!-- ID -->
          <span class="text-xs text-white/70"> ID: {{ session.id }} </span>

          <!-- Apps -->
          <span class="text-xs text-white/70">
            Apps: {{ session.apps_count }}
          </span>

          <!-- Created -->
          <div class="flex items-center gap-1 text-xs text-white/70">
            <span>Created:</span>

            <TimeStampRelative :timestamp="session.created_at" />
          </div>
        </div>

        <!-- Close -->
        <button
          type="button"
          class="close-session w-7 h-7 shrink-0 flex items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20 disabled:opacity-40"
          title="Close session"
          :aria-label="`Close ${session.name || `session ${session.id}`}`"
          :disabled="closingSessions.has(session.id)"
          @click="closeSession(session.id)"
        >
          <span v-if="!closingSessions.has(session.id)">✕</span>

          <span v-else class="loading loading-spinner loading-xs"></span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-else
      class="flex-1 flex items-center justify-center text-sm text-white/40"
    >
      Loading sessions...
    </div>
  </section>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { getSystem } from "@/kikx";

  import TimeStampRelative from "@/components/utils/TimeStampRelative.vue";

  const system = getSystem();

  const processing = ref(true);
  const sessions = ref([]);
  const closingSessions = ref(new Set());

  async function fetchSessions() {
    processing.value = true;

    try {
      const { data, error } = await system.request("info/sessions");

      if (error) {
        console.error(error.detail);
        return;
      }

      sessions.value = Array.isArray(data?.sessions)
        ? data.sessions.filter(session => session.id !== data.sid)
        : [];
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      processing.value = false;
    }
  }

  async function closeSession(sessionId) {
    const id = String(sessionId ?? "").trim();

    if (!id || closingSessions.value.has(id)) {
      return;
    }

    closingSessions.value.add(id);

    try {
      const { error } = await system.request("info/session-close", {
        params: {
          session_id: id
        }
      });

      if (error) {
        console.error("Failed to close session:", error.detail);
        return;
      }

      // Remove immediately for a responsive UI.
      sessions.value = sessions.value.filter(
        session => String(session.id) !== id
      );

      // Sync with server.
      await fetchSessions();
    } catch (error) {
      console.error("Unexpected error while closing session:", error);
    } finally {
      closingSessions.value.delete(id);
    }
  }

  onMounted(fetchSessions);
</script>

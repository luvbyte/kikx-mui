<script setup>
  import { computed } from "vue";

  import { useAlertsStore } from "@/stores/alert";

  import AppAlert from "@/components/app/AppAlert.vue";

  const props = defineProps({
    onAlertClick: {
      type: Function,
      required: true
    }
  });
  const emit = defineEmits(["close"]);

  const alerts = useAlertsStore();

  const sortedAlerts = computed(() => {
    const priorityOrder = {
      high: 0,
      normal: 1,
      less: 2
    };

    return [...alerts.alerts].sort((a, b) => {
      // 1. Sticky always comes first
      if (a.sticky && !b.sticky) return -1;
      if (!a.sticky && b.sticky) return 1;

      // 2. Then priority within sticky/non-sticky
      const priorityDiff =
        priorityOrder[a.priority] - priorityOrder[b.priority];

      if (priorityDiff !== 0) return priorityDiff;

      // 3. Newest first
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  });

  function handleAlertClick(appAlert) {
    props.onAlertClick(appAlert);
  }

  function closeAlert(appAlert) {
    alerts.removeAlert(appAlert.uid);
  }

  function closeAllAlerts() {
    alerts.clearAlerts(false);
  }
</script>

<template>
  <div
    @click.stop
    class="flex-1 flex flex-col rounded-2xl border-2 border-white/60 overflow-hidden"
  >
    <!-- Header -->
    <div
      class="px-2 py-1 border-b border-white/20 bg-pink-400/60 flex justify-between items-center shadow-lg"
    >
      <div class="flex gap-2 items-center justify-center p-2">
        <h1 class="text-white font-semibold tracking-wide">Alerts</h1>
        <h1
          v-if="alerts.alerts.length > 0"
          class="badge badge-sm opacity-80 shadow-lg font-semibold"
        >
          {{ alerts.alerts.length }}
        </h1>
      </div>
      <div class="flex items-center gap-2">
        <button @click="closeAllAlerts" class="btn btn-xs opacity-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M4 17q-.425 0-.712-.288T3 16t.288-.712T4 15h12q.425 0 .713.288T17 16t-.288.713T16 17zm2-4q-.425 0-.712-.288T5 12t.288-.712T6 11h12q.425 0 .713.288T19 12t-.288.713T18 13zm2-4q-.425 0-.712-.288T7 8t.288-.712T8 7h12q.425 0 .713.288T21 8t-.288.713T20 9z"
            />
          </svg>
        </button>
        <button @click="emit('close')" class="btn btn-xs opacity-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Scrollable Content -->
    <TransitionGroup
      name="alert"
      tag="div"
      class="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-hide scroll-smooth"
    >
      <AppAlert
        v-for="appAlert in sortedAlerts"
        :key="appAlert.uid"
        :appAlert="appAlert"
        @close="closeAlert"
        @click="handleAlertClick(appAlert)"
      />
    </TransitionGroup>

    <!-- Footer -->
    <div class="p-4 border-t border-white/20 bg-pink-400/60"></div>
  </div>
</template>

<style scoped>
  .alert-enter-active,
  .alert-leave-active {
    transition: all 0.3s ease;
  }

  .alert-move {
    transition: transform 0.3s ease;
  }

  .alert-leave-to {
    opacity: 0;
    transform: translateX(-80px) scale(0.95);
  }
</style>

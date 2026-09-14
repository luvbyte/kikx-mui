<script setup>
  import { computed } from "vue";

  import { getUrl } from "@/kikx/config";
  import { sleep } from "@/kikx/utils";
  import { useAlertsStore } from "@/stores/alert";

  // Props
  const props = defineProps({
    prefix: {
      type: String,
      required: true
    }
  });

  const emit = defineEmits(["close"]);

  // Alerts Store
  const alerts = useAlertsStore();

  const currentAlert = computed(() => {
    return alerts.pendingAlerts[0] || null;
  });

  // Alert Class
  const alertTypeClasses = {
    success: "bg-success/60 text-white",
    error: "bg-error/60 text-white",
    warning: "bg-warning/60 text-white",
    info: "bg-black/60",
    default: ""
  };

  function getClass(alert) {
    if (!alert?.type) return alertTypeClasses.default;
    return alertTypeClasses[alert.type] || alertTypeClasses.default;
  }

  function getTickerStyle(alert) {
    if (!alert) return { animationDuration: "8s" };

    const text = props.prefix + "" + (alert.label || alert.message);
    const length = text.length;

    const baseSpeed = 0.09;
    let duration = length * baseSpeed;

    if (length < 30) duration *= 0.7;

    duration = Math.min(Math.max(duration, 4), 18);

    return {
      animationDuration: duration + "s"
    };
  }

  // Move to next alert
  function goNext() {
    const alert = currentAlert.value;
    if (!alert) return;

    // After removal, the next alert shifts into same index.
    alerts.alertComplete(alert.uid);

    if (alerts.pendingAlerts.length === 0) {
      emit("close");
    }
  }

  async function handleAnimationEnd() {
    goNext();
  }

  function skipAlert() {
    goNext();
  }
</script>

<template>
  <div
    v-if="currentAlert"
    class="select-none fscreen flex items-center font-semibold overflow-hidden whitespace-nowrap transition-colors duration-600"
    :class="getClass(currentAlert)"
    @click="skipAlert"
    v-longpress="() => emit('close')"
  >
    <div
      class="ticker flex items-center gap-1"
      :style="getTickerStyle(currentAlert)"
      :key="currentAlert.uid"
      @animationend="handleAnimationEnd"
    >
      <pre class="text-lg">{{ prefix }}</pre>
      <img
        :src="getUrl(currentAlert.icon)"
        class="h-4 w-4 rounded aspect-square"
      />
      <p>{{ currentAlert.label || currentAlert.message }}</p>
    </div>
  </div>
</template>

<style scoped>
  .ticker {
    padding-left: 100%;
    animation-name: tickerMove;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }

  @keyframes tickerMove {
    from {
      transform: translateX(0%);
    }
    to {
      transform: translateX(-100%);
    }
  }
</style>

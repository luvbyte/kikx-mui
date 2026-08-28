<template>
  <Transition name="fade-scale">
    <div
      v-if="loaded"
      class="fscreen flex flex-col bg-black/80 text-white overflow-hidden relative"
    >
      <!-- Heading -->
      <div class="p-2 py-3 flex justify-between bg-orange-400/80">
        <h1 class="text-lg font-semibold">MUI Settings</h1>
        <button @click="close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              fill="currentColor"
              d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
            />
          </svg>
        </button>
      </div>

      <!-- Sections -->
      <div class="flex-1 flex flex-col overflow-y-auto">
        <!-- App Section -->
        <Section label="App">
          <!-- Icons Style  -->
          <SegmentedSelect
            v-model="uiConfig.state.iconsStyle"
            label="App Icon Style"
            description="Choose the style for app icons."
            :options="[
              { value: 'solid', label: 'Solid' },
              { value: 'wrap', label: 'Wrap' },
              { value: 'icon', label: 'Icon' }
            ]"
          />
          <!-- Splash  -->
          <SegmentedSelect
            v-model="uiConfig.state.splash"
            label="Launch Animation"
            description="Choose the animation shown when the app starts."
            :options="[
              { value: 'static', label: 'Static' },
              { value: 'pulse', label: 'Pulse' },
              { value: 'hide', label: 'Hide' }
            ]"
          />
          <!-- Active animation -->
          <Selection
            v-model="uiConfig.state.appIconFocusAnimation"
            label="App Icon Animation"
            description="Choose app icon animation on focus"
            :options="animationOptions"
          />
        </Section>

        <!-- Statusbar -->
        <Section label="Statusbar & Navigation">
          <!-- Block Alerts -->
          <ToggleSwitch
            v-model="uiConfig.state.blockAlerts"
            label="Block Alerts"
          />
          <!-- Network Icon -->
          <ToggleSwitch
            v-model="uiConfig.state.networkIcon"
            label="Network Icon"
          />
          <!-- Network Icon -->
          <ToggleSwitch
            v-model="uiConfig.state.navbar"
            label="Navigation Bar"
          />
          <!-- Battery Style -->
          <SegmentedSelect
            v-model="uiConfig.state.batteryIcon"
            label="Battery Icon Style"
            description="Choose the battery icon style."
            :options="[
              { value: 'box', label: 'Box' },
              { value: 'circle', label: 'Circle' },
              { value: 'hide', label: 'Hide' }
            ]"
          />
          <!-- Battery Style -->
          <SegmentedSelect
            v-model="uiConfig.state.navLayout"
            label="Navigation Layout"
            description="Choose the navigation button layout."
            :options="[
              { value: 'normal', label: 'Normal' },
              { value: 'reverse', label: 'Reverse' }
            ]"
          />
        </Section>

        <!-- Sound & Vibration -->
        <Section label="Sound & Vibration">
          <!-- Alert Sound -->
          <ToggleSwitch v-model="isSoundOn" label="Alerts Sound" />
          <!-- Haptic Feedback -->
          <SegmentedSelect
            v-model="uiConfig.state.haptic"
            @update:modelValue="haptic"
            label="Haptic Feedback"
            description="Feel a subtle vibration when interacting with controls."
            :options="[
              { value: 'soft', label: 'Soft' },
              { value: 'crisp', label: 'Crisp' },
              { value: 'off', label: 'Off' }
            ]"
          />
        </Section>
      </div>
    </div>
  </Transition>
</template>

<script setup>
  import { ref, onMounted, computed } from "vue";
  import { useUIConfig } from "@/stores/kikx";

  import Section from "@/components/ui/Section.vue";
  import SegmentedSelect from "@/components/ui/SegmentedSelect.vue";
  import ToggleSwitch from "@/components/ui/ToggleSwitch.vue";
  import Selection from "@/components/ui/Selection.vue";

  import { haptic } from "@/kikx/vibrate";
  import { playSound } from "@/kikx/sound";

  const emit = defineEmits(["close"]);

  const uiConfig = useUIConfig();
  const loaded = ref(false);

  const isSoundOn = computed({
    get: () => !uiConfig.state.isSilent,
    set: value => {
      uiConfig.state.isSilent = !value;
    }
  });

  function close() {
    emit("close");
  }

  const animationOptions = [
    { label: "Jello", value: "jello" },
    { label: "Fade In", value: "fadeIn" },
    { label: "Pulse", value: "pulse" },
    { label: "Zoom In", value: "zoomIn" },
    { label: "Rubber Band", value: "rubberBand" },
    { label: "Flip", value: "flip" },
    { label: "Tada", value: "tada" },
    { label: "Wobble", value: "wobble" }
  ];

  onMounted(() => {
    setTimeout(() => {
      loaded.value = true;
    }, 200);
  });
</script>

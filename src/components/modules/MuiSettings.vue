<template>
  <div class="fscreen flex flex-col text-white overflow-hidden relative">
    <!-- Sections -->
    <div class="flex-1 flex flex-col overflow-y-auto">
      <!-- App Section -->
      <Section
        label="App"
        description="Customize the app's appearance and launch behavior."
      >
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
      <Section
        label="Statusbar & Navigation"
        description="Configure status bar indicators and navigation behavior."
      >
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
        <ToggleSwitch v-model="uiConfig.state.navbar" label="Navigation Bar" />
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

        <!-- Alert Prefix -->
        <Input
          v-model="uiConfig.state.alertSliderPrefix"
          placeholder="✨"
          label="Alert Slider Prefix"
          description="Add an emoji or text prefix to your alert slider"
        />
      </Section>

      <!-- Display -->
      <Section
        label="Display & Effects"
        description="Customize visual effects and screen appearance"
      >
        <!-- Sprinkle Style -->
        <Selection
          v-model="uiConfig.state.touchSprinkle"
          label="Touch Sprinkle"
          description="Add a subtle particle burst when tapping the screen"
          :options="particleColors"
        />
        <!-- Snow particles Style -->
        <Selection
          v-model="uiConfig.state.snowParticles"
          label="Snow Particles"
          description="Background snow particles"
          :options="particleColors"
        />
      </Section>

      <!-- Sound & Vibration -->
      <Section
        label="Sound & Vibration"
        description="Control audio alerts and haptic feedback."
      >
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

      <!-- Advance -->
      <Section label="Advance Options" description="Mui advance Options">
        <!-- App module replace -->
        <ToggleSwitch
          v-model="uiConfig.state.autoHideAppCSwitch"
          label="Auto hide App-Control"
          description="Hide app control on home to apps switching"
        />
        <!-- App module replace -->
        <ToggleSwitch
          v-model="uiConfig.state.useModuleReplace"
          label="Allow module replace"
          description="Allow same app module replacing instead of rejecting"
        />
        <!-- App Actions -->
        <ToggleSwitch
          v-model="uiConfig.state.enableAppActions"
          label="Allow app actions"
          description="Allow app actions (share, wallpaper, theme)"
        />
      </Section>
    </div>
  </div>
</template>

<script setup>
  import { computed } from "vue";
  import { useUIConfig } from "@/stores/kikx";

  import Section from "@/components/ui/Section.vue";
  import SegmentedSelect from "@/components/ui/SegmentedSelect.vue";
  import ToggleSwitch from "@/components/ui/ToggleSwitch.vue";
  import Selection from "@/components/ui/Selection.vue";
  import Input from "@/components/ui/Input.vue";

  import { haptic } from "@/kikx/vibrate";
  import { playSound } from "@/kikx/sound";

  const uiConfig = useUIConfig();

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
    { label: "Wobble", value: "wobble" },
    { label: "FlipInX", value: "flipInX" },
    { label: "Swing", value: "swing" }
  ];
  const particleColors = [
    { value: "white", label: "White" },
    { value: "rainbow", label: "Rainbow" },
    { value: "fire", label: "Fire" },
    { value: "ocean", label: "Ocean" },
    { value: "candy", label: "Candy" },
    { value: "neon", label: "Neon" },
    { value: "gold", label: "Gold" },
    { value: "ice", label: "Ice" },
    { value: "sunset", label: "Sunset" },
    { value: "purple", label: "Purple" },
    { value: "emerald", label: "Emerald" },
    { value: "none", label: "Off" }
  ];
</script>

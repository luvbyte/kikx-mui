<template>
  <Transition name="fade-scale" @after-leave="emit('close')">
    <div
      v-if="showPanel"
      class="fscreen relative flex flex-col overflow-hidden bg-black/80 text-white"
    >
      <!-- Heading -->
      <div class="flex justify-between bg-orange-400/80 p-2 py-3">
        <h1 class="text-lg font-semibold">Settings</h1>
        <button @click="handleClose">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              fill="currentColor"
              d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
            />
          </svg>
        </button>
      </div>

      <div class="flex items-center bg-orange-400/40">
        <button
          v-for="(tab, index) in tabs"
          class="flex-1 p-2 uppercase transition-colors"
          :class="{ 'bg-orange-400/40': activeTab === index }"
          @click="activeTab = index"
        >
          {{ tab }}
        </button>
      </div>

      <div class="flex flex-1 flex-col overflow-y-auto bg-white/10">
        <MuiSettings v-show="activeTab === 0" />
        <KikxSettings v-show="activeTab === 1" />
      </div>
    </div>
  </Transition>
</template>

<script setup>
  import { ref, onMounted } from "vue";

  import MuiSettings from "@/components/modules/MuiSettings.vue";
  import KikxSettings from "@/components/modules/KikxSettings.vue";

  const emit = defineEmits(["close"]);

  const tabs = ["mui", "kikx"];

  const showPanel = ref(false);
  const activeTab = ref(0);

  function handleClose() {
    showPanel.value = false;
  }

  onMounted(() => {
    setTimeout(() => {
      showPanel.value = true;
    }, 200);
  });
</script>

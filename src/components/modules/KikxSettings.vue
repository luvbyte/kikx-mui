<template>
  <div class="fscreen flex flex-col overflow-y-auto">
    <!-- Loading -->
    <Loading v-if="processing" />
    <!---->
    <DynamicForm v-else :data="configData" @submit="onSave" @reset="reset" />

    <Alert
      v-if="showResetConfirm"
      message="Reset settings to defaults?"
      @onResponse="onResponse"
    />
  </div>
</template>

<script setup>
  import { ref, onBeforeMount } from "vue";

  import { getSystem } from "@/kikx";

  import DynamicForm from "@/components/ui/DynamicForm.vue";
  import Loading from "@/components/Loading.vue";
  import Alert from "@/components/ui/Alert.vue";

  const system = getSystem();

  const processing = ref(true);
  const configData = ref(null);

  const showResetConfirm = ref(false);

  async function fetchSettings(reset = false) {
    processing.value = true;

    const { data, error } = await system.getKikxConfig(reset);

    if (error) {
      console.error(error);
      return;
    }

    configData.value = data;

    processing.value = false;
  }

  function onResponse(yes) {
    showResetConfirm.value = false;

    if (!yes) return;
    fetchSettings(true);
  }

  function reset() {
    if (processing.value) return;

    showResetConfirm.value = true;
  }

  async function onSave(config) {
    if (processing.value) return;

    processing.value = true;

    await system.updatekikxConfig(config);
    await fetchSettings();
  }

  onBeforeMount(fetchSettings);
</script>

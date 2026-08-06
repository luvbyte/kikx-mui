import { ref } from "vue";
import { defineStore } from "pinia";

export const useErrorStore = defineStore("errorStore", () => {
  // Alert messages list
  const errorStack = ref([]);

  // Raise Error
  function raiseError(message, type = "info", title = null) {
    errorStack.value.push({
      message: message?.message ?? String(message),
      title,
      type
    });
  }

  // Get recent error message
  function getErrorMessage(index = -1) {
    return errorStack.value.at(index);
  }

  // Close erroe by index or recent error
  function closeError(index = -1) {
    errorStack.value.splice(index, 1);
  }

  // Clear all errors
  function clearErrors() {
    errorStack.value.length = 0;
  }

  return {
    errorStack,
    raiseError,
    getErrorMessage,
    closeError,
    clearErrors
  };
});

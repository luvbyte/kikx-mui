<script setup>
  import { computed, reactive, toRaw } from "vue";

  const props = defineProps({
    data: {
      type: Object,
      required: true
    }
  });

  const fields = props.data.schema;
  const config = reactive(props.data.config);

  const emit = defineEmits(["update:modelValue", "submit", "reset"]);
  // const emit = defineEmits(["submit", "reset"]);

  const normalizedSections = computed(() =>
    Object.entries(fields).map(([sectionKey, section]) => ({
      key: sectionKey,
      ...section,
      fields: Object.entries(section.fields || {}).map(([fieldKey, field]) => ({
        ...field,
        key: fieldKey // Automatically injects or enforces the key from the object property name
      }))
    }))
  );

  const getFieldValue = (sectionKey, field) => {
    const section = config?.[sectionKey];
    if (section && field.key in section) {
      return section[field.key];
    }
    return field.default ?? (field.type === "toggle" ? [] : "");
  };

  const updateField = (sectionKey, fieldKey, value) => {
    // Ensure the section object exists
    if (!config[sectionKey]) {
      config[sectionKey] = {};
    }

    // Mutate the value directly so the reactive reference updates
    config[sectionKey][fieldKey] = value;

    // Emit the exact updated reference back to the parent
    // emit("update:modelValue", { ...config });
  };

  const updateValue = (sectionKey, field, event) => {
    let value = event.target.value;

    if (field.type === "number" || field.type === "range") {
      value = value === "" ? "" : Number(value);
    }

    if (field.type === "checkbox") {
      value = event.target.checked;
    }

    updateField(sectionKey, field.key, value);
  };

  const toggleOption = (sectionKey, field, option) => {
    const section = config?.[sectionKey] || {};
    const current = Array.isArray(section[field.key])
      ? [...section[field.key]]
      : [];

    const index = current.indexOf(option.value);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(option.value);
    }

    updateField(sectionKey, field.key, current);
  };

  const isSelected = (sectionKey, fieldKey, optionValue) => {
    const value = config?.[sectionKey]?.[fieldKey];
    return Array.isArray(value) && value.includes(optionValue);
  };

  const submit = () => {
    emit("submit", toRaw(config));
  };
</script>

<template>
  <form
    class="fscreen flex flex-col overflow-y-auto gap-2"
    @submit.prevent="submit"
  >
    <div class="flex-1 flex flex-col overflow-y-auto">
      <!-- Sections -->

      <section
        v-for="section in normalizedSections"
        :key="section.key"
        class="flex flex-col pb-2"
      >
        <!-- Section heading -->
        <div class="bg-orange-400/40 p-2">
          <h3 class="text-base font-heading text-white">
            {{ section.label }}
          </h3>

          <p v-if="section.description" class="mt-1 text-xs text-white/50">
            {{ section.description }}
          </p>
        </div>

        <!-- Fields inside section -->
        <div v-for="field in section.fields" :key="field.key" class="px-2 py-1">
          <!-- Text -->
          <div v-if="field.type === 'text'" class="flex flex-col gap-1">
            <label
              v-if="field.label"
              class="block text-sm text-white font-heading"
            >
              {{ field.label }}

              <span v-if="field.required" class="text-red-400"> * </span>
            </label>

            <p v-if="field.description" class="text-xs text-white/60">
              {{ field.description }}
            </p>

            <input
              type="text"
              :value="getFieldValue(section.key, field)"
              :disabled="field.disabled"
              :required="field.required"
              class="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-green-400/60 focus:ring-1 focus:ring-green-400/30 disabled:cursor-not-allowed disabled:opacity-50"
              @input="updateValue(section.key, field, $event)"
            />
          </div>

          <!-- Number -->
          <div v-else-if="field.type === 'number'" class="flex flex-col gap-1">
            <label class="block text-sm text-white font-heading">
              {{ field.label }}

              <span v-if="field.required" class="text-red-400"> * </span>
            </label>

            <p v-if="field.description" class="text-xs text-white/60">
              {{ field.description }}
            </p>

            <input
              type="number"
              :value="getFieldValue(section.key, field)"
              :min="field.min"
              :max="field.max"
              :step="field.step"
              :disabled="field.disabled"
              :required="field.required"
              class="w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white outline-none transition focus:border-green-400/60 focus:ring-1 focus:ring-green-400/30 disabled:opacity-50"
              @input="updateValue(section.key, field, $event)"
            />
          </div>

          <!-- Select -->
          <div v-else-if="field.type === 'select'" class="flex flex-col gap-1">
            <label class="block text-sm text-white font-heading">
              {{ field.label }}
            </label>

            <p v-if="field.description" class="text-xs text-white/60">
              {{ field.description }}
            </p>

            <select
              :value="getFieldValue(section.key, field)"
              :disabled="field.disabled"
              :required="field.required"
              class="w-full rounded-md border border-white/20 bg-transparent p-2 text-sm text-white outline-none transition focus:border-green-400/60 focus:ring-1 focus:ring-green-400/30"
              @change="updateValue(section.key, field, $event)"
            >
              <option
                v-for="option in field.options || []"
                :key="option.value"
                :value="option.value"
                class="bg-gray-900 text-white"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Checkbox -->
          <label
            v-else-if="field.type === 'checkbox'"
            class="flex cursor-pointer items-center gap-2 text-sm text-white"
            :class="{
              'cursor-not-allowed opacity-50': field.disabled
            }"
          >
            <input
              type="checkbox"
              :checked="Boolean(getFieldValue(section.key, field))"
              :disabled="field.disabled"
              @change="updateValue(section.key, field, $event)"
              class="checkbox rounded border-white/20 bg-transparent checked:bg-orange-400"
            />

            <span>
              {{ field.label }}

              <span
                v-if="field.description"
                class="block text-xs text-white/50"
              >
                {{ field.description }}
              </span>
            </span>
          </label>

          <!-- Toggle -->
          <div v-else-if="field.type === 'toggle'" class="flex flex-col gap-1">
            <div>
              <label class="block text-sm text-white font-heading">
                {{ field.label }}
              </label>

              <p v-if="field.description" class="text-xs text-white/60">
                {{ field.description }}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="option in field.options || []"
                :key="option.value"
                type="button"
                :disabled="field.disabled || option.disabled"
                @click="toggleOption(section.key, field, option)"
                class="rounded-md border px-3 py-2 text-sm transition"
                :class="
                  isSelected(section.key, field.key, option.value)
                    ? 'border-green-400/60 bg-green-400/20 text-green-300'
                    : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
                "
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- Radio -->
          <div v-else-if="field.type === 'radio'" class="flex flex-col gap-1">
            <label class="block text-sm text-white font-heading">
              {{ field.label }}
            </label>

            <label
              v-for="option in field.options || []"
              :key="option.value"
              class="flex cursor-pointer items-center gap-2 text-sm text-white"
            >
              <input
                type="radio"
                :name="`${section.key}-${field.key}`"
                :value="option.value"
                :checked="getFieldValue(section.key, field) === option.value"
                :disabled="field.disabled || option.disabled"
                class="radio checked:bg-orange-400 checked:border-orange-400"
                @change="updateField(section.key, field.key, option.value)"
              />

              {{ option.label }}
            </label>
          </div>

          <!-- Range -->
          <div v-else-if="field.type === 'range'" class="flex flex-col gap-1">
            <label class="block text-sm text-white font-heading">
              {{ field.label }}
            </label>

            <input
              type="range"
              :value="getFieldValue(section.key, field)"
              :min="field.min"
              :max="field.max"
              :step="field.step"
              :disabled="field.disabled"
              class="w-full accent-green-400"
              @input="updateValue(section.key, field, $event)"
            />

            <div class="flex justify-between text-xs text-white/50">
              <span>{{ field.min }}</span>

              <span class="text-white">
                {{ getFieldValue(section.key, field) }}
              </span>

              <span>{{ field.max }}</span>
            </div>
          </div>

          <!-- Textarea -->
          <div
            v-else-if="field.type === 'textarea'"
            class="flex flex-col gap-1"
          >
            <label class="block text-sm text-white font-heading">
              {{ field.label }}
            </label>

            <textarea
              :value="getFieldValue(section.key, field)"
              :rows="field.rows || 4"
              :disabled="field.disabled"
              class="w-full resize-y rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-green-400/60"
              @input="updateValue(section.key, field, $event)"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- Submit -->
    <div class="flex items-center">
      <button
        type="button"
        class="p-2 flex-1 bg-black/20"
        @click="emit('reset')"
      >
        RESET
      </button>
      <button class="p-2 flex-1 bg-green-400/60" type="submit">SAVE</button>
    </div>
  </form>
</template>

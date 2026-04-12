<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed, getCurrentInstance, onUnmounted, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    value: string;
    options: string[];
    placeholder?: string;
  }>(),
  {
    placeholder: '',
  },
);

const emit = defineEmits<{
  change: [value: string];
}>();

const inputId = `autocomplete-${getCurrentInstance()?.uid}`;
const wrapperRef = ref<HTMLDivElement | null>(null);
const isOpen = ref(false);

const filteredOptions = computed(() =>
  props.options.filter((opt) => opt.toLowerCase().includes(props.value.toLowerCase())),
);

const handleClickOutside = (e: MouseEvent) => {
  if (!wrapperRef.value?.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

document.addEventListener('click', handleClickOutside);

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleFocus = () => {
  isOpen.value = true;
};

const handleInput = (e: Event) => {
  emit('change', (e.target as HTMLInputElement).value);
  isOpen.value = true;
};

const selectOption = (option: string) => {
  emit('change', option);
  isOpen.value = false;
};
</script>

<template>
  <div class="autocomplete">
    <label class="label" :for="inputId">{{ label }}</label>

    <div ref="wrapperRef" class="input-wrapper">
      <input
        :id="inputId"
        class="input"
        type="text"
        :value="value"
        :placeholder="placeholder"
        autocomplete="off"
        @focus="handleFocus"
        @input="handleInput"
      />

      <span :class="['chevron', { open: isOpen }]">
        <Icon icon="mdi:chevron-down" :width="12" :height="12" />
      </span>

      <div v-if="isOpen && filteredOptions.length > 0" class="dropdown visible">
        <button
          v-for="option in filteredOptions"
          :key="option"
          type="button"
          class="dropdown-item"
          @mousedown="selectOption(option)"
        >
          {{ option }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped src="./autocomplete.component.css" />

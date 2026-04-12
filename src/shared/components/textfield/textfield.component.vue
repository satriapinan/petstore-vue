<script setup lang="ts">
import { getCurrentInstance } from 'vue';

withDefaults(
  defineProps<{
    label: string;
    value: string;
    type?: 'text' | 'password';
    placeholder?: string;
  }>(),
  {
    type: 'text',
    placeholder: 'Type here...',
  },
);

const emit = defineEmits<{
  change: [value: string];
}>();

const inputId = `textfield-${getCurrentInstance()?.uid}`;
</script>

<template>
  <div class="textfield">
    <label class="label" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      class="input"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      @input="emit('change', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped src="./textfield.component.css" />

<script setup lang="ts">
import { Icon } from '@iconify/vue';

withDefaults(
  defineProps<{
    label?: string;
    icon?: string;
    danger?: boolean;
  }>(),
  {
    label: '',
    icon: undefined,
    danger: false,
  },
);

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <button :class="['menu-item', { danger }]" type="button" @click="emit('click')">
    <Icon v-if="icon" :icon="icon" class="menu-item-icon" />
    <span>{{ label }}</span>
  </button>
</template>

<style scoped src="./menu-item.component.css" />

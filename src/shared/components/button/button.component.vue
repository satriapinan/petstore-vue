<script setup lang="ts">
import { Icon } from '@iconify/vue';
import Spinner from '@shared/components/spinner/spinner.component.vue';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    type?: 'button' | 'submit';
    disabled?: boolean;
    loading?: boolean;
    variant?: 'contained' | 'outline';
    color?: 'primary' | 'danger' | 'warning' | 'success';
    icon?: string;
    fullWidth?: boolean;
    fontSize?: string;
    fontWeight?: string;
    padding?: string;
  }>(),
  {
    label: '',
    type: 'button',
    disabled: false,
    loading: false,
    variant: 'contained',
    color: 'primary',
    icon: undefined,
    fullWidth: false,
    fontSize: undefined,
    fontWeight: undefined,
    padding: '12px 16px',
  },
);

const emit = defineEmits<{
  click: [];
}>();

const classNames = computed(() =>
  ['btn', `btn--${props.variant}`, `btn--color-${props.color}`, props.fullWidth ? 'btn--full' : '']
    .filter(Boolean)
    .join(' '),
);
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="classNames"
    :style="{ fontSize, fontWeight, padding }"
    @click="emit('click')"
  >
    <Spinner v-if="loading" :size="16" color="currentColor" />
    <template v-else>
      <Icon v-if="icon" :icon="icon" :width="18" :height="18" class="btn__icon" />
      <span>{{ label }}</span>
    </template>
  </button>
</template>

<style scoped src="./button.component.css" />

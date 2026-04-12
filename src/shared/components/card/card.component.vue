<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    minWidth?: string;
    padding?: string;
    borderRadius?: string;
    background?: string;
    customStyle?: CSSProperties;
  }>(),
  {
    minWidth: '100%',
    padding: '36px',
    borderRadius: 'var(--border-radius)',
    background: undefined,
    customStyle: () => ({}),
  },
);

const style = computed<CSSProperties>(() => ({
  minWidth: props.minWidth,
  padding: props.padding,
  borderRadius: props.borderRadius,
  background: props.background,
  ...props.customStyle,
}));
</script>

<template>
  <div class="card" :style="style">
    <slot />
  </div>
</template>

<style scoped src="./card.component.css" />

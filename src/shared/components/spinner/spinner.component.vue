<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number;
    color?: string;
  }>(),
  {
    size: 20,
    color: 'var(--color-text-secondary)',
  },
);
</script>

<template>
  <div
    class="spinner"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      borderTopColor: color,
    }"
  />
</template>

<style scoped src="./spinner.component.css" />

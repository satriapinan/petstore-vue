<script setup lang="ts">
import { onUnmounted, ref } from 'vue';

const wrapperRef = ref<HTMLDivElement | null>(null);
const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const handleDocumentClick = (e: MouseEvent) => {
  if (!wrapperRef.value?.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') isOpen.value = false;
};

document.addEventListener('click', handleDocumentClick);
document.addEventListener('keydown', handleEscape);

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
  document.removeEventListener('keydown', handleEscape);
});
</script>

<template>
  <div ref="wrapperRef" class="menu-wrapper">
    <button class="menu-trigger" type="button" @click="toggle">
      <slot name="trigger" />
    </button>

    <div v-if="isOpen" class="menu-dropdown">
      <slot />
    </div>
  </div>
</template>

<style scoped src="./menu.component.css" />

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import Button from '@shared/components/button/button.component.vue';
import { onUnmounted, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    isOpen?: boolean;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    icon?: string;
    type?: 'primary' | 'danger' | 'warning' | 'success';
  }>(),
  {
    isOpen: false,
    title: 'Are you sure?',
    message: 'This action cannot be undone. All values associated with this field will be lost.',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    loading: false,
    icon: 'mdi:alert-outline',
    type: 'danger',
  },
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('cancel');
};

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) emit('cancel');
};

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click="handleBackdropClick">
    <div class="modal-content">
      <div :class="`modal-icon ${type}`">
        <Icon :icon="icon" />
      </div>

      <h2 class="modal-title">
        {{ title }}
      </h2>
      <p class="modal-message">
        {{ message }}
      </p>

      <div class="modal-actions">
        <Button
          :label="confirmLabel"
          variant="contained"
          :color="type"
          full-width
          :loading="loading"
          :disabled="loading"
          @click="!loading && emit('confirm')"
        />
        <Button
          :label="cancelLabel"
          variant="outline"
          color="primary"
          full-width
          :disabled="loading"
          @click="!loading && emit('cancel')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped src="./confirm-modal.component.css" />

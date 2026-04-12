<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    totalItems?: number;
    pageSize?: number;
    currentPage?: number;
  }>(),
  {
    totalItems: 0,
    pageSize: 10,
    currentPage: 1,
  },
);

const emit = defineEmits<{
  pageChange: [page: number];
}>();

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize));
const pageIndex = computed(() => Math.max(0, props.currentPage - 1));

const handlePrev = () => {
  if (props.currentPage > 1) emit('pageChange', props.currentPage - 1);
};

const handleNext = () => {
  if (props.currentPage < totalPages.value) emit('pageChange', props.currentPage + 1);
};

const pageNumbers = computed<(number | '...')[]>(() => {
  if (totalPages.value <= 7) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [1];

  if (props.currentPage > 4) pages.push('...');

  const start = Math.max(2, props.currentPage - 1);
  const end = Math.min(totalPages.value - 1, props.currentPage + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (props.currentPage < totalPages.value - 3) pages.push('...');

  pages.push(totalPages.value);

  return pages;
});
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="Pagination">
    <button
      class="pagination__btn"
      :disabled="currentPage <= 1"
      aria-label="Previous page"
      @click="handlePrev"
    >
      <Icon icon="mdi:chevron-left" :width="20" :height="20" />
    </button>

    <template v-for="(page, idx) in pageNumbers" :key="page === '...' ? `ellipsis-${idx}` : page">
      <span v-if="page === '...'" class="pagination__ellipsis">…</span>
      <button
        v-else
        :class="['pagination__btn', pageIndex === page - 1 ? 'pagination__btn--active' : '']"
        :aria-label="`Page ${page}`"
        :aria-current="pageIndex === page - 1 ? 'page' : undefined"
        @click="emit('pageChange', page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      class="pagination__btn"
      :disabled="currentPage >= totalPages"
      aria-label="Next page"
      @click="handleNext"
    >
      <Icon icon="mdi:chevron-right" :width="20" :height="20" />
    </button>
  </nav>
</template>

<style scoped src="./pagination.component.css" />

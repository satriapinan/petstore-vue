import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Pagination from './pagination.component.vue';

vi.mock('@iconify/vue', () => ({
  Icon: { template: '<span data-testid="icon" />' },
}));

describe('Pagination', () => {
  it('renders page buttons', () => {
    const wrapper = mount(Pagination, { props: { totalItems: 30, pageSize: 10, currentPage: 1 } });
    expect(wrapper.find('[aria-label="Page 1"]').exists()).toBe(true);
    expect(wrapper.find('[aria-label="Page 2"]').exists()).toBe(true);
    expect(wrapper.find('[aria-label="Page 3"]').exists()).toBe(true);
  });

  it('returns null when totalPages <= 1', () => {
    const wrapper = mount(Pagination, { props: { totalItems: 5, pageSize: 10, currentPage: 1 } });
    expect(wrapper.find('nav').exists()).toBe(false);
  });

  it('emits pageChange when page button clicked', async () => {
    const wrapper = mount(Pagination, { props: { totalItems: 30, pageSize: 10, currentPage: 1 } });
    await wrapper.find('[aria-label="Page 2"]').trigger('click');
    expect(wrapper.emitted('pageChange')?.[0]).toEqual([2]);
  });

  it('disables previous button on first page', () => {
    const wrapper = mount(Pagination, { props: { totalItems: 30, pageSize: 10, currentPage: 1 } });
    const btn = wrapper.find('[aria-label="Previous page"]').element as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('disables next button on last page', () => {
    const wrapper = mount(Pagination, { props: { totalItems: 30, pageSize: 10, currentPage: 3 } });
    const btn = wrapper.find('[aria-label="Next page"]').element as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('emits pageChange with previous page on prev click', async () => {
    const wrapper = mount(Pagination, { props: { totalItems: 30, pageSize: 10, currentPage: 2 } });
    await wrapper.find('[aria-label="Previous page"]').trigger('click');
    expect(wrapper.emitted('pageChange')?.[0]).toEqual([1]);
  });

  it('emits pageChange with next page on next click', async () => {
    const wrapper = mount(Pagination, { props: { totalItems: 30, pageSize: 10, currentPage: 1 } });
    await wrapper.find('[aria-label="Next page"]').trigger('click');
    expect(wrapper.emitted('pageChange')?.[0]).toEqual([2]);
  });
});

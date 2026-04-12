import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import MenuItem from './menu-item.component.vue';

vi.mock('@iconify/vue', () => ({
  Icon: { template: '<span data-testid="icon" />' },
}));

describe('MenuItem', () => {
  it('renders label', () => {
    const wrapper = mount(MenuItem, { props: { label: 'Settings' } });
    expect(wrapper.text()).toContain('Settings');
  });

  it('renders icon when provided', () => {
    const wrapper = mount(MenuItem, { props: { label: 'Logout', icon: 'mdi:logout' } });
    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true);
  });

  it('does not render icon when not provided', () => {
    const wrapper = mount(MenuItem, { props: { label: 'Logout' } });
    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(false);
  });

  it('applies danger class when danger prop is true', () => {
    const wrapper = mount(MenuItem, { props: { label: 'Delete', danger: true } });
    expect(wrapper.classes()).toContain('danger');
  });

  it('does not apply danger class by default', () => {
    const wrapper = mount(MenuItem, { props: { label: 'Edit' } });
    expect(wrapper.classes()).not.toContain('danger');
  });

  it('emits click when clicked', async () => {
    const wrapper = mount(MenuItem, { props: { label: 'Click Me' } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });
});

import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Button from './button.component.vue';

vi.mock('@iconify/vue', () => ({
  Icon: { template: '<span data-testid="icon" />' },
}));

vi.mock('@shared/components/spinner/spinner.component.vue', () => ({
  default: { template: '<div data-testid="spinner" />' },
}));

describe('Button', () => {
  it('renders label', () => {
    const wrapper = mount(Button, { props: { label: 'Click Me' } });
    expect(wrapper.text()).toContain('Click Me');
  });

  it('emits click when clicked', async () => {
    const wrapper = mount(Button, { props: { label: 'Click' } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('renders spinner when loading', () => {
    const wrapper = mount(Button, { props: { label: 'Save', loading: true } });
    expect(wrapper.find('[data-testid="spinner"]').exists()).toBe(true);
    expect(wrapper.text()).not.toContain('Save');
  });

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(Button, { props: { label: 'Submit', disabled: true } });
    expect((wrapper.element as HTMLButtonElement).disabled).toBe(true);
  });

  it('is disabled when loading', () => {
    const wrapper = mount(Button, { props: { label: 'Submit', loading: true } });
    expect((wrapper.element as HTMLButtonElement).disabled).toBe(true);
  });

  it('renders icon when icon prop provided', () => {
    const wrapper = mount(Button, { props: { label: 'Add', icon: 'mdi:plus' } });
    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true);
  });

  it('applies fullWidth class', () => {
    const wrapper = mount(Button, { props: { label: 'Full', fullWidth: true } });
    expect(wrapper.classes()).toContain('btn--full');
  });

  it('applies variant class', () => {
    const wrapper = mount(Button, { props: { label: 'Outline', variant: 'outline' } });
    expect(wrapper.classes()).toContain('btn--outline');
  });

  it('applies color class', () => {
    const wrapper = mount(Button, { props: { label: 'Danger', color: 'danger' } });
    expect(wrapper.classes()).toContain('btn--color-danger');
  });
});

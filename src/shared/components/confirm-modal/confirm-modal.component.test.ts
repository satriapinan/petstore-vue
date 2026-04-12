import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import ConfirmModal from './confirm-modal.component.vue';

vi.mock('@iconify/vue', () => ({
  Icon: { template: '<span data-testid="icon" />' },
}));

vi.mock('@shared/components/button/button.component.vue', () => ({
  default: {
    props: ['label', 'loading', 'disabled'],
    emits: ['click'],
    template: `<button :disabled="disabled || loading" @click="$emit('click')">{{ label }}</button>`,
  },
}));

describe('ConfirmModal', () => {
  it('does not render when isOpen is false', () => {
    const wrapper = mount(ConfirmModal, { props: { isOpen: false } });
    expect(wrapper.find('.modal-backdrop').exists()).toBe(false);
  });

  it('renders title and message', () => {
    const wrapper = mount(ConfirmModal, {
      props: { isOpen: true, title: 'Delete?', message: 'This cannot be undone.' },
    });
    expect(wrapper.text()).toContain('Delete?');
    expect(wrapper.text()).toContain('This cannot be undone.');
  });

  it('emits confirm when confirm button clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      props: { isOpen: true, confirmLabel: 'Yes' },
    });
    await wrapper.findAll('button')[0].trigger('click');
    expect(wrapper.emitted('confirm')).toBeTruthy();
  });

  it('emits cancel when cancel button clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      props: { isOpen: true, cancelLabel: 'No' },
    });
    await wrapper.findAll('button')[1].trigger('click');
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });

  it('emits cancel when Escape key pressed', async () => {
    const wrapper = mount(ConfirmModal, { props: { isOpen: true } });
    await wrapper.trigger('keydown', { key: 'Escape' });
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });

  it('emits cancel when backdrop clicked', async () => {
    const wrapper = mount(ConfirmModal, { props: { isOpen: true } });
    const backdrop = wrapper.find('.modal-backdrop');
    await backdrop.trigger('click');
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });

  it('disables buttons when loading', () => {
    const wrapper = mount(ConfirmModal, {
      props: { isOpen: true, loading: true, confirmLabel: 'Confirm', cancelLabel: 'Cancel' },
    });
    wrapper.findAll('button').forEach((btn) => {
      expect((btn.element as HTMLButtonElement).disabled).toBe(true);
    });
  });
});

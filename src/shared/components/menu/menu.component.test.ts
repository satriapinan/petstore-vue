import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Menu from './menu.component.vue';

describe('Menu', () => {
  it('renders trigger', () => {
    const wrapper = mount(Menu, { slots: { trigger: '<span>Open</span>' } });
    expect(wrapper.text()).toContain('Open');
  });

  it('does not show children by default', () => {
    const wrapper = mount(Menu, {
      slots: { trigger: '<span>Open</span>', default: '<span>Item</span>' },
    });
    expect(wrapper.find('.menu-dropdown').exists()).toBe(false);
  });

  it('shows children after trigger click', async () => {
    const wrapper = mount(Menu, {
      slots: { trigger: '<span>Open</span>', default: '<span>Item</span>' },
    });
    await wrapper.find('.menu-trigger').trigger('click');
    expect(wrapper.find('.menu-dropdown').exists()).toBe(true);
    expect(wrapper.text()).toContain('Item');
  });

  it('hides children after second trigger click', async () => {
    const wrapper = mount(Menu, {
      slots: { trigger: '<span>Open</span>', default: '<span>Item</span>' },
    });
    await wrapper.find('.menu-trigger').trigger('click');
    await wrapper.find('.menu-trigger').trigger('click');
    expect(wrapper.find('.menu-dropdown').exists()).toBe(false);
  });

  it('closes on Escape key', async () => {
    const wrapper = mount(Menu, {
      slots: { trigger: '<span>Open</span>', default: '<span>Item</span>' },
    });
    await wrapper.find('.menu-trigger').trigger('click');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.menu-dropdown').exists()).toBe(false);
  });

  it('closes when clicking outside', async () => {
    const wrapper = mount(Menu, {
      slots: { trigger: '<span>Open</span>', default: '<span>Item</span>' },
      attachTo: document.body,
    });
    await wrapper.find('.menu-trigger').trigger('click');
    expect(wrapper.find('.menu-dropdown').exists()).toBe(true);
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.menu-dropdown').exists()).toBe(false);
    wrapper.unmount();
  });
});

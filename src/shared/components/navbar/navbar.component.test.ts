import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Navbar from './navbar.component.vue';

const mockLogout = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('@core/services/composables/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@iconify/vue', () => ({
  Icon: { template: '<span data-testid="icon" />' },
}));

vi.mock('@shared/components/menu/menu.component.vue', () => ({
  default: {
    template: `<div><slot name="trigger" /><slot /></div>`,
  },
}));

vi.mock('@shared/components/menu/menu-item/menu-item.component.vue', () => ({
  default: {
    props: ['label', 'icon', 'danger'],
    emits: ['click'],
    template: `<div @click="$emit('click')">{{ label }}</div>`,
  },
}));

describe('Navbar', () => {
  it('renders logo', () => {
    mockUseAuth.mockReturnValue({ user: { username: 'testuser' }, logout: mockLogout });
    const wrapper = mount(Navbar);
    expect(wrapper.find('img[alt="logo"]').exists()).toBe(true);
  });

  it('renders username', async () => {
    mockUseAuth.mockReturnValue({ user: { username: 'testuser' }, logout: mockLogout });
    const { default: Navbar } = await import('./navbar.component.vue');
    const wrapper = mount(Navbar);
    expect(wrapper.text()).toContain('testuser');
  });

  it('renders avatar with first letter of username', async () => {
    mockUseAuth.mockReturnValue({ user: { username: 'testuser' }, logout: mockLogout });
    const { default: Navbar } = await import('./navbar.component.vue');
    const wrapper = mount(Navbar);
    expect(wrapper.find('.avatar').text()).toBe('T');
  });

  it('does not render profile when user is null', async () => {
    mockUseAuth.mockReturnValue({ user: null, logout: mockLogout });
    const { default: Navbar } = await import('./navbar.component.vue');
    const wrapper = mount(Navbar);
    expect(wrapper.find('.navbar-right').exists()).toBe(false);
  });
});

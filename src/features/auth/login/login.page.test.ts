import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import LoginPage from './login.page.vue';

vi.mock('vue-router', () => ({
  RouterLink: {
    props: ['to'],
    template: `<a :href="to"><slot /></a>`,
  },
}));

vi.mock('@core/services/composables/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@shared/components/button/button.component.vue', () => ({
  default: {
    props: ['label', 'type', 'loading', 'disabled'],
    emits: ['click'],
    template: `<button :type="type" :disabled="disabled || loading">{{ label }}</button>`,
  },
}));

vi.mock('@shared/components/card/card.component.vue', () => ({
  default: {
    template: `<div><slot /></div>`,
  },
}));

vi.mock('@shared/components/textfield/textfield.component.vue', () => ({
  default: {
    props: ['label', 'value', 'type'],
    emits: ['change'],
    template: `<input :aria-label="label" :type="type ?? 'text'" :value="value" @input="$emit('change', $event.target.value)" />`,
  },
}));

import { useAuth } from '@core/services/composables/useAuth';

const mockUseAuth = vi.mocked(useAuth);

const mockReturn = (overrides: { login: ReturnType<typeof vi.fn>; isLoginPending: boolean }) => {
  mockUseAuth.mockReturnValue(overrides as unknown as ReturnType<typeof useAuth>);
};

const TEST_USER = 'admin';
const TEST_CREDENTIAL = 'abc12345';

describe('LoginPage', () => {
  it('renders welcome title', () => {
    mockReturn({ login: vi.fn(), isLoginPending: false });
    const wrapper = mount(LoginPage);
    expect(wrapper.text()).toContain('Welcome Back!');
  });

  it('renders subtitle text', () => {
    mockReturn({ login: vi.fn(), isLoginPending: false });
    const wrapper = mount(LoginPage);
    expect(wrapper.text()).toContain('Please enter your details');
  });

  it('renders username and password fields', () => {
    mockReturn({ login: vi.fn(), isLoginPending: false });
    const wrapper = mount(LoginPage);
    expect(wrapper.find('[aria-label="Username"]').exists()).toBe(true);
    expect(wrapper.find('[aria-label="Password"]').exists()).toBe(true);
  });

  it('renders Sign In button', () => {
    mockReturn({ login: vi.fn(), isLoginPending: false });
    const wrapper = mount(LoginPage);
    expect(wrapper.text()).toContain('Sign In');
  });

  it('renders register link', () => {
    mockReturn({ login: vi.fn(), isLoginPending: false });
    const wrapper = mount(LoginPage);
    expect(wrapper.text()).toContain('Sign up');
  });

  it('disables submit button when fields are empty', () => {
    mockReturn({ login: vi.fn(), isLoginPending: false });
    const wrapper = mount(LoginPage);
    expect((wrapper.find('button').element as HTMLButtonElement).disabled).toBe(true);
  });

  it('enables submit button when fields are filled', async () => {
    mockReturn({ login: vi.fn(), isLoginPending: false });
    const wrapper = mount(LoginPage);
    await wrapper.find('[aria-label="Username"]').setValue(TEST_USER);
    await wrapper.find('[aria-label="Password"]').setValue(TEST_CREDENTIAL);
    expect((wrapper.find('button').element as HTMLButtonElement).disabled).toBe(false);
  });

  it('calls login on valid form submit', async () => {
    const login = vi.fn().mockResolvedValue({});
    mockReturn({ login, isLoginPending: false });
    const wrapper = mount(LoginPage);
    await wrapper.find('[aria-label="Username"]').setValue(TEST_USER);
    await wrapper.find('[aria-label="Password"]').setValue(TEST_CREDENTIAL);
    await wrapper.find('form').trigger('submit');
    expect(login).toHaveBeenCalledWith({ username: TEST_USER, password: TEST_CREDENTIAL });
  });

  it('shows error message on login failure', async () => {
    const login = vi.fn().mockRejectedValue(new Error('unauthorized'));
    mockReturn({ login, isLoginPending: false });
    const wrapper = mount(LoginPage);
    await wrapper.find('[aria-label="Username"]').setValue('wronguser');
    await wrapper.find('[aria-label="Password"]').setValue('wrongcred');
    await wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Invalid username or password');
  });

  it('disables Sign In button while login is pending', () => {
    mockReturn({ login: vi.fn(), isLoginPending: true });
    const wrapper = mount(LoginPage);
    expect((wrapper.find('button').element as HTMLButtonElement).disabled).toBe(true);
  });
});

import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import RegisterPage from './register.page.vue';

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

const mockReturn = (overrides: {
  register: ReturnType<typeof vi.fn>;
  isRegisterPending: boolean;
}) => {
  mockUseAuth.mockReturnValue(overrides as unknown as ReturnType<typeof useAuth>);
};

const TEST_CREDENTIAL = 'abc12345';

describe('RegisterPage', () => {
  it('renders Get Started title', () => {
    mockReturn({ register: vi.fn(), isRegisterPending: false });
    const wrapper = mount(RegisterPage);
    expect(wrapper.text()).toContain('Get Started!');
  });

  it('renders subtitle text', () => {
    mockReturn({ register: vi.fn(), isRegisterPending: false });
    const wrapper = mount(RegisterPage);
    expect(wrapper.text()).toContain('Create your account');
  });

  it('renders username, password, and confirm password fields', () => {
    mockReturn({ register: vi.fn(), isRegisterPending: false });
    const wrapper = mount(RegisterPage);
    expect(wrapper.find('[aria-label="Username"]').exists()).toBe(true);
    expect(wrapper.find('[aria-label="Password"]').exists()).toBe(true);
    expect(wrapper.find('[aria-label="Confirm Password"]').exists()).toBe(true);
  });

  it('renders Sign Up button', () => {
    mockReturn({ register: vi.fn(), isRegisterPending: false });
    const wrapper = mount(RegisterPage);
    expect(wrapper.text()).toContain('Sign Up');
  });

  it('renders sign in link', () => {
    mockReturn({ register: vi.fn(), isRegisterPending: false });
    const wrapper = mount(RegisterPage);
    expect(wrapper.text()).toContain('Sign in');
  });

  it('disables Sign Up button when fields are empty', () => {
    mockReturn({ register: vi.fn(), isRegisterPending: false });
    const wrapper = mount(RegisterPage);
    expect((wrapper.find('button').element as HTMLButtonElement).disabled).toBe(true);
  });

  it('shows error when passwords do not match', async () => {
    mockReturn({ register: vi.fn(), isRegisterPending: false });
    const wrapper = mount(RegisterPage);
    await wrapper.find('[aria-label="Username"]').setValue('john');
    await wrapper.find('[aria-label="Password"]').setValue(TEST_CREDENTIAL);
    await wrapper.find('[aria-label="Confirm Password"]').setValue('different');
    await wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Passwords do not match');
  });

  it('calls register with correct values on valid submit', async () => {
    const register = vi.fn().mockResolvedValue({});
    mockReturn({ register, isRegisterPending: false });
    const wrapper = mount(RegisterPage);
    await wrapper.find('[aria-label="Username"]').setValue('newuser');
    await wrapper.find('[aria-label="Password"]').setValue(TEST_CREDENTIAL);
    await wrapper.find('[aria-label="Confirm Password"]').setValue(TEST_CREDENTIAL);
    await wrapper.find('form').trigger('submit');
    expect(register).toHaveBeenCalledWith({ username: 'newuser', password: TEST_CREDENTIAL });
  });

  it('shows error message on registration failure', async () => {
    const register = vi.fn().mockRejectedValue(new Error('fail'));
    mockReturn({ register, isRegisterPending: false });
    const wrapper = mount(RegisterPage);
    await wrapper.find('[aria-label="Username"]').setValue('newuser');
    await wrapper.find('[aria-label="Password"]').setValue(TEST_CREDENTIAL);
    await wrapper.find('[aria-label="Confirm Password"]').setValue(TEST_CREDENTIAL);
    await wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Registration failed. Please try again.');
  });

  it('disables Sign Up button while registration is pending', () => {
    mockReturn({ register: vi.fn(), isRegisterPending: true });
    const wrapper = mount(RegisterPage);
    expect((wrapper.find('button').element as HTMLButtonElement).disabled).toBe(true);
  });
});

import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import DashboardPage from './dashboard.page.vue';

const mockPush = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@core/services/composables/usePet', () => ({
  usePet: vi.fn(),
}));

vi.mock('@shared/components/button/button.component.vue', () => ({
  default: {
    props: ['label', 'icon', 'fullWidth', 'padding'],
    emits: ['click'],
    template: `<button @click="$emit('click')">{{ label }}</button>`,
  },
}));

vi.mock('@shared/components/card/card.component.vue', () => ({
  default: {
    template: `<div><slot /></div>`,
  },
}));

vi.mock('@shared/components/spinner/spinner.component.vue', () => ({
  default: { template: `<div data-testid="spinner" />` },
}));

import { usePet } from '@core/services/composables/usePet';

const mockUsePet = vi.mocked(usePet);

type MockPetReturn = {
  inventory: { available: number; pending: number; sold: number } | null;
  inventoryLoading: boolean;
  inventoryError: Error | null;
};

const mockReturn = (overrides: MockPetReturn) => {
  mockUsePet.mockReturnValue(overrides as unknown as ReturnType<typeof usePet>);
};

describe('DashboardPage', () => {
  it('renders greeting text', () => {
    mockReturn({
      inventory: { available: 5, pending: 2, sold: 10 },
      inventoryLoading: false,
      inventoryError: null,
    });
    const wrapper = mount(DashboardPage);
    expect(wrapper.text()).toContain('Dashboard');
    expect(wrapper.text()).toContain('Good to see you again 👋');
  });

  it('renders loading state', () => {
    mockReturn({ inventory: null, inventoryLoading: true, inventoryError: null });
    const wrapper = mount(DashboardPage);
    expect(wrapper.find('[data-testid="spinner"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Loading inventory...');
  });

  it('renders error state', () => {
    mockReturn({ inventory: null, inventoryLoading: false, inventoryError: new Error('error') });
    const wrapper = mount(DashboardPage);
    expect(wrapper.text()).toContain('Failed to load inventory data.');
  });

  it('renders inventory cards with correct values', () => {
    mockReturn({
      inventory: { available: 5, pending: 2, sold: 10 },
      inventoryLoading: false,
      inventoryError: null,
    });
    const wrapper = mount(DashboardPage);
    expect(wrapper.text()).toContain('5');
    expect(wrapper.text()).toContain('2');
    expect(wrapper.text()).toContain('10');
  });

  it('renders Add Pet button', () => {
    mockReturn({
      inventory: { available: 0, pending: 0, sold: 0 },
      inventoryLoading: false,
      inventoryError: null,
    });
    const wrapper = mount(DashboardPage);
    expect(wrapper.text()).toContain('Add Pet');
  });

  it('navigates to /pets/create when Add Pet is clicked', async () => {
    mockReturn({
      inventory: { available: 0, pending: 0, sold: 0 },
      inventoryLoading: false,
      inventoryError: null,
    });
    const wrapper = mount(DashboardPage);
    await wrapper.find('button').trigger('click');
    expect(mockPush).toHaveBeenCalledWith('/pets/create');
  });

  it('navigates to pets with status when card is clicked', async () => {
    mockReturn({
      inventory: { available: 3, pending: 1, sold: 7 },
      inventoryLoading: false,
      inventoryError: null,
    });
    const wrapper = mount(DashboardPage);
    await wrapper.find('.inventory-card').trigger('click');
    expect(mockPush).toHaveBeenCalledWith('/pets?status=available');
  });

  it('shows 0 when inventory value is missing', () => {
    mockReturn({ inventory: null, inventoryLoading: false, inventoryError: null });
    const wrapper = mount(DashboardPage);
    const zeros = wrapper.findAll('.card-value').filter((el) => el.text() === '0');
    expect(zeros.length).toBe(3);
  });
});

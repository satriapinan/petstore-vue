import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import PetListPage from './pet-list.page.vue';

const mockPush = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({ query: { status: 'available' } }),
}));

vi.mock('@core/services/composables/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@core/services/composables/usePet', () => ({
  usePet: vi.fn(),
}));

vi.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: vi.fn() }),
}));

vi.mock('@iconify/vue', () => ({
  Icon: { template: '<span data-testid="icon" />' },
}));

vi.mock('@shared/components/button/button.component.vue', () => ({
  default: {
    props: ['label', 'fullWidth', 'padding', 'icon', 'variant'],
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

vi.mock('@shared/components/confirm-modal/confirm-modal.component.vue', () => ({
  default: {
    props: ['isOpen', 'title', 'message', 'confirmLabel', 'cancelLabel', 'loading', 'type', 'icon'],
    emits: ['confirm', 'cancel'],
    template: `
      <div v-if="isOpen" data-testid="confirm-modal">
        <span>{{ title }}</span>
        <button @click="$emit('confirm')">Confirm</button>
        <button @click="$emit('cancel')">Cancel</button>
      </div>
    `,
  },
}));

vi.mock('@shared/components/pagination/pagination.component.vue', () => ({
  default: { template: `<div data-testid="pagination" />` },
}));

import { useAuth } from '@core/services/composables/useAuth';
import { usePet } from '@core/services/composables/usePet';

const mockUseAuth = vi.mocked(useAuth);
const mockUsePet = vi.mocked(usePet);

type MockPet = {
  id: number;
  name: string;
  status: string;
  category: { name: string };
  photoUrls: string[];
  tags: unknown[];
};

type MockPetListReturn = {
  pets: MockPet[];
  petsLoading: boolean;
  petsError: Error | null;
  deletePet: ReturnType<typeof vi.fn>;
};

const makePetListMock = (overrides?: Partial<MockPetListReturn>): MockPetListReturn => ({
  pets: [],
  petsLoading: false,
  petsError: null,
  deletePet: vi.fn(),
  ...overrides,
});

const mockPetReturn = (overrides?: Partial<MockPetListReturn>) => {
  mockUsePet.mockReturnValue(makePetListMock(overrides) as unknown as ReturnType<typeof usePet>);
};

const samplePets: MockPet[] = [
  {
    id: 1,
    name: 'Buddy',
    status: 'available',
    category: { name: 'Dogs' },
    photoUrls: [],
    tags: [],
  },
  {
    id: 2,
    name: 'Whiskers',
    status: 'available',
    category: { name: 'Cats' },
    photoUrls: [],
    tags: [],
  },
];

describe('PetListPage - non-admin user', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: { username: 'john' } } as unknown as ReturnType<
      typeof useAuth
    >);
    mockPetReturn({ pets: samplePets });
  });

  it('renders page title', () => {
    const wrapper = mount(PetListPage);
    expect(wrapper.text()).toContain('Pets');
  });

  it('renders pet names', () => {
    const wrapper = mount(PetListPage);
    expect(wrapper.text()).toContain('Buddy');
    expect(wrapper.text()).toContain('Whiskers');
  });

  it('does not render Add Pet button for non-admin', () => {
    const wrapper = mount(PetListPage);
    expect(wrapper.text()).not.toContain('Add Pet');
  });

  it('does not render status tabs for non-admin', () => {
    const wrapper = mount(PetListPage);
    expect(wrapper.find('[role="tablist"]').exists()).toBe(false);
  });

  it('shows companion-finding description for non-admin', () => {
    const wrapper = mount(PetListPage);
    expect(wrapper.text()).toContain('Find your perfect companion.');
  });
});

describe('PetListPage - admin user', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: { username: 'admin' } } as unknown as ReturnType<
      typeof useAuth
    >);
    mockPetReturn({ pets: samplePets });
  });

  it('renders Add Pet button for admin', () => {
    const wrapper = mount(PetListPage);
    expect(wrapper.text()).toContain('Add Pet');
  });

  it('renders status tabs for admin', () => {
    const wrapper = mount(PetListPage);
    expect(wrapper.find('[role="tablist"]').exists()).toBe(true);
  });

  it('renders back to dashboard button', () => {
    const wrapper = mount(PetListPage);
    expect(wrapper.find('[aria-label="Back to dashboard"]').exists()).toBe(true);
  });

  it('navigates to dashboard on back button click', async () => {
    const wrapper = mount(PetListPage);
    await wrapper.find('[aria-label="Back to dashboard"]').trigger('click');
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to Add Pet on button click', async () => {
    const wrapper = mount(PetListPage);
    await wrapper.find('button').trigger('click');
    expect(mockPush).toHaveBeenCalledWith('/pets/create');
  });

  it('opens confirm modal when delete is clicked', async () => {
    const wrapper = mount(PetListPage);
    await wrapper.find('[aria-label="Delete pet"]').trigger('click');
    expect(wrapper.find('[data-testid="confirm-modal"]').exists()).toBe(true);
  });

  it('closes confirm modal on cancel', async () => {
    const wrapper = mount(PetListPage);
    await wrapper.find('[aria-label="Delete pet"]').trigger('click');
    await wrapper
      .findAll('button')
      .find((b) => b.text() === 'Cancel')
      ?.trigger('click');
    expect(wrapper.find('[data-testid="confirm-modal"]').exists()).toBe(false);
  });

  it('calls deletePet on confirm', async () => {
    const deletePet = vi.fn().mockResolvedValue({});
    mockPetReturn({ pets: samplePets, deletePet });
    const wrapper = mount(PetListPage);
    await wrapper.find('[aria-label="Delete pet"]').trigger('click');
    await wrapper
      .findAll('button')
      .find((b) => b.text() === 'Confirm')
      ?.trigger('click');
    await wrapper.vm.$nextTick();
    expect(deletePet).toHaveBeenCalledWith(1);
  });
});

describe('PetListPage - states', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: { username: 'admin' } } as unknown as ReturnType<
      typeof useAuth
    >);
  });

  it('renders loading state', () => {
    mockPetReturn({ petsLoading: true });
    const wrapper = mount(PetListPage);
    expect(wrapper.find('[data-testid="spinner"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Loading pets...');
  });

  it('renders error state', () => {
    mockPetReturn({ petsError: new Error('fail') });
    const wrapper = mount(PetListPage);
    expect(wrapper.text()).toContain('Failed to load pets.');
  });

  it('renders empty state', () => {
    mockPetReturn();
    const wrapper = mount(PetListPage);
    expect(wrapper.text()).toContain('No pets found for this status.');
  });
});

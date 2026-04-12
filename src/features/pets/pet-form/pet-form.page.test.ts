import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import PetFormPage from './pet-form.page.vue';

const mockPush = vi.fn();
const mockRoute = { params: {} as Record<string, string> };

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => mockRoute,
}));

vi.mock('@core/services/composables/usePet', () => ({
  usePet: vi.fn(),
}));

vi.mock('@shared/components/button/button.component.vue', () => ({
  default: {
    props: ['label', 'type', 'loading', 'disabled', 'fullWidth', 'icon', 'variant'],
    emits: ['click'],
    template: `<button :type="type ?? 'button'" :disabled="loading" @click="$emit('click')">{{ label }}</button>`,
  },
}));

vi.mock('@shared/components/textfield/textfield.component.vue', () => ({
  default: {
    props: ['label', 'value', 'type', 'placeholder'],
    emits: ['change'],
    template: `<input :aria-label="label" :type="type ?? 'text'" :value="value" @input="$emit('change', $event.target.value)" />`,
  },
}));

vi.mock('@shared/components/autocomplete/autocomplete.component.vue', () => ({
  default: {
    props: ['label', 'value', 'options', 'placeholder'],
    emits: ['change'],
    template: `<input :aria-label="label" :value="value" @input="$emit('change', $event.target.value)" />`,
  },
}));

vi.mock('@shared/constants/pet.constants', () => ({
  PET_CATEGORIES: ['Dogs', 'Cats'],
  PET_TAGS: ['Vaccinated', 'Neutered'],
  PET_STATUS_OPTIONS: [
    { value: 'available', label: 'Available' },
    { value: 'pending', label: 'Pending' },
    { value: 'sold', label: 'Sold' },
  ],
}));

import { usePet } from '@core/services/composables/usePet';

const mockUsePet = vi.mocked(usePet);

type MockUsePetReturn = {
  pet: {
    id: number;
    name: string;
    category: { name: string };
    tags: { name: string }[];
    status: string;
  } | null;
  petLoading: boolean;
  createPet: ReturnType<typeof vi.fn>;
  updatePet: ReturnType<typeof vi.fn>;
  isCreating: boolean;
  isUpdating: boolean;
};

const makeDefaultMock = (overrides?: Partial<MockUsePetReturn>): MockUsePetReturn => ({
  pet: null,
  petLoading: false,
  createPet: vi.fn().mockResolvedValue({}),
  updatePet: vi.fn().mockResolvedValue({}),
  isCreating: false,
  isUpdating: false,
  ...overrides,
});

const mockReturn = (overrides?: Partial<MockUsePetReturn>) => {
  mockUsePet.mockReturnValue(makeDefaultMock(overrides) as unknown as ReturnType<typeof usePet>);
};

describe('PetFormPage - Add Mode', () => {
  beforeEach(() => {
    mockRoute.params = {};
  });

  it('renders Add New Pet title', () => {
    mockReturn();
    const wrapper = mount(PetFormPage);
    expect(wrapper.text()).toContain('Add New Pet');
  });

  it('renders form fields', () => {
    mockReturn();
    const wrapper = mount(PetFormPage);
    expect(wrapper.find('[aria-label="Name"]').exists()).toBe(true);
    expect(wrapper.find('[aria-label="Category"]').exists()).toBe(true);
    expect(wrapper.find('[aria-label="Tag"]').exists()).toBe(true);
  });

  it('renders status options', () => {
    mockReturn();
    const wrapper = mount(PetFormPage);
    expect(wrapper.text()).toContain('Available');
    expect(wrapper.text()).toContain('Pending');
    expect(wrapper.text()).toContain('Sold');
  });

  it('renders Cancel and Add Pet buttons', () => {
    mockReturn();
    const wrapper = mount(PetFormPage);
    expect(wrapper.text()).toContain('Cancel');
    expect(wrapper.text()).toContain('Add Pet');
  });

  it('navigates to /dashboard on cancel', async () => {
    mockReturn();
    const wrapper = mount(PetFormPage);
    await wrapper.findAll('button')[0].trigger('click');
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('calls createPet on valid submit', async () => {
    const createPet = vi.fn().mockResolvedValue({});
    mockReturn({ createPet });
    const wrapper = mount(PetFormPage);
    await wrapper.find('[aria-label="Name"]').setValue('Buddy');
    await wrapper.find('form').trigger('submit');
    expect(createPet).toHaveBeenCalled();
  });

  it('shows submit error on createPet failure', async () => {
    const createPet = vi.fn().mockRejectedValue(new Error('fail'));
    mockReturn({ createPet });
    const wrapper = mount(PetFormPage);
    await wrapper.find('[aria-label="Name"]').setValue('Buddy');
    await wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Failed to add pet. Please try again.');
  });
});

describe('PetFormPage - Edit Mode', () => {
  it('renders Update Pet heading when id is present', () => {
    mockRoute.params = { id: '1' };
    mockReturn({
      pet: {
        id: 1,
        name: 'Max',
        category: { name: 'Dogs' },
        tags: [{ name: 'Vaccinated' }],
        status: 'available',
      },
      petLoading: false,
    });
    const wrapper = mount(PetFormPage);
    expect(wrapper.find('h2').text()).toBe('Update Pet');
  });
});

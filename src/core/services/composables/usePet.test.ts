import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';

const mockToast = { success: vi.fn(), error: vi.fn() };
const mockInvalidateQueries = vi.fn();
const mockUseQuery = vi.fn();
const mockUseMutation = vi.fn();
const mockMutateAsync = vi.fn();

vi.mock('vue-sonner', () => ({
  toast: mockToast,
}));

vi.mock('@tanstack/vue-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
  useQuery: (opts: { queryKey: unknown; queryFn: unknown; enabled?: unknown }) =>
    mockUseQuery(opts),
  useMutation: (opts: { mutationFn: unknown; onSuccess?: () => void }) => mockUseMutation(opts),
}));

vi.mock('@core/services/api/pet.api', () => ({
  getPetsApi: vi.fn(),
  getPetByIdApi: vi.fn(),
  getPetInventoryApi: vi.fn(),
  createPetApi: vi.fn(),
  updatePetApi: vi.fn(),
  deletePetApi: vi.fn(),
}));

describe('usePet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockReturnValue({ data: ref(undefined), isLoading: ref(false), error: ref(null) });
    mockUseMutation.mockReturnValue({ mutateAsync: mockMutateAsync, isPending: ref(false) });
  });

  it('returns default empty pets array when no data', async () => {
    const { usePet } = await import('./usePet');
    const result = usePet();
    expect(result.pets.value).toEqual([]);
  });

  it('returns pets from query data', async () => {
    const pets = [{ id: 1, name: 'Dog' }];
    mockUseQuery.mockReturnValueOnce({ data: ref(pets), isLoading: ref(false), error: ref(null) });
    mockUseQuery.mockReturnValue({ data: ref(undefined), isLoading: ref(false), error: ref(null) });
    const { usePet } = await import('./usePet');
    const result = usePet('available');
    expect(result.pets.value).toEqual(pets);
  });

  it('returns petsLoading true when loading', async () => {
    mockUseQuery.mockReturnValueOnce({
      data: ref(undefined),
      isLoading: ref(true),
      error: ref(null),
    });
    mockUseQuery.mockReturnValue({ data: ref(undefined), isLoading: ref(false), error: ref(null) });
    const { usePet } = await import('./usePet');
    const result = usePet();
    expect(result.petsLoading.value).toBe(true);
  });

  it('calls createPet mutateAsync', async () => {
    const pet = { id: 1, name: 'Cat' };
    mockMutateAsync.mockResolvedValue(pet);
    const { usePet } = await import('./usePet');
    const result = usePet();
    await result.createPet(pet as never);
    expect(mockMutateAsync).toHaveBeenCalledWith(pet);
  });

  it('calls updatePet mutateAsync', async () => {
    const pet = { id: 1, name: 'Bird' };
    mockMutateAsync.mockResolvedValue(pet);
    const { usePet } = await import('./usePet');
    const result = usePet();
    await result.updatePet(pet as never);
    expect(mockMutateAsync).toHaveBeenCalledWith(pet);
  });

  it('calls deletePet mutateAsync', async () => {
    mockMutateAsync.mockResolvedValue(undefined);
    const { usePet } = await import('./usePet');
    const result = usePet();
    await result.deletePet(1);
    expect(mockMutateAsync).toHaveBeenCalledWith(1);
  });

  it('onSuccess for createMutation invalidates queries and shows toast', async () => {
    const { usePet } = await import('./usePet');
    usePet();
    const createCall = mockUseMutation.mock.calls[0]?.[0];
    await createCall?.onSuccess?.();
    expect(mockInvalidateQueries).toHaveBeenCalled();
    expect(mockToast.success).toHaveBeenCalledWith('Pet created successfully');
  });

  it('onSuccess for updateMutation invalidates queries and shows toast', async () => {
    const { usePet } = await import('./usePet');
    usePet();
    const updateCall = mockUseMutation.mock.calls[1]?.[0];
    await updateCall?.onSuccess?.();
    expect(mockInvalidateQueries).toHaveBeenCalled();
    expect(mockToast.success).toHaveBeenCalledWith('Pet updated successfully');
  });

  it('onSuccess for deleteMutation invalidates queries', async () => {
    const { usePet } = await import('./usePet');
    usePet();
    const deleteCall = mockUseMutation.mock.calls[2]?.[0];
    await deleteCall?.onSuccess?.();
    expect(mockInvalidateQueries).toHaveBeenCalled();
  });
});

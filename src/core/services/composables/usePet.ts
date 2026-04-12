import {
  createPetApi,
  deletePetApi,
  getPetByIdApi,
  getPetInventoryApi,
  getPetsApi,
  updatePetApi,
} from '@core/services/api/pet.api';
import type { PetInventory } from '@shared/models/inventory.model';
import type { Pet } from '@shared/models/pet.model';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, isRef, toRef, type MaybeRef } from 'vue';
import { toast } from 'vue-sonner';

export const PET_KEYS = {
  all: ['pets'] as const,
  list: (status: string) => ['pets', 'list', status] as const,
  detail: (id: number) => ['pets', 'detail', id] as const,
  inventory: ['pets', 'inventory'] as const,
};

export const usePet = (status: MaybeRef<string> = 'available', id?: number) => {
  const queryClient = useQueryClient();

  const statusRef = isRef(status) ? status : toRef(status);

  const petsQuery = useQuery({
    queryKey: computed(() => PET_KEYS.list(statusRef.value)),
    queryFn: () => getPetsApi(statusRef.value),
  });

  const petDetailQuery = useQuery({
    queryKey: computed(() => PET_KEYS.detail(id as number)),
    queryFn: () => getPetByIdApi(id as number),
    enabled: computed(() => !!id),
  });

  const inventoryQuery = useQuery({
    queryKey: PET_KEYS.inventory,
    queryFn: async (): Promise<PetInventory> => {
      const inv = await getPetInventoryApi();
      return {
        available: inv['available'] ?? 0,
        pending: inv['pending'] ?? 0,
        sold: inv['sold'] ?? 0,
      };
    },
  });

  const createMutation = useMutation({
    mutationFn: (pet: Pet) => createPetApi(pet),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PET_KEYS.all });
      toast.success('Pet created successfully');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (pet: Pet) => updatePetApi(pet),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PET_KEYS.all });
      toast.success('Pet updated successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePetApi(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PET_KEYS.all });
    },
  });

  return {
    pets: computed(() => petsQuery.data.value ?? []),
    petsLoading: petsQuery.isLoading,
    petsError: petsQuery.error,

    pet: petDetailQuery.data,
    petLoading: petDetailQuery.isLoading,
    petError: petDetailQuery.error,

    inventory: inventoryQuery.data,
    inventoryLoading: inventoryQuery.isLoading,
    inventoryError: inventoryQuery.error,

    createPet: (pet: Pet) => createMutation.mutateAsync(pet),
    updatePet: (pet: Pet) => updateMutation.mutateAsync(pet),
    deletePet: (id: number) => deleteMutation.mutateAsync(id),

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

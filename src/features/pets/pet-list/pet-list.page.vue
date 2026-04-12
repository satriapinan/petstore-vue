<script setup lang="ts">
import { useAuth } from '@core/services/composables/useAuth';
import { usePet } from '@core/services/composables/usePet';
import { Icon } from '@iconify/vue';
import Button from '@shared/components/button/button.component.vue';
import Card from '@shared/components/card/card.component.vue';
import ConfirmModal from '@shared/components/confirm-modal/confirm-modal.component.vue';
import Pagination from '@shared/components/pagination/pagination.component.vue';
import Spinner from '@shared/components/spinner/spinner.component.vue';
import { computed, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const PAGE_SIZE = 12;
const DEFAULT_PHOTO = 'https://placehold.co/400x400?text=No+Photo';

const STATUS_TABS = [
  { label: 'Available', value: 'available', icon: 'mdi:paw', colorClass: 'text-available' },
  { label: 'Pending', value: 'pending', icon: 'mdi:timer-sand', colorClass: 'text-pending' },
  { label: 'Sold', value: 'sold', icon: 'mdi:check-circle-outline', colorClass: 'text-sold' },
];

const getPhotoUrl = (photoUrls: string[] | undefined | null): string => {
  if (!photoUrls?.length) return DEFAULT_PHOTO;
  const url = photoUrls[0].trim();
  return /^https?:\/\//i.test(url) ? url : DEFAULT_PHOTO;
};

const router = useRouter();
const route = useRoute();
const { user } = useAuth();

const isAdmin = computed(() => user.value?.username === 'admin');

const queryStatus = computed(() => (route.query.status as string) || 'available');
const activeStatus = ref(isAdmin.value ? queryStatus.value : 'available');
const currentPage = ref(1);
const isMobile = ref(globalThis.innerWidth <= 480);

const isDeleteModalOpen = ref(false);
const petToDelete = ref<number | null>(null);
const deletingId = ref<number | null>(null);

const { pets, petsLoading, petsError, deletePet } = usePet(activeStatus);

let timeout: ReturnType<typeof setTimeout>;
const handleResize = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    isMobile.value = globalThis.innerWidth <= 480;
  }, 150);
};
globalThis.addEventListener('resize', handleResize);
onUnmounted(() => {
  globalThis.removeEventListener('resize', handleResize);
  clearTimeout(timeout);
});

watch(activeStatus, () => {
  currentPage.value = 1;
});

const pagedPets = computed(() => {
  const list = pets.value ?? [];
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return list.slice(start, start + PAGE_SIZE);
});

const selectStatus = (status: string) => {
  if (!isAdmin.value || activeStatus.value === status) return;
  activeStatus.value = status;
  router.push(`/pets?status=${status}`);
};

const onPageChange = (page: number) => {
  currentPage.value = page;
  globalThis.scrollTo({ top: 0, behavior: 'smooth' });
};

const navigateToDetail = (id: number | undefined) => {
  if (!isAdmin.value || id === undefined) return;
  router.push(`/pets/update/${id}`);
};

const promptDeletePet = (e: MouseEvent, id: number | undefined) => {
  e.stopPropagation();
  if (!isAdmin.value || id === undefined) return;
  petToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (petToDelete.value === null) return;
  deletingId.value = petToDelete.value;
  try {
    await deletePet(petToDelete.value);
    toast.success('Pet successfully deleted!');
  } catch {
    console.error('Failed to delete pet.');
  } finally {
    deletingId.value = null;
    isDeleteModalOpen.value = false;
    petToDelete.value = null;
  }
};

const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  petToDelete.value = null;
};
</script>

<template>
  <div class="pet-list-container">
    <div class="pet-list-content">
      <div class="header-row">
        <div class="header-left">
          <button
            v-if="isAdmin"
            class="back-btn"
            aria-label="Back to dashboard"
            @click="router.push('/dashboard')"
          >
            <Icon icon="mdi:arrow-left" class="back-icon" />
            <span>Dashboard</span>
          </button>

          <div class="heading">
            <h2 class="page-title">Pets</h2>
            <p class="page-desc">
              {{
                isAdmin ? 'Browse pets by their current status.' : 'Find your perfect companion.'
              }}
            </p>
          </div>
        </div>

        <Button
          v-if="isAdmin"
          label="Add Pet"
          variant="contained"
          icon="mdi:plus"
          padding="12px 16px"
          :full-width="isMobile"
          @click="router.push('/pets/create')"
        />
      </div>

      <div v-if="isAdmin" class="status-tabs" role="tablist">
        <button
          v-for="tab in STATUS_TABS"
          :key="tab.value"
          :class="['tab-btn', `tab-${tab.value}`, { active: activeStatus === tab.value }]"
          role="tab"
          :aria-selected="activeStatus === tab.value"
          @click="selectStatus(tab.value)"
        >
          <Icon :icon="tab.icon" :class="`tab-icon ${tab.colorClass}`" />
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <div class="list-body">
        <div v-if="petsLoading" class="center-state">
          <div class="loading-row">
            <Spinner :size="12" />
            <p class="state-text">Loading pets...</p>
          </div>
        </div>

        <div v-else-if="petsError" class="center-state">
          <p class="state-text error">Failed to load pets.</p>
        </div>

        <div v-else-if="!pets || pets.length === 0" class="center-state">
          <div class="empty-state">
            <Icon icon="mdi:paw" class="empty-icon" />
            <p class="empty-text">No pets found for this status.</p>
          </div>
        </div>

        <div v-else class="pets-grid">
          <Card
            v-for="(pet, i) in pagedPets"
            :key="`${activeStatus}-${pet.id}-${i}`"
            padding="0"
            min-width="0"
            :custom-style="{ animationDelay: `${i * 50}ms` }"
          >
            <div
              :class="['pet-card', { clickable: isAdmin }]"
              :style="{ animationDelay: `${i * 50}ms` }"
              v-bind="isAdmin ? { role: 'button', tabindex: 0 } : {}"
              @click="isAdmin && navigateToDetail(pet.id)"
              @keydown.enter="isAdmin && navigateToDetail(pet.id)"
              @keydown.space="isAdmin && navigateToDetail(pet.id)"
            >
              <button
                v-if="isAdmin"
                class="delete-btn"
                aria-label="Delete pet"
                @click="promptDeletePet($event, pet.id)"
              >
                <Icon icon="mdi:trash-can-outline" />
              </button>

              <div class="pet-photo-wrapper">
                <img
                  class="pet-photo"
                  :src="getPhotoUrl(pet.photoUrls)"
                  :alt="pet.name"
                  loading="lazy"
                />
              </div>

              <div class="pet-info">
                <div class="pet-name-row">
                  <span class="pet-name">{{ pet.name }}</span>
                  <span v-if="pet.status" :class="`pet-status-badge badge-${pet.status}`">
                    {{ pet.status }}
                  </span>
                </div>
                <span v-if="pet.category?.name" class="pet-category">{{ pet.category.name }}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Pagination
        :total-items="pets?.length ?? 0"
        :page-size="PAGE_SIZE"
        :current-page="currentPage"
        @page-change="onPageChange"
      />
    </div>
  </div>

  <ConfirmModal
    v-if="isAdmin"
    :is-open="isDeleteModalOpen"
    title="Delete Pet"
    message="Are you sure you want to delete this pet? This action cannot be undone."
    confirm-label="Delete"
    cancel-label="Cancel"
    type="danger"
    icon="mdi:trash-can-outline"
    :loading="deletingId !== null"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<style scoped src="./pet-list.page.css" />

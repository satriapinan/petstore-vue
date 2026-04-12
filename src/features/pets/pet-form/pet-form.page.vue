<script setup lang="ts">
import { usePet } from '@core/services/composables/usePet';
import Autocomplete from '@shared/components/autocomplete/autocomplete.component.vue';
import Button from '@shared/components/button/button.component.vue';
import Textfield from '@shared/components/textfield/textfield.component.vue';
import { PET_CATEGORIES, PET_STATUS_OPTIONS, PET_TAGS } from '@shared/constants/pet.constants';
import { computed, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

type PetStatus = 'available' | 'pending' | 'sold';

const router = useRouter();
const route = useRoute();

const id = computed(() => route.params.id as string | undefined);
const isEditMode = computed(() => !!id.value);

const { pet, petLoading, createPet, updatePet, isCreating, isUpdating } = usePet(
  'available',
  id.value ? Number(id.value) : undefined,
);

const name = ref('');
const category = ref('');
const tag = ref('');
const status = ref<PetStatus>('available');
const nameError = ref<string | null>(null);
const submitError = ref<string | null>(null);

const isMobile = ref(globalThis.innerWidth <= 480);

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

watch(
  () => pet.value,
  (val) => {
    if (isEditMode.value && val) {
      name.value = val.name ?? '';
      category.value = val.category?.name ?? '';
      tag.value = val.tags?.[0]?.name ?? '';
      status.value = (val.status as PetStatus) ?? 'available';
    }
  },
  { immediate: true },
);

const loading = computed(() => (isEditMode.value ? petLoading.value : false));
const submitting = computed(() => isCreating.value || isUpdating.value);

const onSubmit = async () => {
  submitError.value = null;
  nameError.value = null;

  if (!name.value.trim()) {
    nameError.value = 'Name is required.';
    return;
  }

  const payload = {
    ...(isEditMode.value && id.value ? { id: Number(id.value) } : {}),
    name: name.value,
    category: { id: 0, name: category.value },
    tags: [{ id: 0, name: tag.value }],
    photoUrls: [] as string[],
    status: status.value,
  };

  try {
    if (isEditMode.value) {
      await updatePet(payload);
      router.push({ path: '/pets', query: { status: status.value } });
    } else {
      await createPet(payload);
      router.push({ path: '/pets', query: { status: status.value } });
    }
  } catch {
    submitError.value = isEditMode.value
      ? 'Failed to update pet. Please try again.'
      : 'Failed to add pet. Please try again.';
  }
};

const onCancel = () => router.push('/dashboard');
</script>

<template>
  <div class="pet-form-container">
    <div class="pet-form-content">
      <div class="header">
        <div class="header-text">
          <p class="subtitle">Pet Management</p>
          <h2 class="title">{{ isEditMode ? 'Update Pet' : 'Add New Pet' }}</h2>
          <p class="desc">
            {{
              isEditMode
                ? 'Edit the details below to update the pet information.'
                : "Fill in the details below to add a new pet to shop's inventory."
            }}
          </p>
        </div>
      </div>

      <form class="form" novalidate @submit.prevent="onSubmit">
        <div class="form-card">
          <div class="form-section">
            <h3 class="section-title">Basic Info</h3>
            <div class="fields">
              <Textfield
                label="Name"
                :value="name"
                placeholder="e.g. Buddy"
                @change="name = $event"
              />
              <p v-if="nameError" class="field-error">{{ nameError }}</p>

              <Autocomplete
                label="Category"
                :value="category"
                :options="PET_CATEGORIES"
                placeholder="e.g. Dogs"
                @change="category = $event"
              />

              <Autocomplete
                label="Tag"
                :value="tag"
                :options="PET_TAGS"
                placeholder="e.g. Vaccinated"
                @change="tag = $event"
              />
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Status</h3>
            <div class="status-group">
              <label
                v-for="option in PET_STATUS_OPTIONS"
                :key="option.value"
                :class="['status-option', { active: status === option.value }]"
              >
                <input
                  type="radio"
                  class="status-radio"
                  :value="option.value"
                  :checked="status === option.value"
                  @change="status = option.value as PetStatus"
                />
                <span :class="`status-dot ${option.value}`" />
                <span class="status-label">{{ option.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <p v-if="submitError" class="submit-error">{{ submitError }}</p>

        <div class="actions">
          <Button
            label="Cancel"
            variant="outline"
            type="button"
            :full-width="isMobile"
            @click="onCancel"
          />
          <Button
            :label="isEditMode ? 'Update Pet' : 'Add Pet'"
            variant="contained"
            :icon="isEditMode ? 'mdi:pencil' : 'mdi:plus'"
            type="submit"
            :full-width="isMobile"
            :loading="submitting || loading"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped src="./pet-form.page.css" />

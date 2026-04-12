<script setup lang="ts">
import { usePet } from '@core/services/composables/usePet';
import Button from '@shared/components/button/button.component.vue';
import Card from '@shared/components/card/card.component.vue';
import Spinner from '@shared/components/spinner/spinner.component.vue';
import type { PetInventory } from '@shared/models/inventory.model';
import { onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

interface InventoryCard {
  label: string;
  key: keyof PetInventory;
  icon: string;
}

const DASHBOARD_CARDS: InventoryCard[] = [
  { label: 'Available', key: 'available', icon: '🐾' },
  { label: 'Pending', key: 'pending', icon: '⏳' },
  { label: 'Sold', key: 'sold', icon: '✅' },
];

const router = useRouter();
const { inventory, inventoryLoading, inventoryError } = usePet();

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

const navigateToStatus = (status: string) => {
  router.push(`/pets?status=${status}`);
};

const navigateToAddPet = () => {
  router.push('/pets/create');
};
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-content">
      <div class="greetings-row">
        <div class="greetings">
          <p class="greetings-subtitle">Good to see you again 👋</p>
          <h2 class="greetings-title">Dashboard</h2>
          <p class="greetings-desc">Here's a quick overview of your pet inventory.</p>
        </div>
        <Button
          label="Add Pet"
          variant="contained"
          icon="mdi:plus"
          :full-width="isMobile"
          padding="12px 16px"
          @click="navigateToAddPet"
        />
      </div>

      <div v-if="inventoryLoading" class="loading-row">
        <Spinner :size="12" />
        <p class="state-text">Loading inventory...</p>
      </div>

      <p v-else-if="inventoryError" class="state-text error">Failed to load inventory data.</p>

      <div v-else class="cards-row">
        <Card v-for="card in DASHBOARD_CARDS" :key="card.key" min-width="0" padding="0">
          <button class="inventory-card" @click="navigateToStatus(card.key)">
            <span class="card-icon">{{ card.icon }}</span>
            <span class="card-label">{{ card.label }}</span>
            <span class="card-value">{{ inventory?.[card.key] ?? 0 }}</span>
          </button>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped src="./dashboard.page.css" />

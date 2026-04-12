<script setup lang="ts">
import { useAuth } from '@core/services/composables/useAuth';
import MenuItem from '@shared/components/menu/menu-item/menu-item.component.vue';
import Menu from '@shared/components/menu/menu.component.vue';

const { user, logout } = useAuth();

const getInitial = (username: string): string => username?.charAt(0).toUpperCase() ?? '';
</script>

<template>
  <header class="navbar">
    <img src="/logo.png" alt="logo" class="logo" />

    <div v-if="user" class="navbar-right">
      <Menu>
        <template #trigger>
          <div class="profile">
            <div class="avatar">{{ getInitial(user.username) }}</div>
            <span class="username">{{ user.username }}</span>
          </div>
        </template>

        <MenuItem label="Logout" icon="mdi:logout" :danger="true" @click="logout" />
      </Menu>
    </div>
  </header>
</template>

<style scoped src="./navbar.component.css" />

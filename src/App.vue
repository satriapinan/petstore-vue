<script setup lang="ts">
import { RouterView } from 'vue-router';

import { Toaster } from 'vue-sonner';
import Navbar from './shared/components/navbar/navbar.component.vue';
</script>

<template>
  <Navbar />
  <RouterView />

  <Toaster rich-colors position="top-right" />
</template>

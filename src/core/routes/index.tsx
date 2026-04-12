import { createRouter, createWebHistory } from 'vue-router';

import { authRoutes } from './auth.routes';
import { guestRoutes } from './guest.routes';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    ...guestRoutes,
    ...authRoutes,
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
});

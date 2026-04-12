import guestGuard from '@core/guards/guest.guard';
import type { RouteRecordRaw } from 'vue-router';

export const guestRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@features/auth/login/login.page.vue'),
    beforeEnter: guestGuard,
  },
  {
    path: '/register',
    component: () => import('@features/auth/register/register.page.vue'),
    beforeEnter: guestGuard,
  },
];

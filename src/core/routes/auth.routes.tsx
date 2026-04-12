import authGuard from '@core/guards/auth.guard';
import roleGuard from '@core/guards/role.guard';
import type { RouteRecordRaw } from 'vue-router';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/pets',
    component: () => import('@features/pets/pet-list/pet-list.page.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/dashboard',
    component: () => import('@features/dashboard/dashboard.page.vue'),
    meta: { requiredRole: 'admin' },
    beforeEnter: [authGuard, roleGuard],
  },
  {
    path: '/pets/create',
    component: () => import('@features/pets/pet-form/pet-form.page.vue'),
    meta: { requiredRole: 'admin' },
    beforeEnter: [authGuard, roleGuard],
  },
  {
    path: '/pets/update/:id',
    component: () => import('@features/pets/pet-form/pet-form.page.vue'),
    meta: { requiredRole: 'admin' },
    beforeEnter: [authGuard, roleGuard],
  },
];
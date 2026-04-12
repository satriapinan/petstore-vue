import type { NavigationGuard } from 'vue-router';

const roleGuard: NavigationGuard = (to, _from, next) => {
  const requiredRole = to.meta.requiredRole;
  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;

  if (requiredRole && user?.username !== requiredRole) {
    next('/pets');
  } else {
    next();
  }
};

export default roleGuard;

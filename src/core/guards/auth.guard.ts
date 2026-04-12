import type { NavigationGuard } from 'vue-router';

const authGuard: NavigationGuard = (_to, _from, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    next();
  } else {
    next('/login');
  }
};

export default authGuard;
import type { NavigationGuard } from 'vue-router';

const guestGuard: NavigationGuard = (_to, _from, next) => {
  const token = localStorage.getItem('token');

  if (!token) {
    next();
    return;
  }

  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;

  next(user?.username === 'admin' ? '/dashboard' : '/pets');
};

export default guestGuard;

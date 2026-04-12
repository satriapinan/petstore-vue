import { getUserApi, loginApi, registerApi } from '@core/services/api/auth.api';
import type { User } from '@shared/models/user.model';
import { useMutation } from '@tanstack/vue-query';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const getStoredUser = (): User | null => {
  const stored = localStorage.getItem('user');
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => !!localStorage.getItem('token');

export const useAuth = () => {
  const router = useRouter();
  const user = ref<User | null>(getStoredUser());

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      await loginApi(username, password);
      return await getUserApi(username);
    },
    onSuccess: (userData) => {
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Login successful!');
    },
    onError: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: User) => registerApi(userData),
    onSuccess: () => {
      toast.success('Registration successful!');
    },
  });

  const login = async (payload: { username: string; password: string }) => {
    const userData = await loginMutation.mutateAsync(payload);
    user.value = userData;
    await router.push(userData.username === 'admin' ? '/dashboard' : '/pets');
    return userData;
  };

  const register = async (payload: User) => {
    const result = await registerMutation.mutateAsync(payload);
    await router.push('/login');
    return result;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    user.value = null;
    toast.success('Logout successful');
    router.push('/login');
  };

  return {
    user,
    isAuthenticated: isAuthenticated(),

    login,
    register,
    logout,

    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,

    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};

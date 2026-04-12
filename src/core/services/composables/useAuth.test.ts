import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockPush = vi.fn();
const mockToast = { success: vi.fn(), error: vi.fn(), warning: vi.fn() };
const mockMutateAsync = vi.fn();
const mockUseMutation = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('vue-sonner', () => ({
  toast: mockToast,
}));

vi.mock('@tanstack/vue-query', () => ({
  useMutation: (opts: {
    mutationFn: unknown;
    onSuccess?: (data: unknown) => void;
    onError?: () => void;
  }) => mockUseMutation(opts),
}));

vi.mock('@core/services/api/auth.api', () => ({
  loginApi: vi.fn(),
  getUserApi: vi.fn(),
  registerApi: vi.fn(),
}));

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      error: null,
    });
  });

  it('returns isAuthenticated false when no token', async () => {
    const { useAuth } = await import('./useAuth');
    const result = useAuth();
    expect(result.isAuthenticated).toBe(false);
  });

  it('returns isAuthenticated true when token exists', async () => {
    localStorage.setItem('token', 'fake-token');
    const { useAuth } = await import('./useAuth');
    const result = useAuth();
    expect(result.isAuthenticated).toBe(true);
  });

  it('returns user from localStorage', async () => {
    const user = { username: 'admin' };
    localStorage.setItem('user', JSON.stringify(user));
    const { useAuth } = await import('./useAuth');
    const result = useAuth();
    expect(result.user.value).toEqual(user);
  });

  it('logout clears localStorage and navigates to /login', async () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ username: 'admin' }));
    const { useAuth } = await import('./useAuth');
    const result = useAuth();
    result.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(mockToast.success).toHaveBeenCalledWith('Logout successful');
  });

  it('login calls mutateAsync and navigates for admin', async () => {
    const user = { username: 'admin' };
    mockMutateAsync.mockResolvedValue(user);
    const { useAuth } = await import('./useAuth');
    const result = useAuth();
    await result.login({ username: 'admin', password: 'pass' });
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('login navigates to /pets for non-admin user', async () => {
    const user = { username: 'john' };
    mockMutateAsync.mockResolvedValue(user);
    const { useAuth } = await import('./useAuth');
    const result = useAuth();
    await result.login({ username: 'john', password: 'pass' });
    expect(mockPush).toHaveBeenCalledWith('/pets');
  });

  it('register calls mutateAsync and navigates to /login', async () => {
    const user = { username: 'newuser' };
    mockMutateAsync.mockResolvedValue(user);
    const { useAuth } = await import('./useAuth');
    const result = useAuth();
    await result.register(user as never);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});

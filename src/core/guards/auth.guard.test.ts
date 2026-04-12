import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('authGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('calls next() when authenticated', async () => {
    localStorage.setItem('token', 'fake-token');
    const { default: authGuard } = await import('./auth.guard');
    const next = vi.fn();
    authGuard({} as never, {} as never, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('redirects to /login when not authenticated', async () => {
    const { default: authGuard } = await import('./auth.guard');
    const next = vi.fn();
    authGuard({} as never, {} as never, next);
    expect(next).toHaveBeenCalledWith('/login');
  });
});

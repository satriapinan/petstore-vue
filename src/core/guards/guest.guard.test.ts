import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('guestGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('calls next() when not authenticated', async () => {
    const { default: guestGuard } = await import('./guest.guard');
    const next = vi.fn();
    guestGuard({} as never, {} as never, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('redirects to /dashboard when authenticated as admin', async () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ username: 'admin' }));
    const { default: guestGuard } = await import('./guest.guard');
    const next = vi.fn();
    guestGuard({} as never, {} as never, next);
    expect(next).toHaveBeenCalledWith('/dashboard');
  });

  it('redirects to /pets when authenticated as non-admin', async () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ username: 'john' }));
    const { default: guestGuard } = await import('./guest.guard');
    const next = vi.fn();
    guestGuard({} as never, {} as never, next);
    expect(next).toHaveBeenCalledWith('/pets');
  });
});

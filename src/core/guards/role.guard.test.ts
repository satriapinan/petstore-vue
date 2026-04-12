import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('roleGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('calls next() when user matches required role', async () => {
    localStorage.setItem('user', JSON.stringify({ username: 'admin' }));
    const { default: roleGuard } = await import('./role.guard');
    const next = vi.fn();
    roleGuard({ meta: { requiredRole: 'admin' } } as never, {} as never, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('redirects to /pets when user does not match required role', async () => {
    localStorage.setItem('user', JSON.stringify({ username: 'john' }));
    const { default: roleGuard } = await import('./role.guard');
    const next = vi.fn();
    roleGuard({ meta: { requiredRole: 'admin' } } as never, {} as never, next);
    expect(next).toHaveBeenCalledWith('/pets');
  });

  it('redirects to /pets when user is null', async () => {
    const { default: roleGuard } = await import('./role.guard');
    const next = vi.fn();
    roleGuard({ meta: { requiredRole: 'admin' } } as never, {} as never, next);
    expect(next).toHaveBeenCalledWith('/pets');
  });
});

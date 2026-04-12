import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import type { App } from 'vue';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
    },
  },
});

export const vueQueryPlugin = {
  install(app: App): void {
    app.use(VueQueryPlugin, { queryClient });
  },
};

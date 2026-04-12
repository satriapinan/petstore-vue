import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Spinner from './spinner.component.vue';

describe('Spinner', () => {
  it('renders spinner element', () => {
    const wrapper = mount(Spinner);
    expect(wrapper.find('.spinner').exists()).toBe(true);
  });

  it('applies custom size', () => {
    const wrapper = mount(Spinner, { props: { size: 40 } });
    const spinner = wrapper.find('.spinner').element as HTMLElement;
    expect(spinner.style.width).toBe('40px');
    expect(spinner.style.height).toBe('40px');
  });

  it('applies custom color', () => {
    const wrapper = mount(Spinner, { props: { color: 'red' } });
    const spinner = wrapper.find('.spinner').element as HTMLElement;
    expect(spinner.style.borderTopColor).toBe('red');
  });

  it('uses default size and color', () => {
    const wrapper = mount(Spinner);
    const spinner = wrapper.find('.spinner').element as HTMLElement;
    expect(spinner.style.width).toBe('20px');
    expect(spinner.style.height).toBe('20px');
  });
});

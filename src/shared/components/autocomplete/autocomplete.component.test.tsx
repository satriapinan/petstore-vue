import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Autocomplete from './autocomplete.component.vue';

vi.mock('@iconify/vue', () => ({
  Icon: { template: '<span data-testid="icon" />' },
}));

const options = ['Apple', 'Banana', 'Cherry'];

describe('Autocomplete', () => {
  it('renders label', () => {
    const wrapper = mount(Autocomplete, { props: { label: 'Fruit', value: '', options } });
    expect(wrapper.text()).toContain('Fruit');
  });

  it('renders input with value', () => {
    const wrapper = mount(Autocomplete, { props: { label: 'Fruit', value: 'Apple', options } });
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('Apple');
  });

  it('shows dropdown on focus', async () => {
    const wrapper = mount(Autocomplete, { props: { label: 'Fruit', value: '', options } });
    await wrapper.find('input').trigger('focus');
    expect(wrapper.text()).toContain('Apple');
    expect(wrapper.text()).toContain('Banana');
  });

  it('filters options based on input value', async () => {
    const wrapper = mount(Autocomplete, { props: { label: 'Fruit', value: 'an', options } });
    await wrapper.find('input').trigger('focus');
    expect(wrapper.text()).toContain('Banana');
    expect(wrapper.text()).not.toContain('Apple');
  });

  it('emits change when option selected', async () => {
    const wrapper = mount(Autocomplete, { props: { label: 'Fruit', value: '', options } });
    await wrapper.find('input').trigger('focus');
    await wrapper.findAll('.dropdown-item')[0].trigger('mousedown');
    expect(wrapper.emitted('change')?.[0]).toEqual(['Apple']);
  });

  it('emits change when typing', async () => {
    const wrapper = mount(Autocomplete, { props: { label: 'Fruit', value: '', options } });
    await wrapper.find('input').setValue('B');
    expect(wrapper.emitted('change')?.[0]).toEqual(['B']);
  });
});

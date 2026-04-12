import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Textfield from './textfield.component.vue';

describe('Textfield', () => {
  it('renders label', () => {
    const wrapper = mount(Textfield, { props: { label: 'Username', value: '' } });
    expect(wrapper.text()).toContain('Username');
  });

  it('renders input with value', () => {
    const wrapper = mount(Textfield, { props: { label: 'Username', value: 'john' } });
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('john');
  });

  it('emits change when input changes', async () => {
    const wrapper = mount(Textfield, { props: { label: 'Username', value: '' } });
    await wrapper.find('input').setValue('new');
    expect(wrapper.emitted('change')?.[0]).toEqual(['new']);
  });

  it('renders password type input', () => {
    const wrapper = mount(Textfield, { props: { label: 'Password', value: '', type: 'password' } });
    expect(wrapper.find('input').attributes('type')).toBe('password');
  });

  it('renders placeholder', () => {
    const wrapper = mount(Textfield, {
      props: { label: 'Name', value: '', placeholder: 'Enter name' },
    });
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter name');
  });
});

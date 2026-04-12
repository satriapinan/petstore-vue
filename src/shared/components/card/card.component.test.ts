import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Card from './card.component.vue';

describe('Card', () => {
  it('renders children via slot', () => {
    const wrapper = mount(Card, { slots: { default: '<p>Hello</p>' } });
    expect(wrapper.text()).toContain('Hello');
  });

  it('applies default padding', () => {
    const wrapper = mount(Card);
    expect((wrapper.element as HTMLElement).style.padding).toBe('36px');
  });

  it('applies custom padding', () => {
    const wrapper = mount(Card, { props: { padding: '16px' } });
    expect((wrapper.element as HTMLElement).style.padding).toBe('16px');
  });

  it('applies custom background', () => {
    const wrapper = mount(Card, { props: { background: 'red' } });
    expect((wrapper.element as HTMLElement).style.background).toBe('red');
  });

  it('applies custom minWidth', () => {
    const wrapper = mount(Card, { props: { minWidth: '300px' } });
    expect((wrapper.element as HTMLElement).style.minWidth).toBe('300px');
  });

  it('applies customStyle', () => {
    const wrapper = mount(Card, { props: { customStyle: { color: 'blue' } } });
    expect((wrapper.element as HTMLElement).style.color).toBe('blue');
  });
});

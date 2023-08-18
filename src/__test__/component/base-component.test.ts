/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable prefer-destructuring */
import EventEmitter from '../../app/shared/util/emitter';
import BaseComponent from '../../app/shared/view/base-component';

class MockComponent extends BaseComponent {
  public render(parent: HTMLElement): void {
    this.container = BaseComponent.renderElem(parent, 'div', ['mock']);
  }
}

describe('test BaseComponent', () => {
  let component: BaseComponent;
  const emitter = new EventEmitter();
  const parent = document.createElement('div');

  beforeEach(() => {
    parent.innerHTML = '';
    component = new MockComponent(emitter);
    component.render(parent);
  });

  describe('test show and hide methods', () => {
    test('should set display:none to component container', () => {
      component.hide();
      const container = component['container'];
      const containerStyle = getComputedStyle(container);
      expect(containerStyle.display).toBe('none');
      expect(component['isShown']).toBe(false);
    });

    test('should set display:block to comoponent container', () => {
      component.hide();
      component.show();
      const container = component['container'];
      const containerStyle = getComputedStyle(container);
      expect(containerStyle.display).toBe('block');
      expect(component['isShown']).toBe(true);
    });
  });

  describe('test static renderElem method', () => {
    const elem = BaseComponent.renderElem(parent, 'div', ['elem'], 'hello');
    const input = BaseComponent.renderElem(parent, 'input', ['input'], null, 'text');

    const [elemChild, inputChild] = Array.from(parent.children);

    expect(elem).toBe(elemChild);
    expect(input).toBe(inputChild);

    expect(elem instanceof HTMLDivElement).toBe(true);
    expect(elem.classList.contains('elem')).toBe(true);
    expect(elem.textContent).toBe('hello');

    expect(input instanceof HTMLInputElement).toBe(true);
    expect(input.classList.contains('input')).toBe(true);
    expect(input.getAttribute('type')).toBe('text');
  });
});

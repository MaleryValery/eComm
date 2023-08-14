import ErrorComponent from '../../app/pages/error-page/error-component';
import EventEmitter from '../../app/shared/util/emitter';
import RouteComponent from '../../app/shared/view/route-component';

describe('Test RouteComponent', () => {
  let routeComponent: RouteComponent;
  const emitter = new EventEmitter();
  const main = document.createElement('main');

  beforeEach(() => {
    routeComponent = new ErrorComponent(emitter, '');
    main.innerHTML = '';
  });

  describe('test render method', () => {
    test('should change isRendered flag', () => {
      expect(routeComponent.isRendered).toBe(false);
      routeComponent.render(main);
      expect(routeComponent.isRendered).toBe(true);
    });

    test('should append component into container', () => {
      routeComponent.render(main);
      const container = main.firstChild as HTMLElement;
      expect(container instanceof HTMLElement).toBe(true);
      expect(container.classList.contains('route__wrapper')).toBe(true);
    });
  });

  describe('test show and hide methods', () => {
    beforeEach(() => {
      routeComponent.render(main);
    });

    test('should remove component from main', () => {
      expect(main.firstChild instanceof HTMLElement).toBe(true);
      routeComponent.hide();
      expect(main.firstChild).toBeNull();
    });

    test('should append component into main', () => {
      routeComponent.hide();
      routeComponent.show();
      const container = main.firstChild as HTMLElement;
      expect(container instanceof HTMLElement).toBe(true);
      expect(container.classList.contains('route__wrapper')).toBe(true);
    });
  });
});

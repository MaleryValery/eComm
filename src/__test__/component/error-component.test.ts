import ErrorComponent from '../../app/pages/error-page/error-component';
import '../../app/pages/error-page/error-page.scss';
import EventEmitter from '../../app/shared/util/emitter';

describe('Test ErrorComponent', () => {
  let errorPage: ErrorComponent;
  const emitter = new EventEmitter();
  const main = document.createElement('main');

  beforeEach(() => {
    errorPage = new ErrorComponent(emitter, '');
    main.innerHTML = '';
  });

  describe('test render method', () => {
    test('should contain correct container className', () => {
      errorPage.render(main);
      const container = main.firstChild as HTMLElement;
      expect(container instanceof HTMLElement).toBe(true);
      expect(container.classList.contains('error404-route')).toBe(true);
    });
  });
});

import LoginComponent from '../../app/pages/login-page/login-component';
import '../../app/shared/styles/login-register.scss';
import EventEmitter from '../../app/shared/util/emitter';

describe('Test LoginComponent', () => {
  let errorPage: LoginComponent;
  const emitter = new EventEmitter();
  const main = document.createElement('main');

  beforeEach(() => {
    errorPage = new LoginComponent(emitter, '/login');
    main.innerHTML = '';
  });

  describe('test render method', () => {
    test('should contain correct container className', () => {
      errorPage.render(main);
      const container = main.firstChild as HTMLElement;
      expect(container instanceof HTMLElement).toBe(true);
      expect(container.classList.contains('login-route')).toBe(true);
    });
  });
});

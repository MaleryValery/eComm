/* eslint-disable import/no-extraneous-dependencies */
import fetchMock from 'jest-fetch-mock';
import RegisterComponent from '../../app/pages/register-page/register-component';
import '../../app/shared/styles/login-register.scss';
import EventEmitter from '../../app/shared/util/emitter';

describe('Test RegisterComponent', () => {
  let errorPage: RegisterComponent;
  const emitter = new EventEmitter();
  const main = document.createElement('main');

  beforeEach(() => {
    errorPage = new RegisterComponent(emitter, '/login');
    main.innerHTML = '';
    fetchMock.resetMocks();
  });

  describe('test render method', () => {
    test('should contain correct container className', () => {
      errorPage.render(main);
      const container = main.firstChild as HTMLElement;
      expect(container instanceof HTMLElement).toBe(true);
      expect(container.classList.contains('register-route')).toBe(true);
    });
  });
});

import fetchMock from 'jest-fetch-mock';
import HomeComponent from '../../app/pages/home-page/home-component';
import '../../app/pages/home-page/home-component.scss';
import EventEmitter from '../../app/shared/util/emitter';

describe('Test HomeComponent', () => {
  let homePage: HomeComponent;
  const emitter = new EventEmitter();
  const main = document.createElement('main');

  beforeEach(() => {
    homePage = new HomeComponent(emitter, '/');
    main.innerHTML = '';
    fetchMock.resetMocks();
  });

  describe('test render method', () => {
    test('should contain correct container className', async () => {
      await homePage.render(main);
      const container = main.firstChild as HTMLElement;
      expect(container instanceof HTMLElement).toBe(true);
      expect(container.classList.contains('home-route')).toBe(true);
    });
  });
});

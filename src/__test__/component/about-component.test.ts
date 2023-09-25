import fetchMock from 'jest-fetch-mock';
import { aboutIntroduction } from '../../app/consts/about-descript';
import AboutComponent from '../../app/pages/about-page/about-component';
import EventEmitter from '../../app/shared/util/emitter';

describe('test AboutComponent', () => {
  let aboutPage: AboutComponent;
  const emitter = new EventEmitter();
  const main = document.createElement('main');

  beforeEach(() => {
    main.innerHTML = '';
    aboutPage = new AboutComponent(emitter, /\/about/);
    fetchMock.resetMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('test render method', () => {
    test('should add correct wrappers', () => {
      aboutPage.render(main);

      const container = main.firstChild as HTMLElement;
      const wrapper = container.querySelector('.about-route__wrapper');
      const cardWrapper = container.querySelector('.about-route__cards-wrapper');

      expect(container.classList.contains('about-route')).toBe(true);
      expect(wrapper instanceof HTMLElement).toBe(true);
      expect(cardWrapper instanceof HTMLElement).toBe(true);
    });

    test('should add correct elems', () => {
      aboutPage.render(main);

      const head = main.querySelector('.about-route__head');
      const introduction = main.querySelector('.about-route__introduction');
      const rsLogo = main.querySelector('.about-route__rs-logo') as HTMLAnchorElement;
      const cards = main.querySelectorAll('.about-card');

      expect(head instanceof HTMLElement).toBe(true);
      expect(introduction instanceof HTMLElement).toBe(true);
      expect(introduction?.textContent).toEqual(aboutIntroduction);
      expect(rsLogo instanceof HTMLAnchorElement).toBe(true);
      expect(rsLogo.href).toEqual('https://rs.school/index.html');
      expect(cards.length).toBe(3);
    });

    test('should render correct card', () => {
      aboutPage.render(main);
      const card = main.querySelector('.about-card') as HTMLElement;

      const img = card.querySelector('.about-card__img') as HTMLImageElement;
      const name = card.querySelector('.about-card__name');
      const descript = card.querySelector('.about-card__descript');
      const role = card.querySelector('.about-card__role');
      const contribution = card.querySelector('.about-card__contribution');
      const git = card.querySelector('.about-card__git');

      expect(img instanceof HTMLImageElement).toBe(true);
      expect(img.getAttribute('alt')).toBe('Developer photo');
      expect(name instanceof HTMLElement).toBe(true);
      expect(descript instanceof HTMLElement).toBe(true);
      expect(role instanceof HTMLElement).toBe(true);
      expect(contribution instanceof HTMLElement).toBe(true);
      expect(git instanceof HTMLAnchorElement).toBe(true);
    });
  });
});

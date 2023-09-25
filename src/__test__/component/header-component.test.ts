/* eslint-disable @typescript-eslint/dot-notation */
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent } from '@testing-library/dom';
import fetchMock from 'jest-fetch-mock';
import '../../app/header-component/header-component.scss';
import HeaderComponent from '../../app/header/header-component';
import EventEmitter from '../../app/shared/util/emitter';

describe('test header component', () => {
  let header: HeaderComponent;
  const emitter = new EventEmitter();
  const { body } = document;

  beforeEach(() => {
    body.innerHTML = '';
    body.classList.remove('no-scroll_tablet');
    header = new HeaderComponent(emitter);
    fetchMock.resetMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('test render menthod', () => {
    test('should render correct wrappers', () => {
      header.render(body);

      const head = body.firstChild as HTMLElement;
      const headerWrapper = head.firstChild as HTMLElement;
      const logoLink = head.querySelector('.logo-link');
      const burgerWrapper = head.querySelector('.header-content-wrapper');
      const nav = head.querySelector('.nav');
      const authoriz = head.querySelector('.authorize');
      const cartWrapper = head.querySelector('.header__cart-wrapper');
      const burger = head.querySelector('.burger');

      expect(head instanceof HTMLElement).toBe(true);
      expect(headerWrapper instanceof HTMLElement).toBe(true);
      expect(logoLink instanceof HTMLAnchorElement).toBe(true);
      expect(burgerWrapper instanceof HTMLElement).toBe(true);
      expect(nav instanceof HTMLElement).toBe(true);
      expect(authoriz instanceof HTMLElement).toBe(true);
      expect(cartWrapper instanceof HTMLElement).toBe(true);
      expect(burger instanceof HTMLElement).toBe(true);
    });

    test('should contain correct links', () => {
      header.render(body);
      const logoLink = body.querySelector('.logo-link') as HTMLAnchorElement;
      const navLinks = Array.from(body.querySelectorAll('.nav__item_link')) as HTMLAnchorElement[];

      expect(logoLink.getAttribute('href')).toBe('#/');
      expect(navLinks[0].getAttribute('href')).toBe('#/');
      expect(navLinks[1].getAttribute('href')).toBe('#/catalog');
      expect(navLinks[2].getAttribute('href')).toBe('#/about');
    });
  });

  describe('test burger click event', () => {
    test('should toggle class burger and header-content wrapper after burger click', () => {
      header.render(body);
      const burger = body.querySelector('.burger') as HTMLElement;

      fireEvent.click(burger);

      const activeBurger = document.querySelector('.burger') as HTMLElement;
      const activeBurgerMenu = document.querySelector('.header-content-wrapper') as HTMLElement;
      const activeBurgerBg = document.querySelector('.burger__bg');

      expect(activeBurger.classList.contains('burger_active')).toBe(true);
      expect(activeBurgerMenu.classList.contains('header-content-wrapper_active')).toBe(true);
      expect(activeBurgerBg?.classList.contains('burger__bg_active')).toBe(true);
      expect(body.classList.contains('no-scroll_tablet')).toBe(true);

      const burgerLine = document.querySelector('.burger__line') as HTMLElement;
      fireEvent.click(burgerLine);

      const inactiveBurger = document.querySelector('.burger') as HTMLElement;
      const inactiveBurgerMenu = document.querySelector('.header-content-wrapper') as HTMLElement;
      const inactiveBurgerBg = document.querySelector('.burger__bg');

      expect(inactiveBurger.classList.contains('burger_active')).toBe(false);
      expect(inactiveBurgerMenu.classList.contains('header-content-wrapper_active')).toBe(false);
      expect(inactiveBurgerBg?.classList.contains('burger__bg_active')).toBe(false);
      expect(body.classList.contains('no-scroll_tablet')).toBe(false);
    });

    test('should remove classes if click on certain elems', () => {
      header.render(body);
      const burger = body.querySelector('.burger') as HTMLElement;

      fireEvent.click(burger);
      const burgerMenu = document.querySelector('.header-content-wrapper') as HTMLElement;
      fireEvent.click(burgerMenu);

      const activeBurger = document.querySelector('.burger') as HTMLElement;
      const activeBurgerMenu = document.querySelector('.header-content-wrapper') as HTMLElement;
      const activeBurgerBg = document.querySelector('.burger__bg') as HTMLElement;

      expect(activeBurger.classList.contains('burger_active')).toBe(true);
      expect(activeBurgerMenu.classList.contains('header-content-wrapper_active')).toBe(true);
      expect(activeBurgerBg?.classList.contains('burger__bg_active')).toBe(true);

      fireEvent.click(burger);
      fireEvent.click(activeBurgerBg);

      const inactiveBurger = document.querySelector('.burger') as HTMLElement;
      const inactiveBurgerMenu = document.querySelector('.header-content-wrapper') as HTMLElement;
      const inactiveBurgerBg = document.querySelector('.burger__bg');

      expect(inactiveBurger.classList.contains('burger_active')).toBe(false);
      expect(inactiveBurgerMenu.classList.contains('header-content-wrapper_active')).toBe(false);
      expect(inactiveBurgerBg?.classList.contains('burger__bg_active')).toBe(false);
      expect(body.classList.contains('no-scroll_tablet')).toBe(false);

      fireEvent.click(burger);
      const authoriz = document.querySelector('.authorize') as HTMLElement;
      fireEvent.click(authoriz);

      const inactiveBurger2 = document.querySelector('.burger') as HTMLElement;
      const inactiveBurgerMenu2 = document.querySelector('.header-content-wrapper') as HTMLElement;
      const inactiveBurgerBg2 = document.querySelector('.burger__bg');

      expect(inactiveBurger2.classList.contains('burger_active')).toBe(false);
      expect(inactiveBurgerMenu2.classList.contains('header-content-wrapper_active')).toBe(false);
      expect(inactiveBurgerBg2?.classList.contains('burger__bg_active')).toBe(false);
      expect(body.classList.contains('no-scroll_tablet')).toBe(false);

      fireEvent.click(burger);
      const navList = document.querySelector('.nav__list') as HTMLElement;
      fireEvent.click(navList);

      const inactiveBurger3 = document.querySelector('.burger') as HTMLElement;
      const inactiveBurgerMenu3 = document.querySelector('.header-content-wrapper') as HTMLElement;
      const inactiveBurgerBg3 = document.querySelector('.burger__bg');

      expect(inactiveBurger3.classList.contains('burger_active')).toBe(false);
      expect(inactiveBurgerMenu3.classList.contains('header-content-wrapper_active')).toBe(false);
      expect(inactiveBurgerBg3?.classList.contains('burger__bg_active')).toBe(false);
      expect(body.classList.contains('no-scroll_tablet')).toBe(false);
    });
  });
});

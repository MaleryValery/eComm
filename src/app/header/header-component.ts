import renderIcon from '../shared/util/render-icon';
import BaseComponent from '../shared/view/base-component';
import AuthorizeComponent from './authorize-component/authorize-component';
import './header-component.scss';

export default class HeaderComponent extends BaseComponent {
  private navLinks: HTMLElement[] = [];

  private header!: HTMLElement;
  private wrapper!: HTMLElement;
  private nav!: HTMLElement;
  private navList!: HTMLElement;
  private logo!: SVGSVGElement;
  private name!: HTMLElement;

  private authoriz = new AuthorizeComponent(this.emitter);

  private cartWrapper!: HTMLElement;
  private cartCount!: HTMLElement;
  private burgerWrapper!: HTMLElement;
  private burger!: HTMLElement;
  private burgerBg!: HTMLElement;

  public render(parent: HTMLElement): void {
    this.header = BaseComponent.renderElem(parent, 'header', ['header']);
    this.wrapper = BaseComponent.renderElem(this.header, 'div', ['header__wrapper']);

    const logoLink = BaseComponent.renderElem(this.wrapper, 'a', ['logo-link']);
    const logoContainer = BaseComponent.renderElem(logoLink, 'div', ['logo-wrapper']);
    this.logo = renderIcon(logoContainer, ['logo'], 'logo');
    this.name = BaseComponent.renderElem(logoContainer, 'h1', ['logo-header', 'text-head-m'], 'S&T');
    logoLink.setAttribute('href', `#/`);

    this.burgerWrapper = BaseComponent.renderElem(this.wrapper, 'div', ['header-content-wrapper']);

    this.nav = BaseComponent.renderElem(this.burgerWrapper, 'nav', ['nav']);
    this.navList = BaseComponent.renderElem(this.nav, 'ul', ['nav__list', 'text-head-m']);
    this.renderLink('Home', `#/`);
    this.renderLink('Catalog', `#/catalog`);
    this.renderLink('About', '#/about');

    this.authoriz.render(this.burgerWrapper);

    this.cartWrapper = BaseComponent.renderElem(this.wrapper, 'a', ['header__cart-wrapper']);
    this.cartCount = BaseComponent.renderElem(this.cartWrapper, 'p', ['header__cart-count'], '00');
    renderIcon(this.cartWrapper, ['header__cart-img'], 'basket');

    this.burger = BaseComponent.renderElem(this.wrapper, 'div', ['burger']);
    BaseComponent.renderElem(this.burger, 'div', ['burger__line']);
    this.burgerBg = BaseComponent.renderElem(document.body, 'div', ['burger__bg']);

    this.bindEvents();
  }

  private bindEvents(): void {
    document.addEventListener('click', (e) => {
      const { target } = e;
      if (!(target instanceof HTMLElement)) return;

      if (target.classList.contains('burger') || target.closest('.burger')) {
        this.burger.classList.toggle('burger_active');
        this.burgerWrapper.classList.toggle('header-content-wrapper_active');
        this.burgerBg.classList.toggle('burger__bg_active');
        document.body.classList.toggle('no-scroll_tablet');
      } else if (
        target.closest('.authorize') ||
        target.closest('.nav__list') ||
        target.classList.contains('burger__bg')
      ) {
        this.burger.classList.remove('burger_active');
        this.burgerWrapper.classList.remove('header-content-wrapper_active');
        this.burgerBg.classList.remove('burger__bg_active');
        document.body.classList.remove('no-scroll_tablet');
      }
    });
  }

  private renderLink(text: string, href: string): void {
    const navItem = BaseComponent.renderElem(this.navList, 'li', ['nav__item']);
    const link = BaseComponent.renderElem(navItem, 'a', ['nav__item_link'], text) as HTMLAnchorElement;
    this.navLinks.push(link);
    link.setAttribute('href', href);
  }
}

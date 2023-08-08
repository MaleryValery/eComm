import ROUTS from '../consts/routes';
import EventEmitter from '../shared/util/emitter';
import BaseComponent from '../shared/view/base-component';
import './header-component.scss';

export default class HeaderComponent extends BaseComponent {
  private navLinks: HTMLElement[] = [];

  private header!: HTMLElement;
  private wrapper!: HTMLElement;
  private nav!: HTMLElement;
  private navList!: HTMLElement;
  private login!: HTMLElement;
  private loginBtn!: HTMLElement;

  constructor(protected readonly emitter: EventEmitter) {
    super(emitter);
  }

  public render(parent: HTMLElement): void {
    this.header = BaseComponent.renderElem(parent, 'header', ['header']);
    this.wrapper = BaseComponent.renderElem(this.header, 'div', ['header__wrapper']);
    this.nav = BaseComponent.renderElem(this.wrapper, 'nav', ['nav']);
    this.navList = BaseComponent.renderElem(this.nav, 'ul', ['nav__list']);

    this.login = BaseComponent.renderElem(this.wrapper, 'div', ['login']);
    this.loginBtn = BaseComponent.renderElem(this.login, 'div', ['login__btn']);

    ROUTS.forEach((route) => {
      if (route.nav) {
        this.renderLink(route.name, `#${route.path}`);
      }
    });
  }

  private renderLink(text: string, href: string): void {
    const navItem = BaseComponent.renderElem(this.navList, 'li', ['nav__item']);
    const link = BaseComponent.renderElem(navItem, 'a', null, text) as HTMLAnchorElement;
    this.navLinks.push(link);
    link.setAttribute('href', href);
  }
}

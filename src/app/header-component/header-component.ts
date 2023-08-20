import BaseComponent from '../shared/view/base-component';
import './header-component.scss';
import ModalAuthorizComponent from './modal-authorization/modal-auth-component';

export default class HeaderComponent extends BaseComponent {
  private navLinks: HTMLElement[] = [];

  protected container!: HTMLElement;
  private wrapper!: HTMLElement;
  private nav!: HTMLElement;
  private navList!: HTMLElement;
  private login!: HTMLElement;
  private loginBtn!: HTMLElement;

  private modal = new ModalAuthorizComponent(this.emitter);

  private bindEvents(): void {
    this.loginBtn.addEventListener('click', () => {
      this.modal.toggleModal();
    });
  }

  public render(parent: HTMLElement): void {
    this.container = BaseComponent.renderElem(parent, 'header', ['header']);
    this.wrapper = BaseComponent.renderElem(this.container, 'div', ['header__wrapper']);
    this.nav = BaseComponent.renderElem(this.wrapper, 'nav', ['nav']);
    this.navList = BaseComponent.renderElem(this.nav, 'ul', ['nav__list']);

    this.login = BaseComponent.renderElem(this.wrapper, 'div', ['login']);
    this.loginBtn = BaseComponent.renderElem(this.login, 'div', ['login__btn']);

    this.renderLink('Home', `#/`);

    this.modal.render(this.login);

    this.bindEvents();
  }

  private renderLink(text: string, href: string): void {
    const navItem = BaseComponent.renderElem(this.navList, 'li', ['nav__item']);
    const link = BaseComponent.renderElem(navItem, 'a', null, text) as HTMLAnchorElement;
    this.navLinks.push(link);
    link.setAttribute('href', href);
  }
}

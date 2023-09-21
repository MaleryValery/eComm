import BaseComponent from '../shared/view/base-component';
import AuthorizeComponent from './authorize-component/authorize-component';
import './header-component.scss';

export default class HeaderComponent extends BaseComponent {
  private navLinks: HTMLElement[] = [];

  private header!: HTMLElement;
  private wrapper!: HTMLElement;
  private nav!: HTMLElement;
  private navList!: HTMLElement;

  private authoriz = new AuthorizeComponent(this.emitter);

  public render(parent: HTMLElement): void {
    this.header = BaseComponent.renderElem(parent, 'header', ['header']);
    this.wrapper = BaseComponent.renderElem(this.header, 'div', ['header__wrapper']);
    this.nav = BaseComponent.renderElem(this.wrapper, 'nav', ['nav']);
    this.navList = BaseComponent.renderElem(this.nav, 'ul', ['nav__list']);

    this.renderLink('Home', `#/`);

    this.authoriz.render(this.wrapper);
  }

  private renderLink(text: string, href: string): void {
    const navItem = BaseComponent.renderElem(this.navList, 'li', ['nav__item']);
    const link = BaseComponent.renderElem(navItem, 'a', ['nav__item_link'], text) as HTMLAnchorElement;
    this.navLinks.push(link);
    link.setAttribute('href', href);
  }
}

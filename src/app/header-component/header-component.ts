import { Routes } from '../shared/types/routes-type';
import EventEmitter from '../shared/util/emitter';
import BaseComponent from '../shared/view/base-component';
import AuthorizComponent from './authoriz-component/authoriz-component';
import './header-component.scss';

export default class HeaderComponent extends BaseComponent {
  private routes: Routes;
  private navLinks: HTMLElement[] = [];

  private header!: HTMLElement;
  private wrapper!: HTMLElement;
  private nav!: HTMLElement;
  private navList!: HTMLElement;

  private authoriz = new AuthorizComponent(this.emitter);

  constructor(emitter: EventEmitter, routes: Routes) {
    super(emitter);
    this.routes = routes;
  }

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
    const link = BaseComponent.renderElem(navItem, 'a', null, text) as HTMLAnchorElement;
    this.navLinks.push(link);
    link.setAttribute('href', href);
  }
}

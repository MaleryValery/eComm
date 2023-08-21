import AuthService from '../../services/auth-service';
import BaseComponent from '../../shared/view/base-component';

import './authoriz-component.scss';

export default class AuthorizeComponent extends BaseComponent {
  private loginLink!: HTMLAnchorElement;
  private registerLink!: HTMLAnchorElement;
  private logoutLink!: HTMLAnchorElement;
  private nameLink!: HTMLAnchorElement;

  public render(parent: HTMLElement): void {
    const isLogin = AuthService.isAuthorized();

    this.container = BaseComponent.renderElem(parent, 'div', ['authoriz']);
    this.loginLink = BaseComponent.renderElem(this.container, 'a', ['authoriz__route'], 'Login') as HTMLAnchorElement;
    this.loginLink.href = '#/login';
    this.registerLink = BaseComponent.renderElem(
      this.container,
      'a',
      ['authoriz__route'],
      'Register'
    ) as HTMLAnchorElement;
    this.registerLink.href = '#/register';

    this.logoutLink = BaseComponent.renderElem(this.container, 'a', ['authoriz__route'], 'Logout') as HTMLAnchorElement;
    this.logoutLink.href = '#/';

    this.nameLink = document.createElement('a');
    this.nameLink.classList.add('authoriz__route');

    if (!isLogin) {
      this.logoutLink.remove();
    } else {
      this.container.prepend(this.nameLink);
      this.nameLink.textContent = AuthService.user?.firstName as string;
    }

    this.bindEvents();
    this.subscribeEvents();
  }

  private bindEvents() {
    this.logoutLink.addEventListener('click', () => {
      this.onLogout();
    });
  }

  private subscribeEvents() {
    this.emitter.subscribe('login', () => {
      this.show();
    });
  }

  private onLogout() {
    AuthService.logout();
    this.logoutLink.remove();
    this.nameLink.remove();
  }

  public show(): void {
    this.container.append(this.logoutLink);

    this.nameLink.textContent = AuthService.user?.firstName as string;
    this.container.prepend(this.nameLink);
  }
}

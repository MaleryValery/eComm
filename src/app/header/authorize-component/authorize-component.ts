import { Customer } from '@commercetools/platform-sdk';
import AuthService from '../../services/auth-service';
import BaseComponent from '../../shared/view/base-component';

import './authorize-component.scss';

export default class AuthorizeComponent extends BaseComponent {
  private loginLink!: HTMLAnchorElement;
  private registerLink!: HTMLAnchorElement;
  private logoutLink!: HTMLAnchorElement;
  private nameLink!: HTMLAnchorElement;

  public render(parent: HTMLElement): void {
    const isLogin = AuthService.isAuthorized();
    // todo should be burger in menu in sprint-3
    this.container = BaseComponent.renderElem(parent, 'div', ['authorize', 'text-hint']);
    this.loginLink = BaseComponent.renderElem(this.container, 'a', ['authorize__route'], 'Login') as HTMLAnchorElement;
    this.loginLink.href = '#/login';
    this.registerLink = BaseComponent.renderElem(
      this.container,
      'a',
      ['authorize__route'],
      'Register'
    ) as HTMLAnchorElement;
    this.registerLink.href = '#/register';

    this.logoutLink = BaseComponent.renderElem(
      this.container,
      'a',
      ['authorize__route'],
      'Logout'
    ) as HTMLAnchorElement;
    this.logoutLink.href = '#/';

    this.nameLink = document.createElement('a');
    this.nameLink.classList.add('authorize__route');
    this.nameLink.href = '#/profile';

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

    this.emitter.subscribe('updateProfile', (updatedCustomer: Customer) => {
      const { firstName } = updatedCustomer;
      this.nameLink.textContent = firstName as string;
    });
  }

  private onLogout() {
    this.emitter.emit('logout', null);

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

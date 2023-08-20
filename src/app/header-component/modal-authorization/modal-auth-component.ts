import BaseComponent from '../../shared/view/base-component';

export default class ModalAuthorizComponent extends BaseComponent {
  protected isShown = false;

  private loginLink!: HTMLAnchorElement;
  private registerLink!: HTMLAnchorElement;

  private bindEvents(): void {
    this.container.addEventListener('click', (e) => {
      if (!(e.target instanceof HTMLElement)) return;
      if (e.target.classList.contains('login__route')) {
        this.hide();
      }
    });

    document.addEventListener('click', (e) => {
      if (!(e.target instanceof HTMLElement)) return;
      if (!e.target.closest('.login') && this.isShown) {
        this.hide();
      }
    });
  }

  public render(parent: HTMLElement): void {
    this.container = BaseComponent.renderElem(parent, 'div', ['login__menu']);
    this.loginLink = BaseComponent.renderElem(
      this.container,
      'a',
      ['login__route', 'login__btn_login'],
      'Login'
    ) as HTMLAnchorElement;
    this.loginLink.href = '#/login';
    this.registerLink = BaseComponent.renderElem(
      this.container,
      'a',
      ['login__route', 'login__btn_register'],
      'Register'
    ) as HTMLAnchorElement;
    this.registerLink.href = '#/register';

    this.bindEvents();
  }

  public toggleModal(): void {
    if (this.isShown) {
      this.hide();
    } else {
      this.onLogin();
    }
  }
}

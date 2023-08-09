import '../../shared/styles/login-register.scss';
import renderInput from '../../shared/util/renderInput';
import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';

export default class LoginComponent extends RouteComponent {
  private form!: HTMLFormElement;
  private emailInput!: HTMLInputElement;
  private passwordInput!: HTMLInputElement;

  private btnContainer!: HTMLElement;
  private btnLogin!: HTMLButtonElement;
  private btnRegister!: HTMLAnchorElement;

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('login-route');

    this.form = BaseComponent.renderElem(this.container, 'form', ['login-route__form']) as HTMLFormElement;
    this.emailInput = renderInput(this.form, 'email-inp', 'email', 'Email:');
    this.passwordInput = renderInput(this.form, 'password-inp', 'password', 'Password:');

    this.btnContainer = BaseComponent.renderElem(this.form, 'div', ['btn-container']);
    this.btnLogin = BaseComponent.renderElem(
      this.btnContainer,
      'button',
      ['btn-container__submit'],
      'Login'
    ) as HTMLButtonElement;
    this.btnLogin.type = 'submit';

    this.btnRegister = BaseComponent.renderElem(
      this.btnContainer,
      'a',
      ['btn-container__register'],
      'Register'
    ) as HTMLAnchorElement;
    this.btnRegister.href = '#/register';
  }
}

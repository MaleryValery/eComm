import '../../shared/styles/login-register.scss';
import { renderInput } from '../../shared/util/renderInput';
import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import ValidatorController from '../../shared/util/validator';
import AuthService from '../../services/auth-service';
// import { anonymApiRoot } from '../../sh  ared/util/client-builder';

export default class LoginComponent extends RouteComponent {
  private form!: HTMLFormElement;
  private emailInput!: HTMLInputElement;
  private passwordInput!: HTMLInputElement;

  private btnContainer!: HTMLElement;
  private btnLogin!: HTMLButtonElement;
  private btnRegister!: HTMLAnchorElement;

  private message!: HTMLElement;

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('login-route');

    this.message = BaseComponent.renderElem(this.container, 'div', ['message']);
    this.renderLoginForm();
    this.renderAuthButtons();

    this.onLoginBtn();
  }

  private renderLoginForm() {
    this.form = BaseComponent.renderElem(this.container, 'form', ['login-route__form']) as HTMLFormElement;
    this.emailInput = renderInput(this.form, 'email-inp', 'text', 'Email:');
    this.passwordInput = renderInput(this.form, 'password-inp', 'password', 'Password:');

    // todo mistake should disapire after user start change filds
    this.form.addEventListener('focusin', this.clearMessage.bind(this));
  }

  private renderAuthButtons(): void {
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

  private onLoginBtn(): void {
    this.btnLogin.addEventListener('click', (e) => {
      e.preventDefault();
      if (
        ValidatorController.validateEmail(this.emailInput.value) &&
        ValidatorController.validatePassword(this.passwordInput.value)
      ) {
        AuthService.login(this.emailInput.value, this.passwordInput.value).catch((error) =>
          this.showError(error.message)
        );
      } else {
        console.log('Email or password is invalid.');
      }
    });
  }

  private showError(error: string) {
    this.message.textContent = `${error}.
     Try one more time or register.`;
    this.emailInput.classList.add('error-login');
    this.passwordInput.classList.add('error-login');
  }
  private clearMessage() {
    this.message.textContent = '';
    this.emailInput.classList.remove('error-login');
    this.passwordInput.classList.remove('error-login');
  }
}

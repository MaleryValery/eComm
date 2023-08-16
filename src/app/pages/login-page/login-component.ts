import '../../shared/styles/login-register.scss';
import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import CustomInput from '../../shared/view/custom-input';
import ValidatorController from '../../shared/util/validator-controller';

export default class LoginComponent extends RouteComponent {
  private form!: HTMLFormElement;
  private emailInput: CustomInput = new CustomInput();
  private passwordInput: CustomInput = new CustomInput();

  private btnContainer!: HTMLElement;
  private btnLogin!: HTMLButtonElement;
  private btnRegister!: HTMLAnchorElement;

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('login-route');

    this.renderLoginForm();
    this.renderAuthButtons();
    this.onLoginBtn();
  }

  private renderLoginForm() {
    this.form = BaseComponent.renderElem(this.container, 'form', ['login-route__form']) as HTMLFormElement;

    this.emailInput.render(this.form, 'email-inp', 'text', 'Email:', true);
    this.emailInput.applyValidators([ValidatorController.validateEmail, ValidatorController.required]);

    this.passwordInput.render(this.form, 'password-inp', 'password', 'Password:', true);
    this.passwordInput.applyValidators([ValidatorController.validatePassword, ValidatorController.required]);
  }

  private renderAuthButtons() {
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
      'Create an account'
    ) as HTMLAnchorElement;
    this.btnRegister.href = '#/register';
  }

  private onLoginBtn() {
    this.btnLogin.addEventListener('click', () => {
      if (this.emailInput.isValid() && this.passwordInput.isValid()) {
        // login(this.emailInput.value, this.passwordInput.value); /// add actual login func
      }
    });
  }
}

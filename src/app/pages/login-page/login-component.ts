import AuthService from '../../services/auth-service';
import '../../shared/styles/authorize-forms.scss';
import ApiMessageHandler from '../../shared/util/api-message-handler';
import ValidatorController from '../../shared/util/validator-controller';
import BaseComponent from '../../shared/view/base-component';
import CustomInput from '../../shared/view/custom-input';
import RouteComponent from '../../shared/view/route-component';

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

    const headingContainer = BaseComponent.renderElem(this.container, 'div', ['heading-wrapper']);
    BaseComponent.renderElem(headingContainer, 'h2', ['heading__form', 'text-head-m'], 'Welcome back!');
    BaseComponent.renderElem(
      headingContainer,
      'p',
      ['subheading__form', 'text-hint'],
      'Enter your email to log in to your account'
    );

    this.renderLoginForm();
    this.renderAuthButtons();
    this.onLoginBtn();
  }

  private renderLoginForm() {
    this.form = BaseComponent.renderElem(this.container, 'form', ['login-route__form']) as HTMLFormElement;

    this.emailInput.render(this.form, 'email-inp', 'text', 'Email:', true);
    this.emailInput.applyValidators([ValidatorController.validateEmail]);

    this.passwordInput.render(this.form, 'password-inp', 'password', 'Password:', true);
    this.passwordInput.applyValidators([ValidatorController.validatePassword]);
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

    const registerContainer = BaseComponent.renderElem(
      this.btnContainer,
      'div',
      ['text-hint', 'register-container__submit'],
      'are you new here? '
    );

    this.btnRegister = BaseComponent.renderElem(
      registerContainer,
      'a',
      ['text-hint', 'link-container__register'],
      'Create an account'
    ) as HTMLAnchorElement;
    this.btnRegister.href = '#/register';
  }

  private onLoginBtn() {
    this.btnLogin.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.emailInput.isValid() && this.passwordInput.isValid()) {
        AuthService.login(this.emailInput.value, this.passwordInput.value)
          .then(() => {
            this.emitter.emit('login', null);
            this.clearLoginFields();
          })
          .catch((err) => ApiMessageHandler.showMessage(err.message, 'fail'));
      } else {
        ApiMessageHandler.showMessage('Email or password is invalid', 'fail');
        this.showInputsErrors();
      }
    });
  }

  private showInputsErrors() {
    this.emailInput.showError();
    this.passwordInput.showError();
  }

  private clearLoginFields() {
    this.emailInput.value = '';
    this.passwordInput.value = '';
  }
}

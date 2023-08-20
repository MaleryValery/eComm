import '../../shared/styles/login-register.scss';
import renderInput from '../../shared/util/render-input';
import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';

export default class RegisterComponent extends RouteComponent {
  private form!: HTMLFormElement;
  private firstNameInput!: HTMLInputElement;
  private lastNameInput!: HTMLInputElement;
  private emailInput!: HTMLInputElement;
  private passwordInput!: HTMLInputElement;
  private repeatPasswordInput!: HTMLInputElement;

  private btnContainer!: HTMLElement;
  private btnRegister!: HTMLButtonElement;

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('register-route');

    this.form = BaseComponent.renderElem(this.container, 'form', ['register-route__form']) as HTMLFormElement;
    this.firstNameInput = renderInput(this.form, 'fname-inp', 'text', 'First name:');
    this.lastNameInput = renderInput(this.form, 'lname-inp', 'text', 'Last name:');
    this.emailInput = renderInput(this.form, 'email-inp', 'email', 'Email:');
    this.passwordInput = renderInput(this.form, 'fpassword-inp', 'password', 'Password:');
    this.repeatPasswordInput = renderInput(this.form, 'lpassword-inp', 'password', 'Retype password:');

    this.btnContainer = BaseComponent.renderElem(this.form, 'div', ['btn-container']);
    this.btnRegister = BaseComponent.renderElem(
      this.btnContainer,
      'button',
      ['btn-container__submit'],
      'Create an account'
    ) as HTMLButtonElement;
    this.btnRegister.type = 'submit';
  }
}

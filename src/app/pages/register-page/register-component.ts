import '../../shared/styles/login-register.scss';
import renderInput from '../../shared/util/renderInput';
import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import { NewCustomer } from '../../shared/types/customers-type';

export default class RegisterComponent extends RouteComponent {
  private form!: HTMLFormElement;
  private firstNameInput!: HTMLInputElement;
  private lastNameInput!: HTMLInputElement;
  private emailInput!: HTMLInputElement;
  private passwordInput!: HTMLInputElement;
  private repeatPasswordInput!: HTMLInputElement;

  private message!: HTMLElement;
  private btnContainer!: HTMLElement;
  private btnRegister!: HTMLButtonElement;

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('register-route');

    this.message = BaseComponent.renderElem(this.container, 'div', ['message']);
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
    this.btnRegister.addEventListener('click', this.onSubmitBtn.bind(this));
    this.subRegisterView();
    this.clearMessage();
  }

  private subRegisterView() {
    this.emitter.subscribe('successfulRegistr', () => this.showSuccessfulRegistr());
    this.emitter.subscribe('failedRegistr', () => this.showFailedRegistr());
  }

  private onSubmitBtn() {
    const customer = this.createCustomerObj();
    this.emitter.emit('submitRegistr', customer);
  }

  private createCustomerObj() {
    const newCostomerObj: NewCustomer = {
      email: this.emailInput.value,
      firstName: this.firstNameInput.value,
      lastName: this.lastNameInput.value,
      password: this.passwordInput.value,
    };
    return newCostomerObj;
  }
  // todo think how to manage message and form after fail and after success
  private showSuccessfulRegistr() {
    this.clearMessage();
    this.message.textContent = 'Congrads!🎊 you have just resiter in our amaising store';
    this.clearFields();
  }

  private showFailedRegistr() {
    this.message.textContent = 'Oups!🫠 something went wrong';
  }
  private clearMessage() {
    this.message.textContent = '';
  }

  private clearFields() {
    this.emailInput.value = '';
    this.firstNameInput.value = '';
    this.lastNameInput.value = '';
    this.passwordInput.value = '';
    this.repeatPasswordInput.value = '';
  }
}

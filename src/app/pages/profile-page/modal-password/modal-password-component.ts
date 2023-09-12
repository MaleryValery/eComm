import { Customer } from '@commercetools/platform-sdk';
import AuthService from '../../../services/auth-service';
import ApiMessageHandler from '../../../shared/util/api-message-handler';
import ValidatorController from '../../../shared/util/validator-controller';
import BaseComponent from '../../../shared/view/base-component';
import CustomInput from '../../../shared/view/custom-input';

import './modal-password-component.scss';
import Loader from '../../../shared/view/loader/loader';

export default class ModalPasswordComponent extends BaseComponent {
  public isRendered = false;
  public isShown = false;

  protected container!: HTMLElement;
  private wrapper!: HTMLElement;
  private form!: HTMLElement;

  private oldPasswordInp = new CustomInput();
  private newPasswordInp = new CustomInput();
  private retypePasswordInp = new CustomInput();

  private btnCancel!: HTMLElement;
  private btnSubmit!: HTMLElement;

  private loader = new Loader();

  public render(parent: HTMLElement): void {
    this.container = BaseComponent.renderElem(parent, 'div', ['modal-password']);
    this.wrapper = BaseComponent.renderElem(this.container, 'section', ['modal-password__wrapper']);
    BaseComponent.renderElem(this.wrapper, 'h2', ['modal-password__heading'], 'Change password');

    this.form = BaseComponent.renderElem(this.wrapper, 'form', ['modal-password__form']);

    this.oldPasswordInp.render(this.form, 'old-password-inp', 'password', 'Password:', true);
    this.oldPasswordInp.applyValidators([ValidatorController.validatePassword, ValidatorController.required]);

    this.newPasswordInp.render(this.form, 'new-password-inp', 'password', 'New password:', true);
    this.newPasswordInp.applyValidators([ValidatorController.validatePassword, ValidatorController.required]);

    this.retypePasswordInp.render(this.form, 'retype-password-inp', 'password', 'Retype password:', true);
    this.retypePasswordInp.applyRetypePassValidators(this.newPasswordInp);

    const btnContainer = BaseComponent.renderElem(this.wrapper, 'div', ['modal-password__buttons']);
    this.btnCancel = BaseComponent.renderElem(btnContainer, 'button', ['modal-password__btn-cancel'], 'Cancel');
    this.btnSubmit = BaseComponent.renderElem(
      btnContainer,
      'button',
      ['modal-password__btn-submit'],
      'Submit',
      'submit'
    );

    this.loader.init(this.btnSubmit);
    this.bindEvents();
    this.subscribeEvents();
    this.isRendered = true;
    this.hide();
  }

  private bindEvents(): void {
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) this.hide();
      if (e.target === this.btnCancel) {
        this.hide();
      }
      if (e.target === this.btnSubmit) {
        this.submitPassword();
      }
    });

    this.form.addEventListener('keydown', (e) => {
      if (e.code === 'Enter') {
        this.submitPassword();
      }
    });
  }

  private subscribeEvents(): void {
    this.emitter.subscribe('hashchange', () => this.hide());
  }

  private async submitPassword(): Promise<void> {
    try {
      if (this.oldPasswordInp.isValid() && this.newPasswordInp.isValid() && this.retypePasswordInp.isValid()) {
        this.loader.show();

        AuthService.checkRefreshtToken();
        await AuthService.changePassword(
          AuthService.user?.version as number,
          this.oldPasswordInp.value,
          this.newPasswordInp.value
        );

        const { email } = AuthService.user as Customer;
        localStorage.removeItem('sntToken');

        AuthService.createApiRootPassword(email, this.newPasswordInp.value);

        await AuthService.apiRootPassword
          .me()
          .login()
          .post({
            body: {
              email,
              password: this.newPasswordInp.value,
            },
          })
          .execute();

        const newCustomer = await AuthService.apiRootPassword.me().get().execute();
        AuthService.user = newCustomer.body;

        ApiMessageHandler.showMessage('You successfully change password!', 'success');
        this.loader.hide();
        this.hide();
      } else {
        this.oldPasswordInp.showError();
        this.newPasswordInp.showError();
        this.retypePasswordInp.showError();
        ApiMessageHandler.showMessage('Validation error, check inputs errors', 'fail');
      }
    } catch (e) {
      this.loader.hide();
      ApiMessageHandler.showMessage((e as Error).message, 'fail');
    }
  }

  public show(): void {
    super.show();
    document.body.style.overflow = 'hidden';
  }

  public hide(): void {
    super.hide();
    document.body.style.overflow = 'auto';
    this.oldPasswordInp.value = '';
    this.oldPasswordInp.hideError();
    this.newPasswordInp.value = '';
    this.newPasswordInp.hideError();
    this.retypePasswordInp.value = '';
    this.retypePasswordInp.hideError();
  }
}

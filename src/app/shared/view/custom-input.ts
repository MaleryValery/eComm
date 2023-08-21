import ValidationFn from '../types/validation-fn';
import BaseComponent from './base-component';
import validationErrorsPipe from '../util/validation-errors-pipe';
import ValidatorController from '../util/validator-controller';

class CustomInput {
  private validationError: string | null = null;
  private label!: HTMLLabelElement;
  private input!: HTMLInputElement;
  private errorMessage!: HTMLElement;
  private passwordEyeEl!: HTMLElement;
  private inputContainer!: HTMLElement;

  public render(
    parent: HTMLElement,
    id: string,
    type: string,
    labelText: string,
    isRequired: boolean
  ): HTMLInputElement {
    this.inputContainer = BaseComponent.renderElem(parent, 'div', ['input-container']);
    this.label = BaseComponent.renderElem(
      this.inputContainer,
      'label',
      ['input-container__label'],
      labelText
    ) as HTMLLabelElement;

    if (this.label instanceof HTMLLabelElement) this.label.htmlFor = id;

    this.input = BaseComponent.renderElem(
      this.inputContainer,
      'input',
      ['input-container__input'],
      null,
      type
    ) as HTMLInputElement;

    this.input.id = id;
    this.errorMessage = BaseComponent.renderElem(this.inputContainer, 'div', ['input-errors']);

    if (isRequired) {
      this.label.classList.add('required');
      const inputValidationResult = { required: true };
      this.validationError = validationErrorsPipe(inputValidationResult);
    }

    this.checkType();

    return this.input;
  }

  public applyValidators(validators: ValidationFn<string>[]) {
    this.input.addEventListener('input', () => {
      const inputValidationResult = {};

      validators.forEach((validator) => {
        const validationResult = validator(this.input.value);
        Object.assign(inputValidationResult, validationResult);
      });

      this.validationError = validationErrorsPipe(inputValidationResult);

      this.showError();
    });
  }

  public applyRetypePassValidators(passwordInput: CustomInput) {
    this.input.addEventListener('input', () => {
      const inputValidationResult = {
        ...ValidatorController.validatePasswordMatch(passwordInput.value, this.input.value),
        ...ValidatorController.required(this.input.value),
      };

      this.validationError = validationErrorsPipe(inputValidationResult);

      this.showError();
    });
  }

  public applyPostalCodeValidators(countryCode: string) {
    this.input.addEventListener('input', () => {
      const inputValidationResult = {
        ...ValidatorController.validatePostalCode(this.input.value, countryCode),
      };

      this.validationError = validationErrorsPipe(inputValidationResult);

      this.showError();
    });
  }

  public isValid() {
    return this.validationError === null;
  }

  get value() {
    return this.input.value;
  }

  set value(data: string) {
    this.input.value = data;
  }

  set max(data: string) {
    this.input.max = data;
  }

  private checkType() {
    if (this.input.type === 'password') {
      this.passwordEyeEl = BaseComponent.renderElem(this.inputContainer, 'span', [
        'toggle-password',
        'password-eye-close',
      ]);
      this.ontogglePasswordType();
    }
  }

  private ontogglePasswordType() {
    this.passwordEyeEl.addEventListener('click', () => {
      if (this.passwordEyeEl.classList.contains('password-eye-close')) {
        this.passwordEyeEl.classList.remove('password-eye-close');
        this.passwordEyeEl.classList.add('password-eye-open');
        this.input.type = 'text';
      } else {
        this.passwordEyeEl.classList.add('password-eye-close');
        this.passwordEyeEl.classList.remove('password-eye-open');
        this.input.type = 'password';
      }
    });
  }

  showError() {
    this.errorMessage.textContent = this.validationError;
  }

  public dispatchInputEvent() {
    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true,
    });

    this.input.dispatchEvent(inputEvent);
  }
}

export default CustomInput;

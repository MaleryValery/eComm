import ValidationFn from '../types/validation-fn';
import BaseComponent from './base-component';
import validationErrorsPipe from '../util/validation-errors-pipe';

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

    if (isRequired) {
      this.label.classList.add('required');
      this.validationError = 'required';
    }

    this.errorMessage = BaseComponent.renderElem(this.inputContainer, 'div', ['input-errors']);

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

      this.errorMessage.textContent = this.validationError;
    });
  }

  public isValid() {
    return this.validationError === null;
  }

  get value() {
    return this.input.value;
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
}

export default CustomInput;

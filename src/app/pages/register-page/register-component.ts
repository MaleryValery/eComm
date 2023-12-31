import COUNTRIES from '../../consts/countries';
import AuthService from '../../services/auth-service';
import '../../shared/styles/authorize-forms.scss';
import { CustomerAddress } from '../../shared/types/address-type';
import { NewCustomer } from '../../shared/types/customers-type';
import ApiMessageHandler from '../../shared/util/api-message-handler';
import Loader from '../../shared/view/loader/loader';
import renderCheckbox from '../../shared/util/render-checkbox';
import renderSelect from '../../shared/util/render-select';
import ValidatorController from '../../shared/util/validator-controller';
import BaseComponent from '../../shared/view/base-component';
import CustomInput from '../../shared/view/custom-input';
import RouteComponent from '../../shared/view/route-component';
import './register-component.scss';

export default class RegisterComponent extends RouteComponent {
  private form!: HTMLFormElement;
  private firstNameInput: CustomInput = new CustomInput();
  private lastNameInput: CustomInput = new CustomInput();
  private emailInput: CustomInput = new CustomInput();
  private passwordInput: CustomInput = new CustomInput();
  private repeatPasswordInput: CustomInput = new CustomInput();
  private dateOfBirth: CustomInput = new CustomInput();

  private addressShipStreet: CustomInput = new CustomInput();
  private addressShipCity: CustomInput = new CustomInput();
  private addressShipZip: CustomInput = new CustomInput();
  private addressShipCountry!: HTMLSelectElement;
  private addressShipStreetNumber: CustomInput = new CustomInput();

  private addressBillContainer!: HTMLElement;
  private addressBillStreet: CustomInput = new CustomInput();
  private addressBillCity = new CustomInput();
  private addressBillZip: CustomInput = new CustomInput();
  private addressBillCountry!: HTMLSelectElement;
  private addressBillStreetNumber: CustomInput = new CustomInput();

  private isDefaultShipingAddress!: HTMLInputElement;
  private isDefaultBillingAddress!: HTMLInputElement;
  private isShipAsBillAddress!: HTMLInputElement;

  private btnContainer!: HTMLElement;
  private btnRegister!: HTMLButtonElement;

  private loader = new Loader();

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('register-route');

    const headingContainer = BaseComponent.renderElem(this.container, 'div', ['heading-wrapper']);
    BaseComponent.renderElem(headingContainer, 'h2', ['heading__form', 'text-head-m'], 'Welcome!');
    BaseComponent.renderElem(
      headingContainer,
      'p',
      ['subheading__form', 'text-hint'],
      'For registration, please fill in the fields below '
    );

    this.renderUserDataFields();
    this.renderShippingAddressesFields();
    this.renderBillingAddressesFields();
    this.renderButtons();

    this.loader.init(this.btnRegister);
  }

  public renderUserDataFields(): void {
    this.form = BaseComponent.renderElem(this.container, 'form', ['register-route__form']) as HTMLFormElement;
    const userDataContainer = BaseComponent.renderElem(this.form, 'div', ['user-data-wrapper_form']);

    this.emailInput.render(userDataContainer, 'email-inp', 'text', 'Email:', true);
    this.emailInput.applyValidators([ValidatorController.validateEmail, ValidatorController.required]);

    this.passwordInput.render(userDataContainer, 'password-inp', 'password', 'Password:', true);

    this.passwordInput.applyValidators([ValidatorController.validatePassword, ValidatorController.required]);

    this.repeatPasswordInput.render(userDataContainer, 'lpassword-inp', 'password', 'Retype password:', true);
    this.repeatPasswordInput.applyRetypePassValidators(this.passwordInput);

    this.firstNameInput.render(userDataContainer, 'fname-inp', 'text', 'First name:', true);
    this.firstNameInput.applyValidators([
      ValidatorController.validateMissingLetter,
      ValidatorController.validateContainsSpecialOrNumber,
      ValidatorController.required,
    ]);

    this.lastNameInput.render(userDataContainer, 'lname-inp', 'text', 'Last name:', true);
    this.lastNameInput.applyValidators([
      ValidatorController.validateMissingLetter,
      ValidatorController.validateContainsSpecialOrNumber,
      ValidatorController.required,
    ]);

    this.dateOfBirth.render(userDataContainer, 'date-inp', 'date', 'Date of birth:', true);
    this.dateOfBirth.applyValidators([ValidatorController.validateDateOfBirth, ValidatorController.required]);
    this.dateOfBirth.max = this.setDateSettings();
  }

  public renderShippingAddressesFields(): void {
    const userShipAddressContainer = BaseComponent.renderElem(this.form, 'div', ['shipping-address-wrapper']);

    this.addressShipCountry = renderSelect(userShipAddressContainer, 'country-inp', 'Country:') as HTMLSelectElement;
    this.addressShipCountry.append(...this.setSelectOptions());

    this.addressShipCity.render(userShipAddressContainer, 'city-ship-inp', 'text', 'City:', true);
    this.addressShipCity.applyValidators([
      ValidatorController.validateMissingLetter,
      ValidatorController.validateContainsSpecialOrNumber,
      ValidatorController.required,
    ]);

    this.addressShipStreet.render(userShipAddressContainer, 'street-inp', 'text', 'Street:', true);
    this.addressShipStreet.applyValidators([ValidatorController.validateMissingLetter, ValidatorController.required]);

    this.addressShipStreetNumber.render(userShipAddressContainer, 'street-num-inp', 'text', 'Street number:', true);
    this.addressShipStreetNumber.applyValidators([
      ValidatorController.validateMissingNumberOrLetter,
      ValidatorController.required,
    ]);

    this.addressShipZip.render(userShipAddressContainer, 'zip-inp', 'text', 'Postal code:', true);
    this.addressShipZip.applyPostalCodeValidators(this.addressShipCountry.value);

    const shipCheckboxContainer = BaseComponent.renderElem(userShipAddressContainer, 'div', ['shipping-checkbox']);
    this.isDefaultShipingAddress = renderCheckbox(
      shipCheckboxContainer,
      'checkbox-ship-inp',
      'checkbox',
      'use as default'
    );

    this.isShipAsBillAddress = renderCheckbox(shipCheckboxContainer, 'checkbox-bill-inp', 'checkbox', 'use as billing');
    this.isShipAsBillAddress.addEventListener('input', () => this.copyAddressFilds(this.isShipAsBillAddress.checked));
  }

  public renderBillingAddressesFields(): void {
    this.addressBillContainer = BaseComponent.renderElem(this.form, 'div', ['billing-address-wrapper']);

    this.addressBillCountry = renderSelect(this.addressBillContainer, 'country-inp', 'Country:') as HTMLSelectElement;
    this.addressBillCountry.append(...this.setSelectOptions());

    this.addressBillCity.render(this.addressBillContainer, 'city-bill-inp', 'text', 'City:', true);
    this.addressBillCity.applyValidators([
      ValidatorController.validateMissingLetter,
      ValidatorController.validateContainsSpecialOrNumber,
      ValidatorController.required,
    ]);

    this.addressBillStreet.render(this.addressBillContainer, 'street-bill-inp', 'text', 'Street:', true);
    this.addressBillStreet.applyValidators([ValidatorController.validateMissingLetter, ValidatorController.required]);

    this.addressBillStreetNumber.render(
      this.addressBillContainer,
      'street-bill-num-inp',
      'text',
      'Street number:',
      true
    );
    this.addressBillStreetNumber.applyValidators([
      ValidatorController.validateMissingNumberOrLetter,
      ValidatorController.required,
    ]);

    this.addressBillZip.render(this.addressBillContainer, 'zip-bill-inp', 'number', 'Postal code:', true);
    this.addressBillZip.applyPostalCodeValidators(this.addressShipCountry.value);

    this.isDefaultBillingAddress = renderCheckbox(
      this.addressBillContainer,
      'checkbox-as-bill-inp',
      'checkbox',
      'use as default'
    );
  }

  public renderButtons(): void {
    this.btnContainer = BaseComponent.renderElem(this.form, 'div', ['btn-container']);
    this.btnRegister = BaseComponent.renderElem(
      this.btnContainer,
      'button',
      ['btn-container__submit'],
      'Create an account'
    ) as HTMLButtonElement;

    this.btnRegister.type = 'submit';

    const registerContainer = BaseComponent.renderElem(
      this.btnContainer,
      'div',
      ['register-container__submit', 'text-hint'],
      'Already have an account? '
    );
    const loginLink = BaseComponent.renderElem(
      registerContainer,
      'a',
      ['link-container__login', 'text-hint'],
      'Login'
    ) as HTMLAnchorElement;
    loginLink.href = '#/login';

    this.btnRegister.addEventListener('click', (e) => {
      e.preventDefault();
      this.onSubmitBtn();
    });
  }

  private onSubmitBtn() {
    if (
      this.emailInput.isValid() &&
      this.firstNameInput.isValid() &&
      this.lastNameInput.isValid() &&
      this.passwordInput.isValid() &&
      this.repeatPasswordInput.isValid() &&
      this.addressShipStreet.isValid() &&
      this.addressShipStreetNumber.isValid() &&
      this.addressShipCity.isValid() &&
      this.addressShipZip.isValid() &&
      this.addressBillStreet.isValid() &&
      this.addressBillStreetNumber.isValid() &&
      this.addressBillCity.isValid() &&
      this.addressBillZip.isValid() &&
      this.dateOfBirth.isValid()
    ) {
      this.loader.show();
      const dto = this.createCustomerObj();
      const [customerShipAddress, customerBillAddress] = this.createShippingAddressObj();
      AuthService.register(
        dto,
        customerShipAddress,
        customerBillAddress,
        this.isDefaultBillingAddress.checked,
        this.isDefaultShipingAddress.checked
      )
        .then(() => {
          this.emitter.emit('login', null);
          this.clearFields();
          this.loader.hide();
        })
        .catch((error) => {
          ApiMessageHandler.showMessage((error as Error).message, 'fail');
          this.loader.hide();
        });
    } else {
      this.emailInput.showError();
      this.firstNameInput.showError();
      this.lastNameInput.showError();
      this.passwordInput.showError();
      this.repeatPasswordInput.showError();
      this.addressShipStreet.showError();
      this.addressShipStreetNumber.showError();
      this.addressShipCity.showError();
      this.addressShipZip.showError();
      this.addressBillStreet.showError();
      this.addressBillStreetNumber.showError();
      this.addressBillCity.showError();
      this.addressBillZip.showError();
      this.dateOfBirth.showError();
      ApiMessageHandler.showMessage('Somethimg went wrong ☠️', 'fail');
    }
  }

  private createCustomerObj(): NewCustomer {
    const newCostomerObj: NewCustomer = {
      email: this.emailInput.value,
      firstName: this.firstNameInput.value,
      lastName: this.lastNameInput.value,
      password: this.passwordInput.value,
      dateOfBirth: this.dateOfBirth.value,
    };
    return newCostomerObj;
  }

  private createShippingAddressObj(): CustomerAddress[] {
    const customerShipAddress: CustomerAddress = {
      address: {
        streetName: this.addressShipStreet.value,
        streetNumber: this.addressShipStreetNumber.value,
        postalCode: this.addressShipZip.value,
        city: this.addressShipCity.value,
        country: this.addressShipCountry.value,
      },
    };
    const customerBillAddress: CustomerAddress = {
      address: {
        streetName: this.addressBillStreet.value,
        streetNumber: this.addressBillStreetNumber.value,
        postalCode: this.addressBillZip.value,
        city: this.addressBillCity.value,
        country: this.addressBillCountry.value,
      },
    };
    return [customerShipAddress, customerBillAddress];
  }

  private copyAddressFilds(isUseAsBilling: boolean): void {
    if (isUseAsBilling) {
      this.addressBillStreet.value = this.addressShipStreet.value;
      this.addressBillStreetNumber.value = this.addressShipStreetNumber.value;
      this.addressBillCity.value = this.addressShipCity.value;
      this.addressBillZip.value = this.addressShipZip.value;
      this.addressBillCountry.value = this.addressShipCountry.value;

      this.addressBillStreet.dispatchInputEvent();
      this.addressBillStreetNumber.dispatchInputEvent();
      this.addressBillCity.dispatchInputEvent();
      this.addressBillZip.dispatchInputEvent();
    } else {
      this.clearBillingAddress();
      this.addressBillStreet.dispatchInputEvent();
      this.addressBillStreetNumber.dispatchInputEvent();
      this.addressBillCity.dispatchInputEvent();
      this.addressBillZip.dispatchInputEvent();
    }
  }

  private clearFields(): void {
    this.emailInput.value = '';
    this.firstNameInput.value = '';
    this.lastNameInput.value = '';
    this.passwordInput.value = '';
    this.repeatPasswordInput.value = '';
    this.dateOfBirth.value = '';
    this.addressShipStreet.value = '';
    this.addressShipStreetNumber.value = '';
    this.addressShipCity.value = '';
    this.addressShipZip.value = '';
    this.addressShipCountry.value = '';
    this.clearBillingAddress();
    this.isDefaultBillingAddress.checked = false;
    this.isDefaultShipingAddress.checked = false;
    this.isShipAsBillAddress.checked = false;
  }

  private clearBillingAddress(): void {
    this.addressBillStreet.value = '';
    this.addressBillStreetNumber.value = '';
    this.addressBillCity.value = '';
    this.addressBillZip.value = '';
    this.addressBillCountry.value = '';
  }

  private setDateSettings(): string {
    const date = new Date();
    return `${date.getFullYear() - 13}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate() - 1
    ).padStart(2, '0')}`;
  }

  private setSelectOptions(): HTMLElement[] {
    const countryList = COUNTRIES.map((country) =>
      BaseComponent.renderElem(this.addressShipCountry, 'option', ['country-option'], country)
    );
    return countryList;
  }
}

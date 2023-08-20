import '../../shared/styles/login-register.scss';
import { renderInput, renderSelect } from '../../shared/util/renderInput';
import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import { NewCustomer } from '../../shared/types/customers-type';
import countries from '../../shared/util/countries';
import { CustomerAddress } from '../../shared/types/address-type';
import AuthService from '../../services/auth-service';
import CustomInput from '../../shared/view/custom-input';
import ValidatorController from '../../shared/util/validator-controller';

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
  private addressBillCity: CustomInput = new CustomInput();
  private addressBillZip: CustomInput = new CustomInput();
  private addressBillCountry!: HTMLSelectElement;
  private addressBillStreetNumber: CustomInput = new CustomInput();

  private isDefaultShipingAddress!: HTMLInputElement;
  private isDefaultBillingAddress!: HTMLInputElement;
  private isShipAsBillAddress!: HTMLInputElement;

  private message!: HTMLElement;
  private btnContainer!: HTMLElement;
  private btnRegister!: HTMLButtonElement;

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('register-route');
    this.message = BaseComponent.renderElem(this.container, 'div', ['message']);

    this.renderUserDataFields();
    this.renderShippingAddressesFields();
    this.renderBillingAddressesFields();
    this.renderButtons();
    this.clearMessage();
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
    ]);

    this.lastNameInput.render(userDataContainer, 'lname-inp', 'text', 'Last name:', true);
    this.lastNameInput.applyValidators([
      ValidatorController.validateMissingLetter,
      ValidatorController.validateContainsSpecialOrNumber,
    ]);

    this.dateOfBirth.render(userDataContainer, 'date-inp', 'date', 'Date of birth:', true);
    this.dateOfBirth.max = this.setDateSettings();
  }

  public renderShippingAddressesFields(): void {
    const userShipAddressContainer = BaseComponent.renderElem(this.form, 'div', ['shipping-address-wrapper_form']);

    // todo create func/class/component for select
    this.addressShipCountry = renderSelect(userShipAddressContainer, 'country-inp', 'Country:') as HTMLSelectElement;
    this.addressShipCountry.append(...this.setSelectOptions());

    this.addressShipCity.render(userShipAddressContainer, 'city-inp', 'text', 'City:', true);
    this.addressShipCity.applyValidators([ValidatorController.validateMissingLetter]);

    this.addressShipStreet.render(userShipAddressContainer, 'street-inp', 'text', 'Street:', true);
    this.addressShipStreet.applyValidators([ValidatorController.validateMissingLetter]);

    this.addressShipStreetNumber.render(userShipAddressContainer, 'street-inp', 'text', 'Street number:', true);
    this.addressShipStreetNumber.applyValidators([ValidatorController.validateMissingNumberOrLetter]);

    this.addressShipZip.render(userShipAddressContainer, 'zip-inp', 'number', 'Postal code:', true);
    this.addressShipZip.applyPostalCodeValidators(this.addressShipCountry.value);

    // todo create func/class/component for checkbox
    this.isDefaultShipingAddress = renderInput(userShipAddressContainer, 'checkbox-inp', 'checkbox', 'use as default');

    // todo create func/class/component for checkbox
    this.isShipAsBillAddress = renderInput(userShipAddressContainer, 'checkbox-inp', 'checkbox', 'use as billing');
    this.isShipAsBillAddress.addEventListener('input', () => this.copyAddressFilds(this.isShipAsBillAddress.checked));
  }

  public renderBillingAddressesFields(): void {
    this.addressBillContainer = BaseComponent.renderElem(this.form, 'div', ['billing-address-wrapper_form']);

    // todo create func/class/component for select
    this.addressBillCountry = renderSelect(this.addressBillContainer, 'country-inp', 'Country:') as HTMLSelectElement;
    this.addressBillCountry.append(...this.setSelectOptions());

    this.addressBillCity.render(this.addressBillContainer, 'city-inp', 'text', 'City:', true);
    this.addressBillCity.applyValidators([ValidatorController.validateMissingLetter]);

    this.addressBillStreet.render(this.addressBillContainer, 'street-inp', 'text', 'Street:', true);
    this.addressBillStreet.applyValidators([ValidatorController.validateMissingLetter]);

    this.addressBillStreetNumber.render(this.addressBillContainer, 'street-inp', 'text', 'Street number:', true);
    this.addressBillStreetNumber.applyValidators([ValidatorController.validateMissingNumberOrLetter]);

    this.addressBillZip.render(this.addressBillContainer, 'zip-inp', 'number', 'Postal code:', true);
    this.addressBillZip.applyPostalCodeValidators(this.addressShipCountry.value);

    // todo create func/class/component for checkbox
    this.isDefaultBillingAddress = renderInput(this.addressBillContainer, 'checkbox-inp', 'checkbox', 'use as default');
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
    this.btnRegister.addEventListener('click', (e) => {
      e.preventDefault();
      this.onSubmitBtn();
    });
  }

  // todo splite function

  // private async onSubmitBtn(): Promise<void> {
  //   try {
  //     const dto = this.createCustomerObj();
  //     const [customerShipAddress, customerBillAddress] = this.createShippingAddressObj();
  //     await AuthService.register(
  //       dto,
  //       customerShipAddress,
  //       customerBillAddress,
  //       this.isDefaultBillingAddress.checked,
  //       this.isDefaultShipingAddress.checked
  //     );
  //     this.showSuccessfulRegistr();
  //   } catch (error) {
  //     this.showFailedRegistr((error as Error).message);
  //   }
  // }

  //  |
  //  |
  // \ /
  //  '

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
      this.addressBillZip.isValid()
    ) {
      const dto = this.createCustomerObj();
      const [customerShipAddress, customerBillAddress] = this.createShippingAddressObj();
      AuthService.register(
        dto,
        customerShipAddress,
        customerBillAddress,
        this.isDefaultBillingAddress.checked,
        this.isDefaultShipingAddress.checked
      )
        .then(() => this.showSuccessfulRegistr())
        .catch((error) => this.showFailedRegistr((error as Error).message));
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
    }
  }

  private createCustomerObj(): NewCustomer {
    const newCostomerObj: NewCustomer = {
      email: this.emailInput.value,
      firstName: this.firstNameInput.value,
      lastName: this.lastNameInput.value,
      password: this.passwordInput.value,
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
    console.log('customerShipAddress: ', customerShipAddress);

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

  // todo think how to manage message and form after fail and after success
  private showSuccessfulRegistr(): void {
    this.clearMessage();
    this.message.textContent = 'Congrads!🎊 you have just resiter in our amaising store';
    this.clearFields();
  }

  private showFailedRegistr(message: string): void {
    this.clearMessage();
    this.message.textContent = `Oups!🫠 something went wrong.\n ${message}`;
  }

  private clearMessage(): void {
    this.message.textContent = '';
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
    return `${date.getFullYear() - 13}-${date
      .getMonth()
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

  private setSelectOptions(): HTMLElement[] {
    const countryList = countries.map((country) =>
      BaseComponent.renderElem(this.addressShipCountry, 'option', ['country-option'], country)
    );
    return countryList;
  }
}

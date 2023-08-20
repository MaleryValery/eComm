import COUNTRIES from '../../consts/countries';
import AuthService from '../../services/auth-service';
import '../../shared/styles/login-register.scss';
import { CustomerAddress } from '../../shared/types/address-type';
import { NewCustomer } from '../../shared/types/customers-type';
import renderInput from '../../shared/util/render-input';
import renderSelect from '../../shared/util/render-select';
import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';

export default class RegisterComponent extends RouteComponent {
  private form!: HTMLFormElement;
  private firstNameInput!: HTMLInputElement;
  private lastNameInput!: HTMLInputElement;
  private emailInput!: HTMLInputElement;
  private passwordInput!: HTMLInputElement;
  private repeatPasswordInput!: HTMLInputElement;
  private dateOfBirth!: HTMLInputElement;

  private addressShipStreet!: HTMLInputElement;
  private addressShipCity!: HTMLInputElement;
  private addressShipZip!: HTMLInputElement;
  private addressShipCountry!: HTMLSelectElement;
  private addressShipStreetNumber!: HTMLInputElement;

  private addressBillContainer!: HTMLElement;
  private addressBillStreet!: HTMLInputElement;
  private addressBillCity!: HTMLInputElement;
  private addressBillZip!: HTMLInputElement;
  private addressBillCountry!: HTMLSelectElement;
  private addressBillStreetNumber!: HTMLInputElement;

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
    this.emailInput = renderInput(userDataContainer, 'email-inp', 'email', 'Email:');
    this.passwordInput = renderInput(userDataContainer, 'fpassword-inp', 'password', 'Password:');
    this.repeatPasswordInput = renderInput(userDataContainer, 'lpassword-inp', 'password', 'Retype password:');
    this.firstNameInput = renderInput(userDataContainer, 'fname-inp', 'text', 'First name:');
    this.lastNameInput = renderInput(userDataContainer, 'lname-inp', 'text', 'Last name:');
    this.dateOfBirth = renderInput(userDataContainer, 'date-inp', 'date', 'Date of birth:');
    this.dateOfBirth.max = this.setDateSettings();
  }

  public renderShippingAddressesFields(): void {
    const userShipAddressContainer = BaseComponent.renderElem(this.form, 'div', ['shipping-address-wrapper_form']);
    this.addressShipStreet = renderInput(userShipAddressContainer, 'street-inp', 'text', 'Street:');
    this.addressShipStreetNumber = renderInput(userShipAddressContainer, 'street-inp', 'text', 'Street number:');
    this.addressShipCity = renderInput(userShipAddressContainer, 'city-inp', 'text', 'City:');
    this.addressShipZip = renderInput(userShipAddressContainer, 'zip-inp', 'number', 'Postal code:');
    this.addressShipCountry = renderSelect(userShipAddressContainer, 'country-inp', 'Country:') as HTMLSelectElement;
    this.addressShipCountry.append(...this.setSelectOptions());
    this.isDefaultShipingAddress = renderInput(userShipAddressContainer, 'checkbox-inp', 'checkbox', 'use as default');
    this.isShipAsBillAddress = renderInput(userShipAddressContainer, 'checkbox-inp', 'checkbox', 'use as billing');
    this.isShipAsBillAddress.addEventListener('input', () => this.copyAddressFilds(this.isShipAsBillAddress.checked));
  }

  public renderBillingAddressesFields(): void {
    this.addressBillContainer = BaseComponent.renderElem(this.form, 'div', ['billing-address-wrapper_form']);
    this.addressBillStreet = renderInput(this.addressBillContainer, 'street-inp', 'text', 'Street:');
    this.addressBillStreetNumber = renderInput(this.addressBillContainer, 'street-inp', 'text', 'Street number:');
    this.addressBillCity = renderInput(this.addressBillContainer, 'city-inp', 'text', 'City:');
    this.addressBillZip = renderInput(this.addressBillContainer, 'zip-inp', 'number', 'Postal code:');
    this.addressBillCountry = renderSelect(this.addressBillContainer, 'country-inp', 'Country:') as HTMLSelectElement;
    this.addressBillCountry.append(...this.setSelectOptions());
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

  private async onSubmitBtn(): Promise<void> {
    try {
      const dto = this.createCustomerObj();
      const [customerShipAddress, customerBillAddress] = this.createShippingAddressObj();
      await AuthService.register(
        dto,
        customerShipAddress,
        customerBillAddress,
        this.isDefaultShipingAddress.checked,
        this.isDefaultBillingAddress.checked
      );
      this.emitter.emit('login', null);
      this.showSuccessfulRegistr();
    } catch (error) {
      this.showFailedRegistr((error as Error).message);
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
        key: 'shippingAddress',
        streetName: this.addressShipStreet.value,
        streetNumber: this.addressShipStreetNumber.value,
        postalCode: this.addressShipZip.value,
        city: this.addressShipCity.value,
        country: this.addressShipCountry.value,
      },
    };
    const customerBillAddress: CustomerAddress = {
      address: {
        key: 'billingAddress',
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
    } else {
      this.clearBillingAddress();
    }
  }

  private showSuccessfulRegistr(): void {
    this.clearMessage();
    this.message.textContent = 'Congrats!🎊 you have just registered in our amazing store';
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
    return `${date.getFullYear() - 13}-${date
      .getMonth()
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

  private setSelectOptions(): HTMLElement[] {
    const countryList = COUNTRIES.map((country) =>
      BaseComponent.renderElem(this.addressShipCountry, 'option', ['country-option'], country)
    );
    return countryList;
  }
}

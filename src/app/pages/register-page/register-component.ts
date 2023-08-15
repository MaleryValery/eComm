import '../../shared/styles/login-register.scss';
import { renderInput, renderSelect } from '../../shared/util/renderInput';
import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import { NewCustomer } from '../../shared/types/customers-type';
import { addAddress, createCustomer, passwordFlow } from './registration';
import login from '../../shared/util/login';
import countries from '../../shared/util/countries';
import { CustomerAddress } from '../../shared/types/address-type';

export default class RegisterComponent extends RouteComponent {
  private form!: HTMLFormElement;
  private firstNameInput!: HTMLInputElement;
  private lastNameInput!: HTMLInputElement;
  private emailInput!: HTMLInputElement;
  private passwordInput!: HTMLInputElement;
  private repeatPasswordInput!: HTMLInputElement;
  private dateOfBirth!: HTMLInputElement;

  private addressStreet!: HTMLInputElement;
  private addressCity!: HTMLInputElement;
  private addressZip!: HTMLInputElement;
  private addressCountry!: HTMLSelectElement;
  private addressStreetNumber!: HTMLInputElement;

  private isDefaultShipingAddress!: HTMLInputElement;
  private isDefaultBillingAddress!: HTMLInputElement;
  private additionalBillingAddress!: HTMLInputElement;

  private message!: HTMLElement;
  private btnContainer!: HTMLElement;
  private btnRegister!: HTMLButtonElement;

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('register-route');
    this.message = BaseComponent.renderElem(this.container, 'div', ['message']);

    this.renderPersonalDataFields();
    this.renderAddressesFields();
    this.renderShippingSettings();
    this.renderButtons();
    this.clearMessage();
  }

  public renderPersonalDataFields(): void {
    this.form = BaseComponent.renderElem(this.container, 'form', ['register-route__form']) as HTMLFormElement;
    this.emailInput = renderInput(this.form, 'email-inp', 'email', 'Email:');
    this.passwordInput = renderInput(this.form, 'fpassword-inp', 'password', 'Password:');
    this.repeatPasswordInput = renderInput(this.form, 'lpassword-inp', 'password', 'Retype password:');
    this.firstNameInput = renderInput(this.form, 'fname-inp', 'text', 'First name:');
    this.lastNameInput = renderInput(this.form, 'lname-inp', 'text', 'Last name:');
    this.dateOfBirth = renderInput(this.form, 'date-inp', 'date', 'Date of birth:');
  }

  public renderAddressesFields(): void {
    this.addressStreet = renderInput(this.form, 'street-inp', 'text', 'Street:');
    this.addressStreetNumber = renderInput(this.form, 'street-inp', 'text', 'Street number:');
    this.addressCity = renderInput(this.form, 'city-inp', 'text', 'City:');
    this.addressZip = renderInput(this.form, 'zip-inp', 'number', 'Postal code:');
    this.addressCountry = renderSelect(this.form, 'country-inp', 'Country:') as HTMLSelectElement;
    this.dateOfBirth.max = this.setDateSettings();
    this.addressCountry.append(...this.setSelectOptions());
  }

  public renderShippingSettings(): void {
    this.isDefaultShipingAddress = renderInput(this.form, 'checkbox-inp', 'checkbox', 'Set address as default');
    this.isDefaultBillingAddress = renderInput(this.form, 'checkbox-inp', 'checkbox', 'Set as billing address');
    this.additionalBillingAddress = renderInput(this.form, 'checkbox-inp', 'checkbox', 'Add billing address');
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
    this.btnRegister.addEventListener('click', this.onSubmitBtn.bind(this));
  }

  // todo splite function
  private async onSubmitBtn(): Promise<void> {
    try {
      const dto = this.createCustomerObj();
      const response = await createCustomer(dto);
      if (response) {
        const customerAddress = this.createCustomerAddressObj();
        console.log('customerAddress: ', customerAddress);

        const apiPasswordRoot = passwordFlow(dto.email, dto.password);
        // todo should do only after validation
        await addAddress(
          response,
          apiPasswordRoot,
          customerAddress,
          this.isDefaultShipingAddress.checked,
          this.isDefaultBillingAddress.checked
        );
        login(dto.email, dto.password);
        this.showSuccessfulRegistr();
      }
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

  private createCustomerAddressObj(): CustomerAddress {
    const customerAddress: CustomerAddress = {
      address: {
        streetName: this.addressStreet.value,
        streetNumber: this.addressStreetNumber.value,
        postalCode: this.addressZip.value,
        city: this.addressCity.value,
        country: this.addressCountry.value,
      },
    };
    console.log('customerAddress: ', customerAddress);

    return customerAddress;
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
    this.addressStreet.value = '';
    this.addressStreetNumber.value = '';
    this.addressCity.value = '';
    this.addressZip.value = '';
    this.addressCountry.value = '';
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
      BaseComponent.renderElem(this.addressCountry, 'option', ['country-option'], country)
    );
    return countryList;
  }
}

/* eslint-disable no-param-reassign */
import './writeble-profile-component.scss';
import { Address, ClientResponse, Customer, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import RouteComponent from '../../../shared/view/route-component';
import BaseComponent from '../../../shared/view/base-component';
import CustomInput from '../../../shared/view/custom-input';
import ValidatorController from '../../../shared/util/validator-controller';
import AuthService from '../../../services/auth-service';
import COUNTRIES from '../../../consts/countries';
import renderSelect from '../../../shared/util/render-select';
import renderCheckbox from '../../../shared/util/render-checkbox';

type AddressInputs = {
  container: HTMLElement;
  addressCountry: HTMLSelectElement;
  addressCity: CustomInput;
  addressStreet: CustomInput;
  addressStreetNumber: CustomInput;
  addressZip: CustomInput;
  isDefaultShipAddress: HTMLInputElement;
  isDefaultBillAddress: HTMLInputElement;
  isShipAddress: HTMLInputElement;
  isBillAddress: HTMLInputElement;
  btnDeleteAddress: HTMLElement;
  id: string | undefined;
};

type AddressAction = {
  action: string;
  addressId?: string;
  address?: Address;
};

export default class WritableProfileComponennot extends RouteComponent {
  private btnBack!: HTMLElement;
  private btnSubmit!: HTMLElement;

  private addressesArr: AddressInputs[] = [];
  private newAddressesArr: AddressInputs[] = [];
  private deletedAddressesArr: AddressInputs[] = [];
  private onLogoutFn!: () => void;

  private form!: HTMLFormElement;
  private emailInput = new CustomInput();
  private firstNameInput = new CustomInput();
  private lastNameInput = new CustomInput();
  private dateOfBirth = new CustomInput();

  private addressesHeader!: HTMLElement;
  private addressesContainer!: HTMLElement;
  private btnAddAddress!: HTMLElement;

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('route__profile_write');

    this.form = BaseComponent.renderElem(this.container, 'form', ['profile__form']) as HTMLFormElement;
    this.renderPersonal();
    this.renderAddresses();

    const btnContainer = BaseComponent.renderElem(this.container, 'div', ['profile__control-btns']);
    this.btnBack = BaseComponent.renderElem(btnContainer, 'button', ['profile__btn_back'], 'Cancel');
    this.btnBack.setAttribute('data-btn-big', '');
    this.btnSubmit = BaseComponent.renderElem(btnContainer, 'button', ['profile__btn_submit'], 'Submit');
    this.btnSubmit.setAttribute('data-btn-big', '');

    this.bindEvents();
    this.subscribeEvents();
  }

  private bindEvents(): void {
    this.btnBack.addEventListener('click', () => {
      this.emitter.emit('changeProfile', 'toProfileRead');
    });

    this.btnAddAddress.addEventListener('click', (e) => {
      e.preventDefault();
      const container = this.renderAddress();
      container.remove();
      this.addressesHeader.after(container);
    });

    this.addressesContainer.addEventListener('click', this.onClickAddresses.bind(this));

    this.btnSubmit.addEventListener('click', async () => {
      const updatedCustomer = (await this.submitPersonInfo()).body;
      AuthService.user = updatedCustomer;
      this.emitter.emit('updateProfile', updatedCustomer);
    });
  }

  private async submitPersonInfo(): Promise<ClientResponse<Customer>> {
    const userActions = [
      {
        action: 'setFirstName',
        firstName: this.firstNameInput.value,
      },
      {
        action: 'setLastName',
        lastName: this.lastNameInput.value,
      },
      {
        action: 'setDateOfBirth',
        dateOfBirth: this.dateOfBirth.value,
      },
      {
        action: 'changeEmail',
        email: this.emailInput.value,
      },
    ];

    const changedAddressActions = this.parseAddressInputsArr(this.addressesArr, 'changeAddress');
    const addedAddressActions = this.parseAddressInputsArr(this.newAddressesArr, 'addAddress');
    const removedAddressActions = this.parseAddressInputsArr(this.deletedAddressesArr, 'removeAddress');

    const actions = [
      ...userActions,
      ...changedAddressActions,
      ...addedAddressActions,
      ...removedAddressActions,
    ] as MyCustomerUpdateAction[];

    const resp = await AuthService.apiRootPassword
      .me()
      .post({
        body: {
          version: AuthService.user!.version,
          actions,
        },
      })
      .execute();

    return resp;
  }

  private parseAddressInputsArr(arr: AddressInputs[], action: string): AddressAction[] {
    return arr.map((addressInputs) => {
      const address = {
        city: addressInputs.addressCity.value,
        country: addressInputs.addressCountry.value,
        postalCode: addressInputs.addressZip.value,
        streetName: addressInputs.addressStreet.value,
        streetNumber: addressInputs.addressStreetNumber.value,
      };
      const addressId = addressInputs.id as string;
      if (action === 'addAddress') {
        return {
          action,
          address,
        };
      }
      if (action === 'changeAddress') {
        return {
          action,
          addressId,
          address,
        };
      }
      return {
        action,
        addressId,
      };
    });
  }

  private subscribeEvents(): void {
    this.onLogoutFn = this.clearProfile.bind(this);
    this.emitter.subscribe('logout', this.onLogoutFn);
  }

  private renderPersonal(): void {
    const personalContainer = BaseComponent.renderElem(this.form, 'div', ['personal_write']);

    BaseComponent.renderElem(personalContainer, 'h2', ['profile__heading', 'text-head-m'], 'User information');

    this.emailInput.render(personalContainer, 'email-inp', 'text', 'Email:', true);
    this.emailInput.applyValidators([ValidatorController.validateEmail, ValidatorController.required]);

    this.firstNameInput.render(personalContainer, 'fname-inp', 'text', 'First name:', true);
    this.firstNameInput.applyValidators([
      ValidatorController.validateMissingLetter,
      ValidatorController.validateContainsSpecialOrNumber,
    ]);

    this.lastNameInput.render(personalContainer, 'lname-inp', 'text', 'Last name:', true);
    this.lastNameInput.applyValidators([
      ValidatorController.validateMissingLetter,
      ValidatorController.validateContainsSpecialOrNumber,
    ]);

    this.dateOfBirth.render(personalContainer, 'date-inp', 'date', 'Date of birth:', true);

    this.setPersonalValues();
  }

  private renderAddresses(): void {
    this.addressesContainer = BaseComponent.renderElem(this.form, 'div', ['addresses_write']);

    this.addressesHeader = BaseComponent.renderElem(this.addressesContainer, 'div', ['addresses__header']);
    BaseComponent.renderElem(
      this.addressesHeader,
      'h2',
      ['profile__heading', 'addresses__head', 'text-head-m'],
      'Addresses'
    );
    this.btnAddAddress = BaseComponent.renderElem(this.addressesHeader, 'button', ['addresses__btn_add'], 'Add new+');
    this.btnAddAddress.setAttribute('data-btn-small', '');

    const { addresses } = AuthService.user as Customer;
    addresses.forEach((address) => this.renderAddress(address));
  }

  private renderAddress(addressInfo?: Address): HTMLElement {
    const container = BaseComponent.renderElem(this.addressesContainer, 'div', ['address__container_write']);

    const addressCountry = renderSelect(container, 'country-inp', 'Country:') as HTMLSelectElement;
    addressCountry.append(...this.setSelectOptions(addressCountry));

    const addressCity = new CustomInput();
    addressCity.render(container, null, 'text', 'City:', true);
    addressCity.applyValidators([ValidatorController.validateMissingLetter]);

    const addressStreet = new CustomInput();
    addressStreet.render(container, null, 'text', 'Street:', true);
    addressStreet.applyValidators([ValidatorController.validateMissingLetter]);

    const addressStreetNumber = new CustomInput();
    addressStreetNumber.render(container, null, 'text', 'Street number:', true);
    addressStreetNumber.applyValidators([ValidatorController.validateMissingNumberOrLetter]);

    const addressZip = new CustomInput();
    addressZip.render(container, null, 'number', 'Postal code:', true);
    addressZip.applyPostalCodeValidators(addressCountry.value);

    const checkboxContainer = BaseComponent.renderElem(container, 'div', ['shipping-checkbox']);

    const isDefaultShipAddress = renderCheckbox(checkboxContainer, null, 'checkbox', 'default shipping');
    const isShipAddress = renderCheckbox(checkboxContainer, null, 'checkbox', 'shipping address');
    const isBillAddress = renderCheckbox(checkboxContainer, null, 'checkbox', 'billing address');
    const isDefaultBillAddress = renderCheckbox(checkboxContainer, null, 'checkbox', 'default billing');
    isDefaultShipAddress.setAttribute('data-default-ship', '');
    isDefaultBillAddress.setAttribute('data-default-bill', '');
    isShipAddress.setAttribute('data-ship', '');
    isBillAddress.setAttribute('data-bill', '');

    const btnDeleteAddress = BaseComponent.renderElem(container, 'button', ['addresses__btn_delete'], 'Delete address');
    btnDeleteAddress.setAttribute('data-btn-small', '');

    const addressInputs: AddressInputs = {
      container,
      addressCountry,
      addressCity,
      addressStreet,
      addressStreetNumber,
      addressZip,
      isDefaultShipAddress,
      isDefaultBillAddress,
      isShipAddress,
      isBillAddress,
      btnDeleteAddress,
      id: addressInfo?.id,
    };

    if (addressInfo) {
      this.addressesArr.push(addressInputs);
      this.setAddressValues(addressInfo, addressInputs);
    } else {
      this.newAddressesArr.push(addressInputs);
    }
    return container;
  }

  private onClickAddresses(e: Event): void {
    const { target } = e;
    if (!(target instanceof HTMLElement)) return;

    if (target.classList.contains('addresses__btn_delete')) {
      this.onDeleteAddress(target);
      return;
    }

    if (target instanceof HTMLInputElement) {
      if (target.hasAttribute('data-default-ship') && target.checked) this.onShipDefaultCheckbox(target);

      if (target.hasAttribute('data-default-bill') && target.checked) this.onBillDefaultCheckbox(target);

      if (target.hasAttribute('data-ship') && !target.checked) this.onShipCheckbox(target);

      if (target.hasAttribute('data-bill') && !target.checked) this.onBillCheckbox(target);
    }
  }

  private onDeleteAddress(target: HTMLElement): void {
    let curInputs;
    curInputs = this.addressesArr.find((inputs) => inputs.btnDeleteAddress === target);
    if (curInputs) {
      const index = this.addressesArr.indexOf(curInputs);
      this.addressesArr.splice(index, 1);
      this.deletedAddressesArr.push(curInputs);
    } else {
      curInputs = this.newAddressesArr.find((inputs) => inputs.btnDeleteAddress === target) as AddressInputs;
      const index = this.newAddressesArr.indexOf(curInputs);
      this.newAddressesArr.splice(index, 1);
    }

    curInputs.container.remove();
  }

  private onShipDefaultCheckbox(target: HTMLInputElement): void {
    this.addressesArr.forEach((inputs) => {
      inputs.isDefaultShipAddress.checked = false;
    });
    this.newAddressesArr.forEach((inputs) => {
      inputs.isDefaultShipAddress.checked = false;
    });
    target.checked = true;

    const curShipDefAddress =
      this.addressesArr.find((inputs) => inputs.isDefaultShipAddress === target) ||
      this.newAddressesArr.find((inputs) => inputs.isDefaultShipAddress === target);

    if (curShipDefAddress) curShipDefAddress.isShipAddress.checked = true;
  }

  private onBillDefaultCheckbox(target: HTMLInputElement): void {
    this.addressesArr.forEach((inputs) => {
      inputs.isDefaultBillAddress.checked = false;
    });
    this.newAddressesArr.forEach((inputs) => {
      inputs.isDefaultBillAddress.checked = false;
    });
    target.checked = true;

    const curBillDefAddress =
      this.addressesArr.find((inputs) => inputs.isDefaultBillAddress === target) ??
      this.newAddressesArr.find((inputs) => inputs.isDefaultBillAddress === target);

    if (curBillDefAddress) curBillDefAddress.isBillAddress.checked = true;
  }

  private onShipCheckbox(target: HTMLInputElement): void {
    const curShipAddress =
      this.addressesArr.find((inputs) => inputs.isShipAddress === target) ||
      this.newAddressesArr.find((inputs) => inputs.isShipAddress === target);
    if (curShipAddress) curShipAddress.isDefaultShipAddress.checked = false;
  }

  private onBillCheckbox(target: HTMLInputElement): void {
    const curBillAddress =
      this.addressesArr.find((inputs) => inputs.isBillAddress === target) ||
      this.addressesArr.find((inputs) => inputs.isBillAddress === target);
    if (curBillAddress) curBillAddress.isDefaultBillAddress.checked = false;
  }

  private setAddressValues(addressInfo: Address, addressInputs: AddressInputs): void {
    const {
      addressCountry,
      addressCity,
      addressStreet,
      addressStreetNumber,
      addressZip,
      isDefaultShipAddress,
      isDefaultBillAddress,
      isShipAddress,
      isBillAddress,
    } = addressInputs;
    const {
      billingAddressIds,
      defaultBillingAddressId,
      shippingAddressIds,
      defaultShippingAddressId,
    } = AuthService.user as Customer;

    const { city, country, postalCode, streetName, streetNumber, id } = addressInfo;

    Array.from(addressCountry.options).forEach((opt) => {
      if (opt.value === country) opt.selected = true;
    });
    if (city) addressCity.value = city;
    if (postalCode) addressZip.value = postalCode;
    if (streetName) addressStreet.value = streetName;
    if (streetNumber) addressStreetNumber.value = streetNumber;

    if (id) {
      if (id === defaultBillingAddressId) isDefaultBillAddress.checked = true;
      if (id === defaultShippingAddressId) isDefaultShipAddress.checked = true;
      if (billingAddressIds?.includes(id)) isBillAddress.checked = true;
      if (shippingAddressIds?.includes(id)) isShipAddress.checked = true;
    }
  }

  private setSelectOptions(select: HTMLElement): HTMLElement[] {
    const countryList = COUNTRIES.map((country) =>
      BaseComponent.renderElem(select, 'option', ['country-option'], country)
    );
    return countryList;
  }

  private setPersonalValues(): void {
    const { email, firstName, lastName, dateOfBirth } = AuthService.user as Customer;

    this.emailInput.value = email;
    if (firstName) this.firstNameInput.value = firstName;
    if (lastName) this.lastNameInput.value = lastName;
    if (dateOfBirth) this.dateOfBirth.value = dateOfBirth;
  }

  public clearProfile(): void {
    if (this.isRendered) {
      this.isRendered = false;
      this.addressesArr = [];
      this.newAddressesArr = [];
      this.deletedAddressesArr = [];
      this.emitter.unsubscribe('logout', this.onLogoutFn);
    }
  }
}

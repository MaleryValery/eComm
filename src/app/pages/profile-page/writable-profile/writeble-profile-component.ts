/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */
import './writeble-profile-component.scss';
import { Address, ClientResponse, Customer, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import { v4 as uuidv4 } from 'uuid';
import RouteComponent from '../../../shared/view/route-component';
import BaseComponent from '../../../shared/view/base-component';
import CustomInput from '../../../shared/view/custom-input';
import ValidatorController from '../../../shared/util/validator-controller';
import AuthService from '../../../services/auth-service';
import COUNTRIES from '../../../consts/countries';
import renderSelect from '../../../shared/util/render-select';
import renderCheckbox from '../../../shared/util/render-checkbox';
import ApiMessageHandler from '../../../shared/util/api-message-handler';

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
      const isValid = this.validateInputs();
      try {
        if (isValid) {
          const updatedCustomer = (await this.submitInfo()).body;
          AuthService.user = updatedCustomer;
          this.emitter.emit('updateProfile', updatedCustomer);
          ApiMessageHandler.showMessage('You successfully update profile', 'success');
        }
      } catch (error) {
        ApiMessageHandler.showMessage((error as Error).message, 'fail');
      }
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
    this.firstNameInput.render(personalContainer, 'fname-inp', 'text', 'First name:', true);
    this.lastNameInput.render(personalContainer, 'lname-inp', 'text', 'Last name:', true);
    this.dateOfBirth.render(personalContainer, 'date-inp', 'date', 'Date of birth:', true);

    this.emailInput.applyValidators([ValidatorController.validateEmail, ValidatorController.required]);
    this.firstNameInput.applyValidators([
      ValidatorController.validateMissingLetter,
      ValidatorController.validateContainsSpecialOrNumber,
    ]);
    this.lastNameInput.applyValidators([
      ValidatorController.validateMissingLetter,
      ValidatorController.validateContainsSpecialOrNumber,
    ]);
    this.dateOfBirth.applyValidators([ValidatorController.validateDateOfBirth, ValidatorController.required]);

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
      this.setAddressValues(addressInfo, addressInputs);
      addressInputs.id = addressInfo.id;
      this.addressesArr.push(addressInputs);
    } else {
      addressInputs.id = uuidv4();
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
    if (city) {
      addressCity.value = city;
      addressCity.dispatchInputEvent();
    }
    if (postalCode) {
      addressZip.value = postalCode;
      addressZip.dispatchInputEvent();
    }
    if (streetName) {
      addressStreet.value = streetName;
      addressStreet.dispatchInputEvent();
    }
    if (streetNumber) {
      addressStreetNumber.value = streetNumber;
      addressStreetNumber.dispatchInputEvent();
    }

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
    this.emailInput.dispatchInputEvent();
    if (firstName) {
      this.firstNameInput.value = firstName;
      this.firstNameInput.dispatchInputEvent();
    }
    if (lastName) {
      this.lastNameInput.value = lastName;
      this.lastNameInput.dispatchInputEvent();
    }
    if (dateOfBirth) {
      this.dateOfBirth.value = dateOfBirth;
      this.dateOfBirth.dispatchInputEvent();
    }
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

  // submit query

  private async submitInfo(): Promise<ClientResponse<Customer>> {
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

    AuthService.checkExistToken();
    const firstResp = await AuthService.updateUserInformation(AuthService.user!.version, actions);

    AuthService.createApiRootPassword(this.emailInput.value, AuthService.password);
    const addressesActions = this.setAddressActionsAsShipOrBill(firstResp.body) as MyCustomerUpdateAction[];
    const secondResp = await AuthService.updateUserInformation(firstResp.body.version, addressesActions);

    return secondResp;
  }

  private parseAddressInputsArr(arr: AddressInputs[], action: string): AddressAction[] {
    return arr.map((addressInputs) => {
      const address = this.parseAddressInputs(addressInputs);
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

  private parseAddressInputs(addressInputs: AddressInputs): Address {
    return {
      city: addressInputs.addressCity.value,
      country: addressInputs.addressCountry.value,
      postalCode: addressInputs.addressZip.value,
      streetName: addressInputs.addressStreet.value,
      streetNumber: addressInputs.addressStreetNumber.value,
      externalId: addressInputs.id,
    };
  }

  private setAddressActionsAsShipOrBill(user: Customer): AddressAction[] {
    const actions: AddressAction[] = [];
    user.addresses.forEach((address) => {
      const curAddress =
        this.addressesArr.find((addr) => addr.id === address.externalId) ||
        (this.newAddressesArr.find((addr) => addr.id === address.externalId) as AddressInputs);

      const { id } = address;

      if (curAddress.isShipAddress.checked) {
        actions.push({
          action: 'addShippingAddressId',
          addressId: id,
        });
      } else if (user.shippingAddressIds?.includes(id as string)) {
        actions.push({
          action: 'removeShippingAddressId',
          addressId: address.id,
        });
      }

      if (curAddress.isBillAddress.checked) {
        actions.push({
          action: 'addBillingAddressId',
          addressId: address.id,
        });
      } else if (user.billingAddressIds?.includes(id as string)) {
        actions.push({
          action: 'removeBillingAddressId',
          addressId: address.id,
        });
      }

      if (curAddress.isDefaultBillAddress.checked) {
        actions.push({
          action: 'setDefaultBillingAddress',
          addressId: address.id,
        });
      }

      if (curAddress.isDefaultShipAddress.checked) {
        actions.push({
          action: 'setDefaultShippingAddress',
          addressId: address.id,
        });
      }
    });

    const hasDefaultShipAddress =
      this.addressesArr.some((address) => address.isDefaultShipAddress.checked) ||
      this.newAddressesArr.some((address) => address.isDefaultShipAddress.checked);
    const hasDefaultBillAddress =
      this.addressesArr.some((address) => address.isDefaultBillAddress.checked) ||
      this.newAddressesArr.some((address) => address.isDefaultBillAddress.checked);

    if (!hasDefaultShipAddress) {
      actions.push({
        action: 'setDefaultShippingAddress',
        addressId: undefined,
      });
    }

    if (!hasDefaultBillAddress) {
      actions.push({
        action: 'setDefaultBillingAddress',
        addressId: undefined,
      });
    }

    return actions;
  }

  // Validation

  private validateInputs(): boolean {
    const isValidChangedAddresses = this.validateAddressInputs(this.addressesArr);
    const isValidNewAddresses = this.validateAddressInputs(this.newAddressesArr);

    if (
      this.emailInput.isValid() &&
      this.firstNameInput.isValid() &&
      this.lastNameInput.isValid() &&
      this.dateOfBirth.isValid() &&
      isValidChangedAddresses &&
      isValidNewAddresses
    ) {
      return true;
    }

    this.emailInput.showError();
    this.firstNameInput.showError();
    this.lastNameInput.showError();
    this.dateOfBirth.showError();
    this.showAddressInputsErrors(this.addressesArr);
    this.showAddressInputsErrors(this.newAddressesArr);
    ApiMessageHandler.showMessage('Validation error, please check input errors ☠️', 'fail');
    if (!isValidChangedAddresses || !isValidNewAddresses) {
      ApiMessageHandler.showMessage('Validation error, please check addresses checkbox ☠️', 'fail');
    }
    return false;
  }

  private validateAddressInputs(addresses: AddressInputs[]): boolean {
    if (!addresses.length) return true;
    return addresses.every((address) => {
      return (
        address.addressCity.isValid() &&
        address.addressStreet.isValid() &&
        address.addressStreetNumber.isValid() &&
        address.addressZip.isValid() &&
        (address.isBillAddress.checked || address.isShipAddress.checked)
      );
    });
  }

  private showAddressInputsErrors(addresses: AddressInputs[]): void {
    addresses.forEach((address) => {
      address.addressCity.showError();
      address.addressStreet.showError();
      address.addressStreetNumber.showError();
      address.addressZip.showError();
    });
  }
}

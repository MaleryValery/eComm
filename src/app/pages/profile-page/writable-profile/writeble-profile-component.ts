/* eslint-disable no-param-reassign */
import './writeble-profile-component.scss';
import { Address, Customer } from '@commercetools/platform-sdk';
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
};

export default class WritableProfileComponennot extends RouteComponent {
  private btnBack!: HTMLElement;
  private btnSubmit!: HTMLElement;

  private addressInputsArr: AddressInputs[] = [];
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

    this.btnAddAddress.addEventListener('click', () => {
      const container = this.renderAddress();
      container.remove();
      this.addressesHeader.after(container);
    });

    this.addressesContainer.addEventListener('click', this.onClickAddresses.bind(this));
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
    };
    this.addressInputsArr.push(addressInputs);

    if (addressInfo) this.setAddressValues(addressInfo, addressInputs);
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
    const curInputs = this.addressInputsArr.find((inputs) => inputs.btnDeleteAddress === target) as AddressInputs;
    const index = this.addressInputsArr.indexOf(curInputs);
    this.addressInputsArr.splice(index, 1);

    curInputs.container.remove();
  }

  private onShipDefaultCheckbox(target: HTMLInputElement): void {
    this.addressInputsArr.forEach((inputs) => {
      inputs.isDefaultShipAddress.checked = false;
    });
    target.checked = true;

    const curShipDefAddress = this.addressInputsArr.find(
      (inputs) => inputs.isDefaultShipAddress === target
    ) as AddressInputs;
    curShipDefAddress.isShipAddress.checked = true;
  }

  private onBillDefaultCheckbox(target: HTMLInputElement): void {
    this.addressInputsArr.forEach((inputs) => {
      inputs.isDefaultBillAddress.checked = false;
    });
    target.checked = true;

    const curBillDefAddress = this.addressInputsArr.find(
      (inputs) => inputs.isDefaultBillAddress === target
    ) as AddressInputs;
    curBillDefAddress.isBillAddress.checked = true;
  }

  private onShipCheckbox(target: HTMLInputElement): void {
    const curShipAddress = this.addressInputsArr.find((inputs) => inputs.isShipAddress === target) as AddressInputs;
    curShipAddress.isDefaultShipAddress.checked = false;
  }

  private onBillCheckbox(target: HTMLInputElement): void {
    const curBillAddress = this.addressInputsArr.find((inputs) => inputs.isBillAddress === target) as AddressInputs;
    curBillAddress.isDefaultBillAddress.checked = false;
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
      this.addressInputsArr = [];
      this.emitter.unsubscribe('logout', this.onLogoutFn);
    }
  }
}

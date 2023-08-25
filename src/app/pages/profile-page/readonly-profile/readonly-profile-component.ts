import { Address, Customer } from '@commercetools/platform-sdk';
import AuthService from '../../../services/auth-service';
import BaseComponent from '../../../shared/view/base-component';
import RouteComponent from '../../../shared/view/route-component';

import './readonly-profile-component.scss';

export default class ReadonlyProfileComponent extends RouteComponent {
  private tempText!: HTMLElement;
  private editBtn!: HTMLElement;

  private valueEmail!: HTMLElement;
  private valueFirstName!: HTMLElement;
  private valueLastName!: HTMLElement;

  private addressElems: HTMLElement[] = [];

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('profile-route_read');

    this.editBtn = BaseComponent.renderElem(this.container, 'button', ['profile__btn_edit'], 'Edit Profile');
    this.editBtn.setAttribute('data-btn-medium', '');
    this.renderPersonal();
    this.renderAddresses();

    this.bindEvents();
  }

  private bindEvents(): void {
    this.editBtn.addEventListener('click', () => {
      this.emitter.emit('changeProfile', 'toProfileWrite');
    });
  }

  private renderPersonal(): void {
    const { email, firstName, lastName } = AuthService.user as Customer;
    const personalInfo = BaseComponent.renderElem(this.container, 'section', ['personal_read']);
    BaseComponent.renderElem(personalInfo, 'h2', ['profile__heading', 'text-head-m'], 'User information');

    const personalTable = BaseComponent.renderElem(personalInfo, 'div', ['profile__table']);

    const personalRow1 = BaseComponent.renderElem(personalTable, 'div', ['profile__row']);
    const personalRow2 = BaseComponent.renderElem(personalTable, 'div', ['profile__row']);
    const personalRow3 = BaseComponent.renderElem(personalTable, 'div', ['profile__row']);

    BaseComponent.renderElem(
      personalRow1,
      'p',
      ['profile__table-title', 'profile__table-item', 'text-head-s'],
      'Email:'
    );
    BaseComponent.renderElem(
      personalRow2,
      'p',
      ['profile__table-title', 'profile__table-item', 'text-head-s'],
      'First name:'
    );
    BaseComponent.renderElem(
      personalRow3,
      'p',
      ['profile__table-title', 'profile__table-item', 'text-head-s'],
      'Last name:'
    );

    this.valueEmail = BaseComponent.renderElem(
      personalRow1,
      'p',
      ['profile__table-value', 'profile__table-item'],
      email
    );
    this.valueFirstName = BaseComponent.renderElem(
      personalRow2,
      'p',
      ['profile__table-value', 'profile__table-item'],
      firstName
    );
    this.valueLastName = BaseComponent.renderElem(
      personalRow3,
      'p',
      ['profile__table-value', 'profile__table-item'],
      lastName
    );
  }

  private renderAddresses(): void {
    const { addresses } = AuthService.user as Customer;

    const addressInfo = BaseComponent.renderElem(this.container, 'section', ['addresses_read']);
    BaseComponent.renderElem(
      addressInfo,
      'h2',
      ['profile__heading', 'addresses__heading', 'text-head-m'],
      'User addresses'
    );
    addresses.forEach((address) => {
      this.renderAddress(address, addressInfo);
    });
  }

  private renderAddressTitle(id: string, container: HTMLElement): void {
    const { billingAddressIds, shippingAddressIds } = AuthService.user as Customer;

    let title = '';
    if (billingAddressIds?.includes(id)) title = 'Billing address';
    if (shippingAddressIds?.includes(id)) title = 'Shipping address';
    if (billingAddressIds?.includes(id) && shippingAddressIds?.includes(id)) title = 'Shipping and billing address';

    BaseComponent.renderElem(container, 'h3', ['address__heading', 'text-head-s'], title);
  }

  private renderAddress(address: Address, container: HTMLElement): void {
    const addressElem = BaseComponent.renderElem(container, 'section', ['address__container']);
    const id = address.id as string;
    this.addressElems.push(addressElem);
    addressElem.dataset.id = id;

    this.renderAddressTitle(id, addressElem);

    const addressTable = BaseComponent.renderElem(addressElem, 'div', ['profile__table']);

    const addressesRow1 = BaseComponent.renderElem(addressTable, 'div', ['profile__row']);
    const addressesRow2 = BaseComponent.renderElem(addressTable, 'div', ['profile__row']);
    const addressesRow3 = BaseComponent.renderElem(addressTable, 'div', ['profile__row']);
    const addressesRow4 = BaseComponent.renderElem(addressTable, 'div', ['profile__row']);
    const addressesRow5 = BaseComponent.renderElem(addressTable, 'div', ['profile__row']);

    BaseComponent.renderElem(
      addressesRow1,
      'p',
      ['profile__table-title', 'profile__table-item', 'text-head-s'],
      'City:'
    );
    BaseComponent.renderElem(
      addressesRow2,
      'p',
      ['profile__table-title', 'profile__table-item', 'text-head-s'],
      'Country:'
    );
    BaseComponent.renderElem(
      addressesRow3,
      'p',
      ['profile__table-title', 'profile__table-item', 'text-head-s'],
      'Postal Code:'
    );
    BaseComponent.renderElem(
      addressesRow4,
      'p',
      ['profile__table-title', 'profile__table-item', 'text-head-s'],
      'Street name:'
    );
    BaseComponent.renderElem(
      addressesRow5,
      'p',
      ['profile__table-title', 'profile__table-item', 'text-head-s'],
      'Street number:'
    );

    BaseComponent.renderElem(addressesRow1, 'p', ['profile__table-value', 'profile__table-item'], address.city);
    BaseComponent.renderElem(addressesRow2, 'p', ['profile__table-value', 'profile__table-item'], address.country);
    BaseComponent.renderElem(addressesRow3, 'p', ['profile__table-value', 'profile__table-item'], address.postalCode);
    BaseComponent.renderElem(addressesRow4, 'p', ['profile__table-value', 'profile__table-item'], address.streetName);
    BaseComponent.renderElem(addressesRow5, 'p', ['profile__table-value', 'profile__table-item'], address.streetNumber);

    this.setDefaultAddress(addressTable, id);
  }

  private setDefaultAddress(container: HTMLElement, id: string): void {
    const { defaultBillingAddressId, defaultShippingAddressId } = AuthService.user as Customer;

    if (defaultBillingAddressId === id) {
      const addressesRow = BaseComponent.renderElem(container, 'div', ['profile__row', 'profile__row_default']);
      BaseComponent.renderElem(
        addressesRow,
        'p',
        ['profile__table-title', 'profile__table-item', 'text-head-s'],
        'Default billing**'
      );
    }
    if (defaultShippingAddressId === id) {
      const addressesRow = BaseComponent.renderElem(container, 'div', ['profile__row', 'profile__row_default']);
      BaseComponent.renderElem(
        addressesRow,
        'p',
        ['profile__table-title', 'profile__table-item', 'text-head-s'],
        'Default shipping**'
      );
    }
  }
}

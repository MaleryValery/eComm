/* eslint-disable @typescript-eslint/dot-notation */
import { Address, Customer } from '@commercetools/platform-sdk';
import fetchMock from 'jest-fetch-mock';
import ReadonlyProfileComponent from '../../app/pages/profile-page/readonly-profile/readonly-profile-component';
import AuthService from '../../app/services/auth-service';
import EventEmitter from '../../app/shared/util/emitter';

describe('test ReadonlyProfileComponent', () => {
  let profile: ReadonlyProfileComponent;
  const emitter = new EventEmitter();
  const main = document.createElement('main');

  const billingAddressIds = ['1'];
  const shippingAddressIds = ['1'];

  let address1: Address;

  beforeEach(() => {
    address1 = {
      id: '1',
      city: 'city',
      country: 'country',
      postalCode: '225',
      streetName: 'streetName',
      streetNumber: '552',
    };
    profile = new ReadonlyProfileComponent(emitter, '/profile');
    main.innerHTML = '';
    fetchMock.resetMocks();
  });

  describe('test render method', () => {
    beforeEach(() => {
      profile['renderAddresses'] = jest.fn();
      profile['renderPersonal'] = jest.fn();
      profile['subscribeEvents'] = jest.fn();
      profile['bindEvents'] = jest.fn();
    });

    test('should add correct class to container and edit button', () => {
      profile.render(main);
      const container = main.firstChild as HTMLElement;
      const btn = container.querySelector('.profile__btn_edit');

      expect(container.classList.contains('profile-route_read')).toBe(true);
      expect(btn instanceof HTMLButtonElement).toBe(true);
    });
  });

  describe('test renderPersonal method', () => {
    beforeEach(() => {
      AuthService.user = {
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName',
        dateOfBirth: '2010-01-01',
      } as Customer;

      profile['renderAddresses'] = jest.fn();
    });

    test('should contain correct quantity of rows', () => {
      profile.render(main);
      const rows = main.querySelectorAll('.profile__row');
      const userFields = Object.keys(AuthService.user as Customer);

      expect(rows.length).toBe(userFields.length);
    });

    test('should add correct values', () => {
      profile.render(main);

      expect(profile['valueEmail'].textContent).toBe(AuthService.user?.email);
      expect(profile['valueFirstName'].textContent).toBe(AuthService.user?.firstName);
      expect(profile['valueLastName'].textContent).toBe(AuthService.user?.lastName);
      expect(profile['valueDateOfBirth'].textContent).toBe(
        AuthService.user?.dateOfBirth?.split('-').reverse().join('-')
      );
    });
  });

  describe('test renderAddresses method', () => {
    address1 = {
      id: '1',
    } as Address;
    const address2 = {
      id: '2',
    } as Address;
    const address3 = {
      id: '3',
    };

    const addresses = [address2, address3];

    beforeAll(() => {
      AuthService.user = {
        addresses,
      } as Customer;
    });

    test('should call renderAddress method at every address in array', () => {
      profile['renderAddress'] = jest.fn();
      profile.render(main);

      expect(profile['renderAddress']).toHaveBeenCalledTimes(addresses.length);
    });
  });

  describe('test renderAddress method', () => {
    beforeEach(() => {
      profile['bindEvents'] = jest.fn();
      profile['renderPersonal'] = jest.fn();

      AuthService.user = {
        addresses: [address1],
      } as Customer;
    });

    test('should contain correct rows', () => {
      profile.render(main);
      const rows = main.querySelectorAll('.profile__row');

      expect(rows.length).toBe(5);
    });

    test('should contain correct address values', () => {
      profile.render(main);
      const values = main.querySelectorAll('.profile__table-value');

      expect(values[0].textContent).toBe(address1.city);
      expect(values[1].textContent).toBe(address1.country);
      expect(values[2].textContent).toBe(address1.postalCode);
      expect(values[3].textContent).toBe(address1.streetName);
      expect(values[4].textContent).toBe(address1.streetNumber);
    });

    test('should call renderAddressTitle and setDefaultAddress methods', () => {
      profile['renderAddressTitle'] = jest.fn();
      profile['setDefaultAddress'] = jest.fn();
      profile.render(main);

      expect(profile['renderAddressTitle']).toHaveBeenCalled();
      expect(profile['setDefaultAddress']).toHaveBeenCalled();
    });
  });

  describe('test renderAddressTitle', () => {
    test('should set correct title if user contain current id in shippingAddressIds', () => {
      AuthService.user = {
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName',
        dateOfBirth: '2010-01-01',
        addresses: [address1],
        shippingAddressIds,
      } as Customer;

      profile.render(main);
      const heading = main.querySelector('.address__heading');

      expect(heading?.textContent).toBe('Shipping address');
    });

    test('should set correct title if user contain current id in billingAddressIds', () => {
      AuthService.user = {
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName',
        dateOfBirth: '2010-01-01',
        addresses: [address1],
        billingAddressIds,
      } as Customer;

      profile.render(main);
      const heading = main.querySelector('.address__heading');

      expect(heading?.textContent).toBe('Billing address');
    });

    test('should set correct title if user contain current id in billingAddressIds and shippingAddressIds', () => {
      AuthService.user = {
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName',
        dateOfBirth: '2010-01-01',
        addresses: [address1],
        billingAddressIds,
        shippingAddressIds,
      } as Customer;

      profile.render(main);
      const heading = main.querySelector('.address__heading');

      expect(heading?.textContent).toBe('Shipping and billing address');
    });
  });

  describe('test setDefaultAddress method', () => {
    beforeEach(() => {
      profile['bindEvents'] = jest.fn();
      profile['renderPersonal'] = jest.fn();

      AuthService.user = {
        addresses: [address1],
        billingAddressIds,
        shippingAddressIds,
        defaultBillingAddressId: '1',
        defaultShippingAddressId: '1',
      } as Customer;
    });

    test('should add 1 line if address default billing or shipping', () => {
      profile.render(main);
      const rows = main.querySelectorAll('.profile__row');

      expect(rows.length).toBe(7);
    });
  });

  describe('test clearProfile method', () => {
    AuthService.user = {
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      dateOfBirth: '2010-01-01',
      addresses: [address1],
    } as Customer;

    test('should clear elemsArr and set isRendered flag to false', () => {
      profile.render(main);

      expect(profile['isRendered']).toBe(true);
      expect(profile['addressElems'].length).toBeTruthy();

      profile.clearProfile();

      expect(profile['isRendered']).toBe(false);
      expect(profile['addressElems'].length).toBeFalsy();
    });
  });
});

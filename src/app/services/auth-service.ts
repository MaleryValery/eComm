import { Customer, CustomerSignInResult, CustomerUpdateAction } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { NewCustomer } from '../shared/types/customers-type';
import Router from '../shared/util/router';
import { CustomerAddress } from '../shared/types/address-type';
import {
  anonymApiRoot,
  createPasswordAuthMiddlewareOptions,
  passwordApiRoot,
  passwordClientBuild,
} from '../shared/util/client-builder';

class AuthService {
  public static apiRootPassword: ByProjectKeyRequestBuilder;

  private static _user: Customer;

  public static set user(user: Customer) {
    this._user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  public static get user(): Customer {
    if (!this._user) {
      // todo think how to avoid ! in local storage
      this._user = JSON.parse(localStorage.getItem('user')!);
    }
    return this._user;
  }

  public static isAuthorized(): boolean {
    return !!this.user;
  }

  public static async createCustomer(customerObj: NewCustomer): Promise<CustomerSignInResult> {
    const response = await anonymApiRoot
      .customers()
      .post({
        body: customerObj,
      })
      .execute();
    console.log('response.body', response.body);

    return response.body;
  }

  private static createApiRoot(email: string, password: string): void {
    if (!this.apiRootPassword) {
      const clientobj = createPasswordAuthMiddlewareOptions(email, password);
      const client = passwordClientBuild(clientobj);
      this.apiRootPassword = passwordApiRoot(client);
    }
  }

  public static async register(
    dto: NewCustomer,
    shipAddressDto: CustomerAddress,
    billAddressDto: CustomerAddress,
    shipping: boolean,
    billing: boolean
  ): Promise<void> {
    const response = await this.createCustomer(dto);

    this.createApiRoot(dto.email, dto.password);
    this.user = response.customer;
    console.log(' this.user after create customer: ', this.user);

    if (JSON.stringify(shipAddressDto) === JSON.stringify(billAddressDto)) {
      this.user = await this.addCustomerAddress(shipAddressDto);
      const addressShippingId = this.user.addresses[0].id!;
      console.log('addressId: ', addressShippingId);
      this.user = await this.setDefaultAdresses(addressShippingId, shipping, billing);
    } else {
      this.user = await this.addCustomerAddress(shipAddressDto);
      this.user = await this.addCustomerAddress(billAddressDto);
      const addressShippingId = this.user.addresses[0].id!;
      const addressBillingId = this.user.addresses[1].id!;
      console.log('addressId: ', addressShippingId);
      console.log('addressId: ', addressBillingId);
      this.user = await this.setDefaultAdresses(addressShippingId, shipping, billing);
      this.user = await this.setDefaultAdresses(addressBillingId, shipping, billing);
    }

    this.login(dto.email, dto.password);
  }

  private static async addCustomerAddress(address: CustomerAddress): Promise<Customer> {
    console.log('first address', address);
    const response = await this.apiRootPassword
      .customers()
      .withId({ ID: this.user.id })
      .post({
        body: {
          version: this.user.version,
          actions: [
            {
              action: 'addAddress',
              ...address,
            },
          ],
        },
      })
      .execute();

    return response.body;
  }

  private static async setDefaultAdresses(addressId: string, shipping: boolean, billing: boolean): Promise<Customer> {
    console.log('addressId: ', addressId);

    const actions = ([] as unknown) as CustomerUpdateAction[];
    if (shipping) {
      actions.push({ action: 'setDefaultShippingAddress', addressId });
    }
    if (billing) {
      actions.push({ action: 'setDefaultBillingAddress', addressId });
    }

    console.log('actions adresses: ', actions);
    const response = await this.apiRootPassword
      .customers()
      .withId({ ID: this.user.id })
      .post({
        body: {
          version: this.user.version,
          actions,
        },
      })
      .execute();

    return response.body;
  }

  static async login(email: string, password: string): Promise<void> {
    this.createApiRoot(email, password);

    const resp = await this.apiRootPassword
      .login()
      .post({
        body: {
          email,
          password,
        },
      })
      .execute();

    if (resp.statusCode === 200) {
      const { customer } = resp.body;
      this.user = customer;

      setTimeout(() => Router.navigate(''), 1000);
    }
  }
}

export default AuthService;

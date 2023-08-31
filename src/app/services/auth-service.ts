/* eslint-disable import/no-cycle */
import { Customer, CustomerDraft, CustomerSignInResult } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { CustomerAddress } from '../shared/types/address-type';
import { NewCustomer } from '../shared/types/customers-type';
import ApiMessageHandler from '../shared/util/api-message-handler';
import {
  anonymApiRoot,
  createPasswordAuthMiddlewareOptions,
  passwordApiRoot,
  passwordClientBuild,
} from '../shared/util/client-builder';
import Router from '../shared/util/router';

class AuthService {
  public static apiRootPassword: ByProjectKeyRequestBuilder;

  private static _user: Customer | null;
  public static password = '';

  public static set user(user: Customer | null) {
    this._user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  public static get user(): Customer | null {
    if (!this._user) {
      this._user = JSON.parse(localStorage.getItem('user')!);
    }
    return this._user;
  }

  public static isAuthorized(): boolean {
    return !!this.user;
  }

  public static async createCustomer(
    customerObj: CustomerDraft,
    shipAddressDto: CustomerAddress,
    billAddressDto: CustomerAddress,
    shipping: boolean,
    billing: boolean
  ): Promise<CustomerSignInResult> {
    const addressesArray = this.checkUserAddresses(shipAddressDto, billAddressDto);
    const checkBilling = addressesArray.length === 2 ? 1 : 0;
    const response = await anonymApiRoot
      .customers()
      .post({
        body: {
          ...customerObj,
          addresses: addressesArray,
          shippingAddresses: [0],
          billingAddresses: addressesArray.length === 2 ? [1] : [0],
          defaultShippingAddress: shipping ? 0 : undefined,
          defaultBillingAddress: billing ? checkBilling : undefined,
        },
      })
      .execute();

    return response.body;
  }

  public static createApiRoot(email: string, password: string): void {
    const clientobj = createPasswordAuthMiddlewareOptions(email, password);
    const client = passwordClientBuild(clientobj);
    this.apiRootPassword = passwordApiRoot(client);
  }

  public static async register(
    dto: NewCustomer,
    shipAddressDto: CustomerAddress,
    billAddressDto: CustomerAddress,
    shipping: boolean,
    billing: boolean
  ): Promise<void> {
    const response = await this.createCustomer(dto, shipAddressDto, billAddressDto, shipping, billing);

    this.user = response.customer;
    ApiMessageHandler.showMessage(`Welcome ${this.user.firstName}! You successfully signUp ⚡️`, 'success');
    this.login(dto.email, dto.password);
  }

  private static checkUserAddresses(shipAddressDto: CustomerAddress, billAddressDto: CustomerAddress) {
    if (JSON.stringify(shipAddressDto) === JSON.stringify(billAddressDto)) {
      return [shipAddressDto.address];
    }
    return [shipAddressDto.address, billAddressDto.address];
  }

  public static async login(email: string, password: string): Promise<void> {
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

      this.password = password;
      ApiMessageHandler.showMessage(`Hi ${this.user.firstName}! You successfully signIn ⚡️`, 'success');
      Router.navigate('');
    }
  }

  public static async checkCreditsLogin(email: string) {
    const response = await anonymApiRoot.customers().get().execute();
    const isExistingCustomer = response.body.results.find((customer) => customer.email === email);
    if (isExistingCustomer) {
      ApiMessageHandler.showMessage('Wrong password', 'fail');
    } else ApiMessageHandler.showMessage('Customer not found', 'fail');
  }

  public static logout(): void {
    this.user = null;
    this.password = '';
  }
}

export default AuthService;

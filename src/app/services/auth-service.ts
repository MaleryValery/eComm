/* eslint-disable import/no-cycle */
import {
  ClientResponse,
  Customer,
  CustomerDraft,
  CustomerSignInResult,
  MyCustomerUpdateAction,
} from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { ExistingTokenMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { CustomerAddress } from '../shared/types/address-type';
import { NewCustomer } from '../shared/types/customers-type';
import ApiMessageHandler from '../shared/util/api-message-handler';
import {
  anonymousApiRoot,
  anonymClientBuild,
  authMiddlewareOptions,
  createPasswordAuthMiddlewareOptions,
  createRefreshTokenAuthMiddlewareOptions,
  existingTokenApiRoot,
  existingTokenClientBuild,
  existingTokenMiddlewareOptions,
  passwordApiRoot,
  passwordClientBuild,
  refreshTokenClientBuild,
} from '../shared/util/client-builder';
import Router from '../shared/util/router';
import CartService from './cart-service';

class AuthService {
  public static apiRoot: ByProjectKeyRequestBuilder;

  private static _user: Customer | null;
  public static password = '';

  public static set user(user: Customer | null) {
    this._user = user;
    localStorage.setItem('sntUser', JSON.stringify(user));
  }

  public static get user(): Customer | null {
    if (!this._user) {
      this._user = JSON.parse(localStorage.getItem('sntUser')!);
    }
    return this._user;
  }

  public static isAuthorized(): boolean {
    return !!this.user;
  }

  public static createApiRootPassword(email: string, password: string): void {
    const clientobj = createPasswordAuthMiddlewareOptions(email, password);
    const client = passwordClientBuild(clientobj);
    this.apiRoot = passwordApiRoot(client);
  }

  public static createApiRootAnonymous(): void {
    const client = anonymClientBuild(authMiddlewareOptions);
    this.apiRoot = anonymousApiRoot(client);
  }

  public static createExistTokenApiRoot(accessToken: string, options: ExistingTokenMiddlewareOptions): void {
    const clientobj = existingTokenClientBuild(accessToken, options);
    this.apiRoot = existingTokenApiRoot(clientobj);
  }

  public static createRefreshTokenApiRoot(refreshToken: string): void {
    const clientobj = createRefreshTokenAuthMiddlewareOptions(refreshToken);
    const client = refreshTokenClientBuild(clientobj);
    this.apiRoot = existingTokenApiRoot(client);
  }

  public static async createCustomer(
    customerObj: CustomerDraft,
    shipAddressDto: CustomerAddress,
    billAddressDto: CustomerAddress,
    shipping: boolean,
    billing: boolean
  ): Promise<CustomerSignInResult> {
    const addressesArray = this.checkUserAddresses(shipAddressDto, billAddressDto);
    this.createApiRootAnonymous();
    this.checkExistToken();
    const checkBilling = addressesArray.length === 2 ? 1 : 0;
    const response = await this.apiRoot
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

  public static async login(email: string, password: string): Promise<void> {
    if (!this.apiRoot) this.createApiRootAnonymous();
    // this.checkExistToken();
    this.checkRefreshtToken();

    const resp = await this.apiRoot
      .me()
      .login()
      .post({
        body: {
          email,
          password,
          activeCartSignInMode: 'MergeWithExistingCustomerCart',
        },
      })
      .execute();

    if (resp.body.cart) CartService.cart = resp.body.cart;

    localStorage.removeItem('sntToken');
    this.getMyUser(email, password); // switch to password flow

    if (resp.statusCode === 200) {
      const { customer } = resp.body;
      this.user = customer;

      this.password = password;
      ApiMessageHandler.showMessage(`Hi ${this.user.firstName}! You successfully signIn ⚡️`, 'success');
      Router.navigate('');
    }
  }

  public static async getMyUser(email: string, password: string) {
    this.createApiRootPassword(email, password);
    const newCustomer = await this.apiRoot.me().get().execute();
    return newCustomer;
  }

  public static async changePassword(version: number, currentPassword: string, newPassword: string): Promise<void> {
    // this.checkExistToken();
    this.checkRefreshtToken();
    await this.apiRoot
      .me()
      .password()
      .post({
        body: {
          version,
          currentPassword,
          newPassword,
        },
      })
      .execute();
  }

  public static async relogin(email: string, password: string) {
    // this.checkExistToken()
    try {
      this.checkRefreshtToken();
      await this.apiRoot
        .me()
        .login()
        .post({
          body: {
            email,
            password,
          },
        })
        .execute();
      const newCustomer = await this.getMyUser(email, password); // switch to password flow and get token
      this.user = newCustomer.body;
    } catch (err) {
      console.error('something went wrong ', err);
    }
  }

  public static async updateUserInformation(
    version: number,
    actions: MyCustomerUpdateAction[]
  ): Promise<ClientResponse<Customer>> {
    return this.apiRoot
      .me()
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute();
  }

  public static logout(): void {
    this.user = null;
    this.password = '';
    CartService.cart = null;
    localStorage.removeItem('sntToken');
    localStorage.removeItem('sntCart');
    this.createApiRootAnonymous();
  }

  public static checkExistToken() {
    if (localStorage.getItem('sntToken')) {
      const token = JSON.parse(localStorage.getItem('sntToken') as string);
      this.createExistTokenApiRoot(token.token, existingTokenMiddlewareOptions);
    }
  }

  public static checkRefreshtToken() {
    if (localStorage.getItem('sntToken')) {
      const token = JSON.parse(localStorage.getItem('sntToken') as string);
      this.createRefreshTokenApiRoot(token.refreshToken);
    }
  }

  private static checkUserAddresses(shipAddressDto: CustomerAddress, billAddressDto: CustomerAddress) {
    if (JSON.stringify(shipAddressDto) === JSON.stringify(billAddressDto)) {
      return [shipAddressDto.address];
    }
    return [shipAddressDto.address, billAddressDto.address];
  }
}

export default AuthService;

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
  anonymApiRoot,
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

class AuthService {
  public static apiRootPassword: ByProjectKeyRequestBuilder;
  public static apiRootExistToken: ByProjectKeyRequestBuilder;
  public static apiRootRefreshToken: ByProjectKeyRequestBuilder;

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

  public static createApiRootPassword(email: string, password: string): void {
    const clientobj = createPasswordAuthMiddlewareOptions(email, password);
    const client = passwordClientBuild(clientobj);
    this.apiRootPassword = passwordApiRoot(client);
  }

  public static createExistTokenApiRoot(accessToken: string, options: ExistingTokenMiddlewareOptions): void {
    const clientobj = existingTokenClientBuild(accessToken, options);

    this.apiRootExistToken = existingTokenApiRoot(clientobj);
  }

  public static createRefreshTokenApiRoot(refreshToken: string): void {
    const clientobj = createRefreshTokenAuthMiddlewareOptions(refreshToken);
    const client = refreshTokenClientBuild(clientobj);
    this.apiRootRefreshToken = existingTokenApiRoot(client);
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
    localStorage.removeItem('sntToken');
    this.createApiRootPassword(email, password);

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

  public static async changePassword(version: number, currentPassword: string, newPassword: string): Promise<void> {
    await AuthService.apiRootRefreshToken
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

  public static async relogin(email: string, password: string): Promise<ClientResponse<Customer>> {
    await AuthService.apiRootPassword
      .me()
      .login()
      .post({
        body: {
          email,
          password,
        },
      })
      .execute();

    const newCustomer = await AuthService.apiRootPassword.me().get().execute();
    return newCustomer;
  }

  public static async updateUserInformation(
    version: number,
    actions: MyCustomerUpdateAction[]
  ): Promise<ClientResponse<Customer>> {
    return AuthService.apiRootExistToken
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
    localStorage.removeItem('sntToken');
  }
}

export default AuthService;

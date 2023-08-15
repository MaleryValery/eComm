import { CustomerSignInResult } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { NewCustomer } from '../../shared/types/customers-type';
import {
  anonymApiRoot,
  createPasswordAuthMiddlewareOptions,
  passwordApiRoot,
  passwordClientBuild,
} from '../../shared/util/client-builder';
import { CustomerAddress } from '../../shared/types/address-type';

export async function createCustomer(customerObj: NewCustomer): Promise<CustomerSignInResult> {
  const response = await anonymApiRoot
    .customers()
    .post({
      body: customerObj,
    })
    .execute();
  console.log('response.body', response.body);

  return response.body;
}

export async function addCustomerAddress(
  version: number,
  apiRoot: ByProjectKeyRequestBuilder,
  id: string,
  customerAddress: CustomerAddress
) {
  const response = await apiRoot
    .customers()
    .withId({ ID: id })
    .post({
      body: {
        version,
        actions: [
          {
            action: 'addAddress',
            ...customerAddress,
          },
        ],
      },
    })
    .execute();

  console.log('response.address', response.body);

  return response.body;
}

export async function setDefaultBillingAddress(
  version: number,
  apiRoot: ByProjectKeyRequestBuilder,
  id: string,
  customerAddressId: string
) {
  const response = await apiRoot
    .customers()
    .withId({ ID: id })
    .post({
      body: {
        version,
        actions: [
          {
            action: 'setDefaultBillingAddress',
            addressId: customerAddressId,
          },
        ],
      },
    })
    .execute();

  console.log('response.default billing address', response.body);

  return response.body;
}

export async function setDefaultShippingAddress(
  version: number,
  apiRoot: ByProjectKeyRequestBuilder,
  id: string,
  customerAddressId: string
) {
  const response = await apiRoot
    .customers()
    .withId({ ID: id })
    .post({
      body: {
        version,
        actions: [
          {
            action: 'setDefaultShippingAddress',
            addressId: customerAddressId,
          },
        ],
      },
    })
    .execute();

  console.log('response.default shipping address', response.body);

  return response.body;
}

export const passwordFlow = (email: string, pass: string) => {
  const passwordFlowOptions = createPasswordAuthMiddlewareOptions(email, pass);
  const clientPassword = passwordClientBuild(passwordFlowOptions);
  return passwordApiRoot(clientPassword);
};

// todo хрень какая то, почитать как отправлять сразу 2 запроса
export const addAddress = async (
  response: CustomerSignInResult,
  apiRoot: ByProjectKeyRequestBuilder,
  customerAddress: CustomerAddress,
  shipping: boolean,
  billing: boolean
) => {
  const responseWithAddress = await addCustomerAddress(
    response.customer.version,
    apiRoot,
    response.customer.id,
    customerAddress
  );
  if (shipping) {
    const responseWithShippingAddress = await setDefaultShippingAddress(
      responseWithAddress.version,
      apiRoot,
      responseWithAddress.id,
      responseWithAddress.addresses[0].id!
    );
    if (billing) {
      await setDefaultBillingAddress(
        responseWithShippingAddress.version,
        apiRoot,
        responseWithShippingAddress.id,
        responseWithShippingAddress.addresses[0].id!
      );
    }
  }
};

import { Customer } from '@commercetools/platform-sdk';
import { anonymApiRoot } from './client-builder';

async function getCustomerData(customerId: string): Promise<Customer | undefined> {
  const requestCustomerFromApi = await anonymApiRoot.customers().withId({ ID: customerId }).get().execute();
  console.log('request user data', requestCustomerFromApi);
  if (requestCustomerFromApi.statusCode === 200) {
    const userName = requestCustomerFromApi.body;
    return userName;
  }
  return undefined;
}

export default getCustomerData;

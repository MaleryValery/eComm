import { Customer } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';

const isLoggedIn = async (apiRoot: ByProjectKeyRequestBuilder, id: string): Promise<boolean> => {
  try {
    const response = await apiRoot.customers().withId({ ID: id }).get().execute();

    if (response.statusCode === 200) {
      const customer: Customer = response.body;
      console.log('customer: ', customer);
      return !!customer.id;
    }
  } catch (error) {
    console.error((error as Error).message);
  }

  return false;
};

export default isLoggedIn;

import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import {
  AuthMiddlewareOptions,
  Client,
  ClientBuilder,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

const SPA = {
  PROJECT_KEY: 'our-magic-project-rs-school',
  SCOPES: [
    'manage_my_profile:our-magic-project-rs-school manage_my_quotes:our-magic-project-rs-school view_categories:our-magic-project-rs-school manage_my_quote_requests:our-magic-project-rs-school view_cart_discounts:our-magic-project-rs-school create_anonymous_token:our-magic-project-rs-school view_shipping_methods:our-magic-project-rs-school manage_my_shopping_lists:our-magic-project-rs-school manage_my_payments:our-magic-project-rs-school view_shopping_lists:our-magic-project-rs-school view_products:our-magic-project-rs-school manage_my_orders:our-magic-project-rs-school manage_customers:our-magic-project-rs-school view_published_products:our-magic-project-rs-school manage_my_business_units:our-magic-project-rs-school view_states:our-magic-project-rs-school',
  ],
  CLIENT_ID: 'WMhbHSurOWlc2_mvmtAR72bN',
  CLIENT_SECRET: 'q7M6qN7GhbBVeUaAYB-wY38Hvr6Hejvl',
  API_URL: 'https://api.europe-west1.gcp.commercetools.com',
  AUTH_URL: 'https://auth.europe-west1.gcp.commercetools.com',
};

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: SPA.AUTH_URL,
  projectKey: SPA.PROJECT_KEY,
  credentials: {
    clientId: SPA.CLIENT_ID,
    clientSecret: SPA.CLIENT_SECRET,
  },
  scopes: SPA.SCOPES,
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: SPA.API_URL,
  fetch,
};
// Configure httpMiddlewareOptions
const createPasswordAuthMiddlewareOptions = (userEmail: string, userPassword: string) => {
  const passwordAuthMiddlewareOptions: PasswordAuthMiddlewareOptions = {
    host: SPA.AUTH_URL,
    projectKey: SPA.PROJECT_KEY,
    credentials: {
      clientId: SPA.CLIENT_ID,
      clientSecret: SPA.CLIENT_SECRET,
      user: {
        username: userEmail,
        password: userPassword,
      },
    },
    scopes: SPA.SCOPES,
    fetch,
  };
  return passwordAuthMiddlewareOptions;
};

// Export the ClientBuilder
const anonymClientBuild = new ClientBuilder()
  .withAnonymousSessionFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .build();

const passwordClientBuild = (passwordFlowObj: PasswordAuthMiddlewareOptions): Client =>
  new ClientBuilder().withPasswordFlow(passwordFlowObj).withHttpMiddleware(httpMiddlewareOptions).build();

const anonymApiRoot = createApiBuilderFromCtpClient(anonymClientBuild).withProjectKey({
  projectKey: SPA.PROJECT_KEY,
});

const passwordApiRoot = (passworFlowObj: Client): ByProjectKeyRequestBuilder =>
  createApiBuilderFromCtpClient(passworFlowObj).withProjectKey({
    projectKey: SPA.PROJECT_KEY,
  });

export {
  SPA,
  anonymApiRoot,
  authMiddlewareOptions,
  createPasswordAuthMiddlewareOptions,
  httpMiddlewareOptions,
  passwordApiRoot,
  passwordClientBuild,
};

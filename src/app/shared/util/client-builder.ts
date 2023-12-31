import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import {
  ClientBuilder,
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  Client,
  RefreshAuthMiddlewareOptions,
  ExistingTokenMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import tokenCache from './token-cash';

const SPA = {
  PROJECT_KEY: 'our-magic-project-rs-school',
  SCOPES: [
    'manage_my_profile:our-magic-project-rs-school manage_my_quotes:our-magic-project-rs-school manage_cart_discounts:our-magic-project-rs-school view_categories:our-magic-project-rs-school manage_my_quote_requests:our-magic-project-rs-school manage_order_edits:our-magic-project-rs-school manage_my_shopping_lists:our-magic-project-rs-school manage_my_payments:our-magic-project-rs-school manage_product_selections:our-magic-project-rs-school manage_products:our-magic-project-rs-school manage_my_business_units:our-magic-project-rs-school manage_my_orders:our-magic-project-rs-school manage_orders:our-magic-project-rs-school create_anonymous_token:our-magic-project-rs-school manage_customers:our-magic-project-rs-school view_published_products:our-magic-project-rs-school',
  ],
  CLIENT_ID: 'Wg4VIS6QSSCjhbkZnicy2Pi8',
  CLIENT_SECRET: '81cqUZeQ-l-p2MChho4a9eP9eXvCsoWl',
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
  tokenCache,
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
    tokenCache,
    fetch,
  };
  return passwordAuthMiddlewareOptions;
};

const createRefreshTokenAuthMiddlewareOptions = (accessToken: string) => {
  const refreshTokenAuthMiddlewareOptions: RefreshAuthMiddlewareOptions = {
    host: SPA.AUTH_URL,
    projectKey: SPA.PROJECT_KEY,
    credentials: {
      clientId: SPA.CLIENT_ID,
      clientSecret: SPA.CLIENT_SECRET,
    },
    refreshToken: accessToken,
    tokenCache,
    fetch,
  };
  return refreshTokenAuthMiddlewareOptions;
};

const existingTokenMiddlewareOptions: ExistingTokenMiddlewareOptions = {
  force: true,
};

// Export the ClientBuilder
const anonymClientBuild = (anonAuthMiddlewareOptions: AuthMiddlewareOptions) =>
  new ClientBuilder()
    .withAnonymousSessionFlow(anonAuthMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

const passwordClientBuild = (passwordFlowObj: PasswordAuthMiddlewareOptions): Client =>
  new ClientBuilder().withPasswordFlow(passwordFlowObj).withHttpMiddleware(httpMiddlewareOptions).build();

const refreshTokenClientBuild = (refreshTokenFlowObj: RefreshAuthMiddlewareOptions): Client =>
  new ClientBuilder().withRefreshTokenFlow(refreshTokenFlowObj).withHttpMiddleware(httpMiddlewareOptions).build();

const existingTokenClientBuild = (accessToken: string, existingTokenFlowObj: ExistingTokenMiddlewareOptions): Client =>
  new ClientBuilder()
    .withExistingTokenFlow(`Bearer ${accessToken}`, existingTokenFlowObj)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

const anonymousApiRoot = (anonymClient: Client) =>
  createApiBuilderFromCtpClient(anonymClient).withProjectKey({
    projectKey: SPA.PROJECT_KEY,
  });

const existingTokenApiRoot = (existingTokenFlowObj: Client): ByProjectKeyRequestBuilder =>
  createApiBuilderFromCtpClient(existingTokenFlowObj).withProjectKey({
    projectKey: SPA.PROJECT_KEY,
  });

const refreshTokenApiRoot = (refreshTokenFlowObj: Client): ByProjectKeyRequestBuilder =>
  createApiBuilderFromCtpClient(refreshTokenFlowObj).withProjectKey({
    projectKey: SPA.PROJECT_KEY,
  });

const passwordApiRoot = (passworFlowObj: Client): ByProjectKeyRequestBuilder =>
  createApiBuilderFromCtpClient(passworFlowObj).withProjectKey({
    projectKey: SPA.PROJECT_KEY,
  });

export {
  anonymousApiRoot,
  authMiddlewareOptions,
  httpMiddlewareOptions,
  passwordClientBuild,
  refreshTokenClientBuild,
  existingTokenApiRoot,
  existingTokenClientBuild,
  existingTokenMiddlewareOptions,
  createPasswordAuthMiddlewareOptions,
  createRefreshTokenAuthMiddlewareOptions,
  passwordApiRoot,
  anonymClientBuild,
  refreshTokenApiRoot,
};

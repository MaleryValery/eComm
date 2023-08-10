import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ClientBuilder, AuthMiddlewareOptions, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';

const ADMIN = {
  PROJECT_KEY: 'our-magic-project-rs-school',
  SCOPES: ['manage_project:our-magic-project-rs-school manage_api_clients:our-magic-project-rs-school'],
  CLIENT_ID: 'Tyg5-2U0wUFl3TQBKBXfj9Qz',
  CLIENT_SECRET: 'p4tVXmUKb3ia4kr1Q8NBJ3lh74Vd32kP',
  API_URL: 'https://api.europe-west1.gcp.commercetools.com',
  AUTH_URL: 'https://auth.europe-west1.gcp.commercetools.com',
};

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: ADMIN.AUTH_URL,
  projectKey: ADMIN.PROJECT_KEY,
  credentials: {
    clientId: ADMIN.CLIENT_ID,
    clientSecret: ADMIN.CLIENT_SECRET,
  },
  scopes: ADMIN.SCOPES,
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: ADMIN.API_URL,
  fetch,
};

// Export the ClientBuilder
const ctpClient = new ClientBuilder()
  // .withProjectKey(SPA.PROJECT_KEY) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  // .withLoggerMiddleware() // Include middleware for logging
  .build();

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: ADMIN.PROJECT_KEY });

export default apiRoot;

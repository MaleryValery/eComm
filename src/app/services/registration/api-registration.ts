import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  ClientBuilder,

  // Import middlewares
  AuthMiddlewareOptions, // Required for auth
  HttpMiddlewareOptions,
  createAuthForClientCredentialsFlow,
  createHttpClient,
  createClient, // Required for sending HTTP requests
} from '@commercetools/sdk-client-v2';

type NewCustomer = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export default class ApiSignUp {
  private static SPA = {
    PROJECT_KEY: 'our-magic-project-rs-school',
    SCOPES: [
      'manage_my_profile:our-magic-project-rs-school manage_my_quotes:our-magic-project-rs-school view_categories:our-magic-project-rs-school manage_my_quote_requests:our-magic-project-rs-school create_anonymous_token:our-magic-project-rs-school view_published_products:our-magic-project-rs-school manage_my_shopping_lists:our-magic-project-rs-school manage_my_payments:our-magic-project-rs-school manage_my_business_units:our-magic-project-rs-school view_products:our-magic-project-rs-school manage_my_orders:our-magic-project-rs-school',
    ],
    CLIENT_ID: 'qvozcNWU5HgawAg9Trd8cCAW',
    CLIENT_SECRET: 'o_v75q4qUn4yPjaz5VNTNeka1Q4xHSGT',
    API_URL: 'https://api.europe-west1.gcp.commercetools.com',
    AUTH_URL: 'https://auth.europe-west1.gcp.commercetools.com',
  };
  private static ADMIN = {
    PROJECT_KEY: 'our-magic-project-rs-school',
    SCOPES: ['manage_project:our-magic-project-rs-school manage_api_clients:our-magic-project-rs-school'],
    CLIENT_ID: 'Tyg5-2U0wUFl3TQBKBXfj9Qz',
    CLIENT_SECRET: 'p4tVXmUKb3ia4kr1Q8NBJ3lh74Vd32kP',
    API_URL: 'https://api.europe-west1.gcp.commercetools.com',
    AUTH_URL: 'https://auth.europe-west1.gcp.commercetools.com',
  };

  // Configure authMiddlewareOptions
  private static authMiddlewareOptions: AuthMiddlewareOptions = {
    host: this.ADMIN.AUTH_URL,
    projectKey: this.ADMIN.PROJECT_KEY,
    credentials: {
      clientId: this.ADMIN.CLIENT_ID,
      clientSecret: this.ADMIN.CLIENT_SECRET,
    },
    scopes: this.ADMIN.SCOPES,
    fetch,
  };

  // Configure httpMiddlewareOptions
  private static httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: this.ADMIN.API_URL,
    fetch,
  };

  // Export the ClientBuilder
  private static ctpClient = new ClientBuilder()
    // .withProjectKey(SPA.PROJECT_KEY) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
    .withClientCredentialsFlow(this.authMiddlewareOptions)
    .withHttpMiddleware(this.httpMiddlewareOptions)
    // .withLoggerMiddleware() // Include middleware for logging
    .build();

  private static getClient = () => {
    const authMiddleWare = createAuthForClientCredentialsFlow(this.authMiddlewareOptions);
    const httpMiddleWare = createHttpClient(this.httpMiddlewareOptions);
    const client = createClient({
      middlewares: [authMiddleWare, httpMiddleWare],
    });
    return client;
  };

  public static apiRoot = createApiBuilderFromCtpClient(this.ctpClient).withProjectKey({
    projectKey: this.ADMIN.PROJECT_KEY,
  });
}

import AuthService from '../../services/auth-service';
import { createPasswordAuthMiddlewareOptions, passwordApiRoot, passwordClientBuild } from './client-builder';
// import isLoggedIn from './is-logged-in';
import Router from './router';

const login = async (email: string, password: string): Promise<void> => {
  const clientobj = createPasswordAuthMiddlewareOptions(email, password);
  const client = passwordClientBuild(clientobj);
  const apiRoot = passwordApiRoot(client);
  const resp = await apiRoot
    .login()
    .post({
      body: {
        email,
        password,
      },
    })
    .execute();

  console.log('resp', resp);
  if (resp.statusCode === 200) {
    const { customer } = resp.body;
    AuthService.setUser(customer);

    setTimeout(() => Router.navigate(''), 1000);

    // isLoggedIn(apiRoot, customer.id);
  }
};

export default login;

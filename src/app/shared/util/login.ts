import apiRoot from './client-builder';
import Router from './router';

const login = async (email: string, password: string) => {
  const resp = await apiRoot
    .login()
    .post({
      body: {
        email,
        password,
      },
    })
    .execute();
  console.log(resp);
  if (resp.statusCode === 200) {
    setTimeout(() => Router.navigate(''), 1000);
  }
};

export default login;

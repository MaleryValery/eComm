import HomeComponent from '../pages/home-page/home-component';
import LoginComponent from '../pages/login-page/login-component';
import RegisterComponent from '../pages/register-page/register-component';
import { Routs } from '../shared/types/routsType';

const ROUTS: Routs = [
  {
    name: 'Home',
    nav: true,
    path: '/',
    Component: HomeComponent,
  },
  {
    name: 'Login',
    path: '/login',
    Component: LoginComponent,
  },
  {
    name: 'Register',
    path: '/register',
    Component: RegisterComponent,
  },
];

export default ROUTS;

import HomeComponent from '../pages/home-page/home-component';
import LoginComponent from '../pages/login-page/login-component';
import RegisterComponent from '../pages/register-page/register-component';
import { Routes } from '../shared/types/routes-type';

const ROUTS: Routes = [
  {
    name: 'Home',
    path: '/',
    Component: HomeComponent,
  },
  {
    name: 'Login',
    path: '/login',
    Component: LoginComponent,
    authorizedRedirectPath: '/',
  },
  {
    name: 'Register',
    path: '/register',
    Component: RegisterComponent,
    authorizedRedirectPath: '/',
  },
];

export default ROUTS;

import ErrorComponent from '../pages/error-page/error-page';
import HomeComponent from '../pages/home-page/home-component';
import LoginComponent from '../pages/login-page/login-component';
import RegisterComponent from '../pages/register-page/register-component';
import { Routes } from '../shared/types/routes-type';

const ROUTS: Routes = [
  {
    name: 'Error',
    path: '',
    Component: ErrorComponent,
  },
  {
    name: 'Home',
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

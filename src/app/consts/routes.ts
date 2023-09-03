import ErrorComponent from '../pages/error-page/error-component';
import HomeComponent from '../pages/home-page/home-component';
import LoginComponent from '../pages/login-page/login-component';
import ProfileComponent from '../pages/profile-page/profile-component';
import RegisterComponent from '../pages/register-page/register-component';
import { Routes } from '../shared/types/routes-type';

const ROUTS: Routes = [
  {
    name: 'Error',
    path: '**',
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
    authorizedRedirectPath: '/',
  },
  {
    name: 'Register',
    path: '/register',
    Component: RegisterComponent,
    authorizedRedirectPath: '/',
  },
  {
    name: 'Profile',
    path: '/profile',
    Component: ProfileComponent,
    nonAuthorizedRedirectPath: '/',
  },
];

export default ROUTS;

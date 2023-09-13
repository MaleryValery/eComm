import CartComponent from '../pages/cart-page/cart-component';
import AboutComponent from '../pages/about-page/about-component';
import CatalogComponent from '../pages/catalog-page/catalog-component';
import ErrorComponent from '../pages/error-page/error-component';
import HomeComponent from '../pages/home-page/home-component';
import LoginComponent from '../pages/login-page/login-component';
import ProductComponent from '../pages/product-page/product-component';
import ProfileComponent from '../pages/profile-page/profile-component';
import RegisterComponent from '../pages/register-page/register-component';
import { Routes } from '../shared/types/routes-type';

const ROUTS: Routes = [
  {
    name: 'Error',
    path: /\*\*/,
    Component: ErrorComponent,
  },
  {
    name: 'Home',
    path: /^\/$/,
    Component: HomeComponent,
  },
  {
    name: 'Login',
    path: /^\/login$/,
    Component: LoginComponent,
    authorizedRedirectPath: '/',
  },
  {
    name: 'Register',
    path: /^\/register$/,
    Component: RegisterComponent,
    authorizedRedirectPath: '/',
  },
  {
    name: 'Product',
    path: /^\/catalog\/key.+/,
    Component: ProductComponent,
  },
  {
    name: 'Catalog',
    path: /^\/catalog$/,
    Component: CatalogComponent,
  },
  {
    name: 'Profile',
    path: /^\/profile$/,
    Component: ProfileComponent,
    nonAuthorizedRedirectPath: '/',
  },
  {
    name: 'Cart',
    path: /^\/cart$/,
    Component: CartComponent,
  },
  {
    name: 'About us',
    path: /^\/about$/,
    Component: AboutComponent,
  },
];

export default ROUTS;

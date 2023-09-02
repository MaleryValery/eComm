// eslint-disable-next-line import/no-cycle
import AuthService from '../../services/auth-service';
import ProductComponent from '../../pages/product-page/product-component';
import ProductService from '../../services/products-service';
import { IRenderedRoute } from '../types/routes-type';
import EventEmitter from './emitter';

export default class Router {
  private routs: IRenderedRoute[] = [];
  private mainTag!: HTMLElement;
  private productPage = new ProductComponent(this.emitter);

  constructor(private emitter: EventEmitter) {
    this.bindEvents();
  }

  private bindEvents(): void {
    window.addEventListener('hashchange', () => {
      this.changeRoute();
    });
    window.addEventListener('load', () => {
      this.changeRoute();
    });
  }

  public addRoute(route: IRenderedRoute): void {
    this.routs.push(route);
  }

  public changeRoute(): void {
    const path = Router.parseLocation();
    if (!path) return;
    const activeRoute = this.routs.find((route) => route.path === path);

    const authorizedRedirectPath = AuthService.isAuthorized() && activeRoute?.authorizedRedirectPath;
    if (authorizedRedirectPath) {
      Router.navigate(authorizedRedirectPath);
      return;
    }
    this.routs.forEach((route) => {
      if (route.component.isRendered) {
        route.component.hide();
      }
    });
    if (this.productPage.isRendered) {
      this.productPage.hide();
    }
    if (activeRoute) {
      if (!activeRoute.component.isRendered) activeRoute.component.render(this.mainTag);
      activeRoute.component.show();
    } else if (path.match(/\/catalog\/key.+/)) {
      this.showProductRoute(path);
    } else {
      this.showErrorRoute();
    }
  }

  private showErrorRoute(): void {
    const errorRoute = this.routs.find((route) => route.path === '**') as IRenderedRoute;
    if (!errorRoute.component.isRendered) {
      errorRoute.component.render(this.mainTag);
    }
    errorRoute.component.show();
  }

  private showProductRoute(path: string) {
    const pathWay = path.split('/');
    const productKey = pathWay[pathWay.length - 1].toUpperCase();
    const currentProductData = ProductService.productsList.find((product) => product.key === productKey);

    if (currentProductData) {
      if (!this.productPage.isRendered) {
        this.productPage.render(this.mainTag);
      }
      this.productPage.renderProductCard(currentProductData);
      this.productPage.show();
    }
  }

  private static parseLocation(): string | null {
    const hashPath = window.location.hash.slice(1).toLowerCase();
    if (hashPath) {
      return hashPath;
    }
    const pathName = window.location.pathname.toLowerCase() || '/';
    Router.navigate(pathName);
    window.location.pathname = '/';
    return null;
  }

  public setContainer(mainTag: HTMLElement): void {
    this.mainTag = mainTag;
  }

  public static navigate(path: string) {
    window.location.hash = `#${path}`;
  }
}

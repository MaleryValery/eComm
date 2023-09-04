/* eslint-disable import/no-cycle */
import AuthService from '../../services/auth-service';
// import ProductService from '../../services/products-service';
import { IRenderedRoute } from '../types/routes-type';
import EventEmitter from './emitter';

export default class Router {
  private routs: IRenderedRoute[] = [];
  private mainTag!: HTMLElement;

  constructor(private emitter: EventEmitter) {
    this.bindEvents();
    // this.subscribeEvents();
  }

  private bindEvents(): void {
    window.addEventListener('hashchange', () => {
      this.changeRoute();
    });
    window.addEventListener('load', () => {
      this.changeRoute();
    });
  }

  // private subscribeEvents(): void {
  //   this.emitter.subscribe('showErrorPage', () => {
  //     this.showErrorRoute();
  //   });
  // }

  public addRoute(route: IRenderedRoute): void {
    this.routs.push(route);
  }

  public changeRoute(): void {
    const path = Router.parseLocation();
    if (!path) return;

    const activeRoute = this.routs.find((route) => path.match(route.path));

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

    if (activeRoute) {
      if (!activeRoute.component.isRendered) activeRoute.component.render(this.mainTag);
      activeRoute.component.show(path);
    } else {
      this.showErrorRoute();
    }
  }

  private showErrorRoute(): void {
    const errorRoute = this.routs.find((route) => route.path.test('**')) as IRenderedRoute;
    if (!errorRoute.component.isRendered) {
      errorRoute.component.render(this.mainTag);
    }
    errorRoute.component.show();
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

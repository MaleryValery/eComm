// eslint-disable-next-line import/no-cycle
import AuthService from '../../services/auth-service';
import { IRenderedRoute } from '../types/routes-type';

export default class Router {
  private routs: IRenderedRoute[] = [];
  private mainTag!: HTMLElement;

  constructor() {
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

    const isAuthorizedAndAuthRoute = AuthService.isAuthorized() && (path === '/login' || path === '/register');
    if (isAuthorizedAndAuthRoute) {
      Router.navigate('/');
      return;
    }

    const activeRoute = this.routs.find((route) => route.path === path);
    this.routs.forEach((route) => {
      if (route.component.isRendered) {
        route.component.hide();
      }
    });
    if (activeRoute) {
      if (!activeRoute.component.isRendered) activeRoute.component.render(this.mainTag);
      activeRoute.component.onLogin();
    }
  }

  private static parseLocation(): string {
    return window.location.hash.slice(1).toLowerCase() || '/';
  }

  public setContainer(mainTag: HTMLElement): void {
    this.mainTag = mainTag;
  }

  public static navigate(path: string) {
    window.location.hash = `#${path}`;
  }
}

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
    if (activeRoute) {
      if (!activeRoute.component.isRendered) activeRoute.component.render(this.mainTag);
      activeRoute.component.show();
    } else {
      const errorRoute = this.routs.find((route) => route.path === '**') as IRenderedRoute;
      if (!errorRoute.component.isRendered) {
        errorRoute.component.render(this.mainTag);
      }
      errorRoute.component.show();
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

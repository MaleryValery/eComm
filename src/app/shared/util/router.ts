import { IRenderedRoute } from '../types/routsType';

export default class Router {
  private routs: IRenderedRoute[] = [];

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
    const activeRoute = this.routs.find((route) => route.path === path);
    this.routs.forEach((route) => route.component.hide());
    if (activeRoute) {
      activeRoute.component.show();
    }
  }

  private static parseLocation(): string {
    return window.location.hash.slice(1).toLowerCase() || '/';
  }
}

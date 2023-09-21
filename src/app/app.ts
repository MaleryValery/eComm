import ROUTS from './consts/routes';
import HeaderComponent from './header/header-component';
import EventEmitter from './shared/util/emitter';
import Router from './shared/util/router';
import BaseComponent from './shared/view/base-component';
import RouteComponent from './shared/view/route-component';

export default class AppComponent extends BaseComponent {
  private body = document.body;
  private mainTag = document.createElement('main');
  private header = new HeaderComponent(this.emitter);

  private routes = ROUTS;
  private pages: RouteComponent[] = [];

  constructor(emitter: EventEmitter, private readonly router: Router) {
    super(emitter);
  }

  public render() {
    this.routes.forEach((route) => {
      const component = new route.Component(this.emitter, route.path);
      const { authorizedRedirectPath, nonAuthorizedRedirectPath } = route;
      this.router.addRoute({ path: route.path, component, authorizedRedirectPath, nonAuthorizedRedirectPath });
      this.pages.push(component);
    });
    this.router.setContainer(this.mainTag);

    this.header.render(this.body);

    this.body.append(this.mainTag);
  }
}

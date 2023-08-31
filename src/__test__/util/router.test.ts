/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/dot-notation */
import { IRenderedRoute } from '../../app/shared/types/routes-type';
import EventEmitter from '../../app/shared/util/emitter';
import Router from '../../app/shared/util/router';
import RouteComponent from '../../app/shared/view/route-component';

class FirstMockComponent extends RouteComponent {
  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('home-route');
  }
}

class SecondMockComponent extends RouteComponent {
  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('login-route');
  }
}

class ErrorMockComponent extends RouteComponent {
  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('error404-route');
  }
}

describe('test Router', () => {
  let router: Router;
  let route1: IRenderedRoute;
  let route2: IRenderedRoute;
  let errorRoute: IRenderedRoute;
  const mainTag = document.createElement('main');
  const emitter = new EventEmitter();

  beforeEach(() => {
    router = new Router(emitter);
    mainTag.innerHTML = '';

    route1 = {
      path: '/route1',
      component: new FirstMockComponent(emitter, '/route1'),
    };

    route2 = {
      path: '/route2',
      component: new SecondMockComponent(emitter, '/route2'),
    };

    errorRoute = {
      path: '**',
      component: new ErrorMockComponent(emitter, '**'),
    };

    router.setContainer(mainTag);
    router.addRoute(route1);
    router.addRoute(route2);
    router.addRoute(errorRoute);
  });

  test('should change route when hash has changed', () => {
    route1.component.render = jest.fn();
    route1.component.show = jest.fn();

    window.location.hash = '#/route1';
    router.changeRoute();

    expect(route1.component.render).toHaveBeenCalledWith(mainTag);
    expect(route1.component.show).toHaveBeenCalled();
  });

  test('should not change route if route already rendered', () => {
    route1.component.render = jest.fn();
    route1.component.show = jest.fn();

    const container = document.createElement('div');

    window.location.hash = '#/route1';
    route1.component.isRendered = true;
    route1.component['container'] = container;
    router.changeRoute();

    expect(route1.component.render).not.toHaveBeenCalled();
    expect(route1.component.show).toHaveBeenCalled();
  });

  test('should hide previous route after changing routes', () => {
    window.location.hash = '#/route1';
    router.changeRoute();
    route1.component.isRendered = true;

    window.location.hash = '#/route2';
    router.changeRoute();
    route1.component.isRendered = true;

    expect(route1.component['isShown']).toBe(false);
  });

  test('should render error page if path is not defined', () => {
    errorRoute.component.render = jest.fn();
    errorRoute.component.show = jest.fn();

    window.location.hash = '#/smthing';
    router.changeRoute();

    expect(errorRoute.component.render).toHaveBeenCalledWith(mainTag);
    expect(errorRoute.component.show).toHaveBeenCalled();
  });
});

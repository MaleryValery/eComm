import EventEmitter from '../util/emitter';
import RouteComponent from '../view/route-component';

export interface IRoute {
  name: string;
  path: string;
  Component: new (emitter: EventEmitter, ...args: unknown[]) => RouteComponent;
  authorizedRedirectPath?: string;
  nonAuthorizedRedirectPath?: string;
}

export type Routes = IRoute[];

export interface IRenderedRoute {
  authorizedRedirectPath?: string;
  nonAuthorizedRedirectPath?: string;
  path: string;
  component: RouteComponent;
}

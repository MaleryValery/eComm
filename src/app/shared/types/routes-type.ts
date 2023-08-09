import EventEmitter from '../util/emitter';
import RouteComponent from '../view/route-component';

export interface IRoute {
  name: string;
  path: string;
  Component: new (emitter: EventEmitter, ...args: unknown[]) => RouteComponent;
  nav?: boolean;
}

export type Routes = IRoute[];

export interface IRenderedRoute {
  path: string;
  component: RouteComponent;
}

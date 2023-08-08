import EventEmitter from '../util/emitter';
import RouteComponent from '../view/route-component';

export interface IRoute {
  name: string;
  path: string;
  Component: new (emitter: EventEmitter, data: string) => RouteComponent;
  nav?: boolean;
}

export type Routs = IRoute[];

export interface IRenderedRoute {
  path: string;
  component: RouteComponent;
}

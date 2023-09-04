/* eslint-disable @typescript-eslint/no-unused-vars */
import EventEmitter from '../util/emitter';
import BaseComponent from './base-component';

export default abstract class RouteComponent extends BaseComponent {
  protected isShown = true;
  public isRendered = false;
  protected path: string;

  protected container!: HTMLElement;
  protected parent!: HTMLElement;

  constructor(emitter: EventEmitter, ...args: unknown[]) {
    super(emitter);
    const [path] = args;
    this.path = path as string;
  }

  public render(parent: HTMLElement): void {
    this.isRendered = true;
    this.parent = parent;
    this.container = document.createElement('div');
    this.container.classList.add('route__wrapper');
    parent.append(this.container);
  }

  public show(...args: unknown[]): void | Promise<void> {
    if (!this.isShown) {
      this.isShown = true;
      this.parent.append(this.container);
    }
  }

  public hide(): void {
    this.isShown = false;
    this.container.remove();
  }
}

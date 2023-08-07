import EventEmitter from '../util/emitter';
import BaseComponent from './base-component';

export default abstract class RouteComponent extends BaseComponent {
  protected isShown = false;
  protected container!: HTMLElement;
  protected parent!: HTMLElement;

  constructor(emitter: EventEmitter, private readonly path: string) {
    super(emitter);
  }

  public render(parent: HTMLElement): void {
    this.parent = parent;
    this.container = document.createElement('div');
    this.container.classList.add('route__wrapper');
    parent.append(this.container);
  }

  public show(): void {
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

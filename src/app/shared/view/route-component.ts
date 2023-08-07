import EventEmitter from '../util/emitter';
import BaseComponent from './base-component';

export default abstract class RouteComponent extends BaseComponent {
  protected isShown = false;
  protected wrapper!: HTMLElement;
  protected parent!: HTMLElement;

  constructor(emitter: EventEmitter, private readonly path: string) {
    super(emitter);
  }

  public render(parent: HTMLElement): void {
    this.parent = parent;
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('route__wrapper');
    parent.append(this.wrapper);
  }

  public show(): void {
    if (!this.isShown) {
      this.isShown = true;
      this.parent.append(this.wrapper);
    }
  }

  public hide(): void {
    this.isShown = false;
    this.wrapper.remove();
  }
}

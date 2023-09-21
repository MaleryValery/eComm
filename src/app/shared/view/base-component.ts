import EventEmitter from '../util/emitter';

export default abstract class BaseComponent {
  protected isShown = true;
  protected container!: HTMLElement;

  constructor(protected readonly emitter: EventEmitter) {}

  abstract render(parent: HTMLElement, ...args: unknown[]): void;

  public show(): void {
    if (!this.isShown) {
      this.isShown = true;
      this.container.style.display = 'block';
    }
  }

  public hide(): void {
    if (this.isShown) {
      this.isShown = false;
      this.container.style.display = 'none';
    }
  }

  public static renderElem(
    parent: HTMLElement,
    tag: string,
    classes?: string[] | null,
    text?: string | null,
    type?: string
  ): HTMLElement {
    const elem = document.createElement(tag);
    if (classes) elem.classList.add(...classes);
    if (text) elem.textContent = text;
    if (type && elem instanceof HTMLInputElement) elem.type = type;
    parent.append(elem);
    return elem;
  }
}

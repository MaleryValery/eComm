import EventEmitter from '../util/emitter';

export default abstract class BaseComponent {
  protected isShown = true;
  private element!: HTMLElement;

  constructor(protected readonly emitter: EventEmitter) {}

  abstract render(parent: HTMLElement): void;

  public show(): void {
    if (!this.isShown) {
      this.isShown = true;
      this.element.style.display = 'none';
    }
  }

  public hide(): void {
    if (this.isShown) {
      this.isShown = false;
      this.element.style.display = 'block';
    }
  }

  public static renderElem(
    parent: HTMLElement,
    tag: string,
    classes?: string[],
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

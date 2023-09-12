import '../styles/loader.scss';
import BaseComponent from '../base-component';

export default class Loader {
  private parent!: HTMLElement;
  private loader!: HTMLElement;
  private loaderSpin!: HTMLElement;
  private parentPos!: string;

  public init(parent: HTMLElement, classesLoader?: string[]) {
    this.parent = parent;
    this.loader = document.createElement('div');
    this.loader.classList.add('loader', ...(classesLoader || []));

    const parentStyles = getComputedStyle(parent);
    this.parentPos = parentStyles.position;

    this.loaderSpin = BaseComponent.renderElem(this.loader, 'div', ['loader__spin']);
  }

  public show(): void {
    this.parent.style.position = 'relative';
    this.parent.prepend(this.loader);
  }

  public hide(): void {
    this.parent.style.position = this.parentPos;
    this.loader.remove();
  }
}

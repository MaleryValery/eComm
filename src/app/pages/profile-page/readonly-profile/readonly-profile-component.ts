import BaseComponent from '../../../shared/view/base-component';
import RouteComponent from '../../../shared/view/route-component';

export default class ReadonlyProfileComponent extends RouteComponent {
  private tempText!: HTMLElement;
  private tempBtn!: HTMLElement;

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('route__profile_read');

    this.tempText = BaseComponent.renderElem(this.container, 'h2', ['tempText'], "It's profile read");
    this.tempBtn = BaseComponent.renderElem(this.container, 'button', ['tempBtn'], 'To profile write');

    this.bindEvents();
  }

  private bindEvents(): void {
    this.tempBtn.addEventListener('click', () => {
      this.emitter.emit('changeProfile', 'toProfileWrite');
    });
  }
}

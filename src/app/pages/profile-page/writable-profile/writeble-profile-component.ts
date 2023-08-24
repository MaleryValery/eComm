import RouteComponent from '../../../shared/view/route-component';
import BaseComponent from '../../../shared/view/base-component';

export default class WritableProfileComponent extends RouteComponent {
  private tempText!: HTMLElement;
  private tempBtn!: HTMLElement;

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('route__profile_read');

    this.tempText = BaseComponent.renderElem(this.container, 'h2', ['tempText'], "It's profile write");
    this.tempBtn = BaseComponent.renderElem(this.container, 'button', ['tempBtn'], 'To profile read');

    this.bindEvents();
  }

  private bindEvents(): void {
    this.tempBtn.addEventListener('click', () => {
      this.emitter.emit('changeProfile', 'toProfileRead');
    });
  }
}

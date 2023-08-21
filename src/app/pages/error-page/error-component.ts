import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import './error-component.scss';

export default class ErrorComponent extends RouteComponent {
  img!: HTMLElement;
  firstText!: HTMLElement;
  secondText!: HTMLElement;
  homeBtn!: HTMLAnchorElement;

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('error404-route');

    this.img = BaseComponent.renderElem(this.container, 'div', ['error404__img']);
    this.firstText = BaseComponent.renderElem(this.container, 'p', ['error404__text'], 'Oops... Something went wrong.');
    this.secondText = BaseComponent.renderElem(this.container, 'p', ['error404__text'], 'Error 404: page is not exist');
    this.homeBtn = BaseComponent.renderElem(
      this.container,
      'a',
      ['error404__btn'],
      'Go back home'
    ) as HTMLAnchorElement;
    this.homeBtn.href = '';
    this.homeBtn.setAttribute('data-link-btn', '');
    this.homeBtn.setAttribute('data-btn-medium', '');
  }
}

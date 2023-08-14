import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import './error-page.scss';

export default class ErrorComponent extends RouteComponent {
  img!: HTMLElement;
  text!: HTMLElement;

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('error404-route');

    this.img = BaseComponent.renderElem(this.container, 'div', ['error404__img']);
    this.text = BaseComponent.renderElem(
      this.container,
      'div',
      ['error404__text'],
      'Oops... Something went wrong. Error 404: page is not exist'
    );
  }
}

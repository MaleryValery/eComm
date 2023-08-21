import AuthService from '../../services/auth-service';
import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import './home-component.scss';

export default class HomeComponent extends RouteComponent {
  message!: HTMLElement;

  public render(parent: HTMLElement): void {
    super.render(parent);

    this.container.classList.add('home-route');
    this.message = BaseComponent.renderElem(this.container, 'h2', ['todo-message'], 'Coming soon...');
  }
}

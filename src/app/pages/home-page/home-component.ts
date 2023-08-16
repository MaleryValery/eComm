import AuthService from '../../services/auth-service';
import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import './home-component.scss';

export default class HomeComponent extends RouteComponent {
  message!: HTMLElement;

  public render(parent: HTMLElement): void {
    super.render(parent);
    // todo ask Alex how to fix order of render and wait for response from AuthService.getUser()
    if (localStorage.getItem('user')) {
      const userName = AuthService.user.firstName;
      console.log('userName home page', userName);
      const text = userName ? `Hello, ${userName}` : 'Coming soon...';
      this.message = BaseComponent.renderElem(this.container, 'h2', ['todo-message'], text);
    }
  }
}

import AuthService from '../../services/auth-service';
import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import './home-component.scss';

export default class HomeComponent extends RouteComponent {
  message!: HTMLElement;

  public async render(parent: HTMLElement): Promise<void> {
    super.render(parent);
    // todo ask Alex how to fix order of render and wait for response from AuthService.getUser()
    const userName = await AuthService.getUser();
    console.log('userName', userName);
    if (userName) {
      const text = userName ? `Hello, ${userName}` : 'Coming soon...';
      this.message = BaseComponent.renderElem(this.container, 'h2', ['todo-message'], text);
    }
  }
}

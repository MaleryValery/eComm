import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import CartListProductsComponent from './cart-product-list';
import './cart-component.scss';
import CartService from '../../services/cart-service';

class CartComponent extends RouteComponent {
  private cartHeader!: HTMLElement;
  private cartBody!: HTMLElement;

  private cartListProductsComponent = new CartListProductsComponent(this.emitter);

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('cart-route');
    this.cartHeader = BaseComponent.renderElem(
      this.container,
      'div',
      ['cart-header', 'text-head-m'],
      'Thank you for your choise!'
    );
    this.cartBody = BaseComponent.renderElem(this.container, 'div', ['cart-body']);

    this.cartListProductsComponent.render(this.cartBody);
  }

  public async show(): Promise<void> {
    try {
      await CartService.getUserCart();
      this.emitter.emit('renderCarts', undefined);
      super.show();
    } catch {
      this.emitter.emit('showErrorPage', null);
    }
  }
}

export default CartComponent;

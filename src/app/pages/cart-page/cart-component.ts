import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import CartListProductsComponent from './cart-product-list';
import './cart-component.scss';
import CartService from '../../services/cart-service';

class CartComponent extends RouteComponent {
  private cartHeader!: HTMLElement;
  private cartBody!: HTMLElement;
  public removeAllItems!: HTMLButtonElement;

  private cartListProductsComponent = new CartListProductsComponent(this.emitter);

  public bindEvents() {
    this.removeAllItems.addEventListener('click', async () => {
      await CartService.removeAllItemsFromCart();
      this.emitter.emit('renderEmptyCart', null);
      this.emitter.emit('setFilteredItems', null);
      this.emitter.emit('updateQtyHeader', CartService.cart?.totalLineItemQuantity);
    });
  }

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('cart-route');
    this.cartHeader = BaseComponent.renderElem(
      this.container,
      'div',
      ['cart-header', 'text-head-m'],
      'Welcome to your cart 🛒'
    );
    this.cartBody = BaseComponent.renderElem(this.container, 'div', ['cart-body']);

    this.cartListProductsComponent.render(this.cartBody);
    this.removeAllItems = BaseComponent.renderElem(
      this.cartBody,
      'button',
      ['remove-all'],
      'remove all products'
    ) as HTMLButtonElement;

    this.bindEvents();
  }

  public async show(): Promise<void> {
    super.show();
    try {
      await CartService.getUserCart();
      this.emitter.emit('renderCart', null);
    } catch (err) {
      if ((err as Response).status !== 404) {
        this.emitter.emit('showErrorPage', null);
      }
    }
  }
}

export default CartComponent;

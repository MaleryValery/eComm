import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import CartListProductsComponent from './cart-product-list';
import './cart-component.scss';
import CartService from '../../services/cart-service';
import Loader from '../../shared/view/loader/loader';
import CartModalComponent from './cart-modal-component/cart-modal-component';

class CartComponent extends RouteComponent {
  private cartHeader!: HTMLElement;
  private cartBody!: HTMLElement;
  public removeAllItems!: HTMLButtonElement;

  private cartListProductsComponent = new CartListProductsComponent(this.emitter);
  private loader = new Loader();
  private modal = new CartModalComponent(this.emitter);

  private bindEvents(): void {
    this.removeAllItems.addEventListener('click', async () => {
      this.modal.show();
    });
  }

  private subscribeEvents(): void {
    this.emitter.subscribe('showRemoveAllBtn', (qty: number) => this.showRemoveAllBtn(qty));
    this.emitter.subscribe('showCartLoader', () => this.loader.show());
    this.emitter.subscribe('hideCartLoader', () => this.loader.hide());
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

    this.modal.render(this.container);

    this.bindEvents();
    this.subscribeEvents();
    this.emitter.emit('renderEmptyCart', null);
    this.showRemoveAllBtn(CartService.cart?.totalLineItemQuantity);
    this.loader.init(this.cartBody, ['loader_white']);
  }

  private showRemoveAllBtn(itemsQty: number | undefined): void {
    if (!itemsQty) {
      this.removeAllItems.style.display = 'none';
    } else {
      this.removeAllItems.style.display = 'block';
    }
  }

  public async show(): Promise<void> {
    super.show();
    try {
      await CartService.getUserCart();
      this.emitter.emit('renderItemsInCart', null);
    } catch (err) {
      if ((err as Response).status !== 404) {
        this.emitter.emit('showErrorPage', null);
      }
    }
  }
}

export default CartComponent;

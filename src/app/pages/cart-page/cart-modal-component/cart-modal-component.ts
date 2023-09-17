import './cart-modal-component.scss';
import BaseComponent from '../../../shared/view/base-component';
import CartService from '../../../services/cart-service';

export default class CartModalComponent extends BaseComponent {
  public isRendered = false;
  public isShown = true;

  protected container!: HTMLElement;
  private wrapper!: HTMLElement;
  private form!: HTMLElement;

  private btnCancel!: HTMLElement;
  private btnSubmit!: HTMLElement;

  public render(parent: HTMLElement): void {
    this.container = BaseComponent.renderElem(parent, 'div', ['modal-cart']);
    this.wrapper = BaseComponent.renderElem(this.container, 'section', ['modal-cart__wrapper']);
    BaseComponent.renderElem(
      this.wrapper,
      'h2',
      ['modal-cart__heading'],
      'Are you sure you want to remove all items from the cart?'
    );

    const btnContainer = BaseComponent.renderElem(this.wrapper, 'div', ['modal-cart__buttons']);
    this.btnSubmit = BaseComponent.renderElem(btnContainer, 'button', ['modal-cart__btn-submit'], 'Confirm');
    this.btnCancel = BaseComponent.renderElem(btnContainer, 'button', ['modal-cart__btn-cancel'], 'Cancel');

    this.subscribeEvents();
    this.bindEvents();
    this.isRendered = true;
    this.hide();
  }

  private subscribeEvents(): void {
    this.emitter.subscribe('hashchange', () => this.hide());
  }

  private bindEvents(): void {
    this.container.addEventListener('click', async (e) => {
      if (e.target === this.container || e.target === this.btnCancel) this.hide();
      if (e.target === this.btnSubmit) {
        this.hide();
        await CartService.removeAllItemsFromCart();
        this.emitter.emit('renderEmptyCart', null);
        this.emitter.emit('setFilteredItems', null);
        this.emitter.emit('updateQtyHeader', CartService.cart?.totalLineItemQuantity);
        this.emitter.emit('showRemoveAllBtn', CartService.cart?.totalLineItemQuantity);
      }
    });
  }

  public show(): void {
    super.show();
    document.body.classList.add('no-scroll');
  }

  public hide(): void {
    super.hide();
    document.body.classList.remove('no-scroll');
  }
}

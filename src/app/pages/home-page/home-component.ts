import CartService from '../../services/cart-service';
import Router from '../../shared/util/router';
import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import './home-component.scss';

export default class HomeComponent extends RouteComponent {
  public gitarCategory!: HTMLElement;
  public ampCategory!: HTMLElement;
  public accCategory!: HTMLElement;
  public categoriesWrapper!: HTMLElement;
  public catalogBtn!: HTMLElement;
  public promoContainer!: HTMLElement;

  public async render(parent: HTMLElement): Promise<void> {
    super.render(parent);
    this.container.classList.add('home-route');

    BaseComponent.renderElem(this.container, 'h2', ['heading-categories'], 'Welcome');
    BaseComponent.renderElem(
      this.container,
      'h3',
      ['subheading-categories'],
      'We have many wonderful products for you.'
    );
    BaseComponent.renderElem(this.container, 'h3', ['subheading-categories'], 'You can find them in our catalog.');
    this.catalogBtn = BaseComponent.renderElem(this.container, 'button', ['button-catalog'], "Let's go to the catalog");
    this.categoriesWrapper = BaseComponent.renderElem(this.container, 'div', ['categories-cantainer']);

    this.gitarCategory = BaseComponent.renderElem(this.categoriesWrapper, 'div', ['category-item']);
    this.ampCategory = BaseComponent.renderElem(this.categoriesWrapper, 'div', ['category-item']);
    this.accCategory = BaseComponent.renderElem(this.categoriesWrapper, 'div', ['category-item']);

    this.renderCategory(this.gitarCategory, 'Guitars', './img/guitar-categ..png');
    this.renderCategory(this.ampCategory, 'Amplifiers', './img/amp-categ..jpg');
    this.renderCategory(this.accCategory, 'Accessories', './img/acc-categ..jpg');

    this.bindEvents();
    await this.renderPromoCodes(this.container);
  }

  public renderCategory(parent: HTMLElement, header: string, imgSrc: string): void {
    const imgContainer = BaseComponent.renderElem(parent, 'picture', ['category-img-container']);
    const img = BaseComponent.renderElem(imgContainer, 'img', ['category-img']) as HTMLImageElement;
    img.src = imgSrc;
    BaseComponent.renderElem(parent, 'h3', ['category-heading'], `${header}`);
  }

  public async renderPromoCodes(parent: HTMLElement): Promise<void> {
    await CartService.getPromoCodes();
    if (!CartService.promoCodes?.length) return;
    this.promoContainer = BaseComponent.renderElem(parent, 'div', ['promocode-container']);
    CartService.promoCodes.forEach((promo) => {
      const promoWrapper = BaseComponent.renderElem(this.promoContainer, 'div', ['promocode-wrapper']);
      BaseComponent.renderElem(promoWrapper, 'h3', ['promocode-code', 'text-head-s'], promo.code);
      BaseComponent.renderElem(promoWrapper, 'p', ['promocode-name', 'text-regular'], promo.name?.en);
      BaseComponent.renderElem(promoWrapper, 'p', ['promocode-dis', 'text-hint'], promo.description?.en);
    });
  }

  public bindEvents() {
    this.catalogBtn.addEventListener('click', () => Router.navigate('/catalog'));
  }
}

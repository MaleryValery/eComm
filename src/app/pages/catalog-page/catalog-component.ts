import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import './catalog-component.scss';
import CatalogController from './catalog-controller';
import CatalogFiltersComponent from './catalog-filters-component';
import CatalogCardsListComponent from './catalog-cards-list-component';

class CatalogComponent extends RouteComponent {
  private catalogController = new CatalogController(this.emitter);
  private catalogContainer!: HTMLElement;

  private catalogFiltersComponent = new CatalogFiltersComponent(this.catalogController, this.emitter);
  private catalogCardsListComponent = new CatalogCardsListComponent(this.catalogController, this.emitter);

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('catalog-route');
    this.catalogContainer = BaseComponent.renderElem(this.container, 'div', ['catalog_wrapper']);

    this.catalogFiltersComponent.render(this.catalogContainer);
    this.catalogCardsListComponent.render(this.catalogContainer);
  }
}

export default CatalogComponent;

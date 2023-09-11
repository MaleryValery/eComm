import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import './catalog-component.scss';
import CatalogController from './catalog-controller';
import CatalogFiltersComponent from './catalog-filters-component';
import CatalogCardsListComponent from './catalog-cards-list-component';
import Loader from '../../shared/util/loader';

class CatalogComponent extends RouteComponent {
  private catalogController!: CatalogController;
  private catalogContainer!: HTMLElement;

  private loader!: Loader;

  private catalogFiltersComponent!: CatalogFiltersComponent;
  private catalogCardsListComponent!: CatalogCardsListComponent;

  public render(parent: HTMLElement): void {
    super.render(parent);

    this.container.classList.add('catalog-route');
    this.catalogContainer = BaseComponent.renderElem(this.container, 'div', ['catalog_wrapper']);

    this.loader = new Loader();
    // this.loader.init(this.container, ['loader_fixed']);

    this.catalogController = new CatalogController(this.emitter, this.loader);
    this.catalogFiltersComponent = new CatalogFiltersComponent(this.catalogController, this.emitter);
    this.catalogCardsListComponent = new CatalogCardsListComponent(this.catalogController, this.emitter, this.loader);

    this.catalogFiltersComponent.render(this.catalogContainer);
    this.catalogCardsListComponent.render(this.catalogContainer);
  }
}

export default CatalogComponent;

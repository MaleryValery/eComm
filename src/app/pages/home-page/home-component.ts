import ProductService from '../../services/products-service';
import Router from '../../shared/util/router';
import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';

import './home-component.scss';

export default class HomeComponent extends RouteComponent {
  message!: HTMLElement;

  public async render(parent: HTMLElement): Promise<void> {
    super.render(parent);

    this.container.classList.add('home-route');

    const wrapper = BaseComponent.renderElem(this.container, 'div', ['products-wrapper']);
    wrapper.innerHTML = await this.addItems();
    wrapper.addEventListener('click', (e) => {
      this.cliсk(e);
    });
  }

  private async addItems(): Promise<string> {
    const products = await ProductService.getAllProducts();
    let items = '';
    products.forEach((product) => {
      items += `<div data-key = ${product.key}>${product.masterData.current.name.en}</div>`;
    });
    return items;
  }

  public async cliсk(e: Event) {
    const eventTarget = e.target as HTMLElement;
    if (eventTarget.dataset.key) {
      Router.navigate(`/catalog/${eventTarget.dataset.key}`);
    }
  }
}

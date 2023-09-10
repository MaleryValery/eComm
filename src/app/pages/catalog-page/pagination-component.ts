/* eslint-disable @typescript-eslint/no-unused-expressions */
import maxCardsPerPage from '../../consts/max-cards-per-page';
import BaseComponent from '../../shared/view/base-component';

class PaginationComponent extends BaseComponent {
  private activePage = 1;
  private paginationContainer!: HTMLElement;
  private paginationPages!: HTMLElement;
  private prevControl!: HTMLElement;
  private nextControl!: HTMLElement;
  private totalPages!: number;

  public render(parent: HTMLElement, itemsCount: number): void {
    this.paginationContainer = BaseComponent.renderElem(parent, 'div', ['pagination']);
    this.totalPages = Math.ceil(itemsCount / maxCardsPerPage);

    // this.prevControl = BaseComponent.renderElem(
    //   this.paginationContainer,
    //   'span',
    //   ['pagination-control', 'control-prev'],
    //   '<'
    // );
    // this.paginationPages = BaseComponent.renderElem(this.paginationContainer, 'div', ['pagination-pages']);
    // this.nextControl = BaseComponent.renderElem(
    //   this.paginationContainer,
    //   'span',
    //   ['pagination-control', 'control-next'],
    //   '>'
    // );

    this.renderControls();
    this.renderPages();
    this.changeControlsState();
    this.onChangePage();

    this.emitter.subscribe('updatePagination', (newItemsCount: number) => this.updatePagination(newItemsCount));
  }

  private renderControls() {
    this.prevControl = BaseComponent.renderElem(
      this.paginationContainer,
      'span',
      ['pagination-control', 'control-prev'],
      '<'
    );
    this.paginationPages = BaseComponent.renderElem(this.paginationContainer, 'div', ['pagination-pages']);
    this.nextControl = BaseComponent.renderElem(
      this.paginationContainer,
      'span',
      ['pagination-control', 'control-next'],
      '>'
    );
  }

  private updatePagination(newItemsCount: number) {
    const newTotalPages = Math.ceil(newItemsCount / maxCardsPerPage);
    if (newItemsCount === 0) {
      this.paginationContainer.innerHTML = '';
      this.totalPages = newTotalPages;
    }
    if (newTotalPages !== this.totalPages && newItemsCount > 0) {
      this.totalPages = newTotalPages;
      this.activePage = 1;
      this.paginationContainer.innerHTML = '';
      this.renderControls();
      this.renderPages();
      this.changeActivePage();
    }
  }

  private renderPages() {
    for (let i = 1; i <= this.totalPages; i += 1) {
      if (i === this.activePage) {
        BaseComponent.renderElem(this.paginationPages, 'span', ['pagination-page', 'active-page'], `${i}`);
      } else {
        BaseComponent.renderElem(this.paginationPages, 'span', ['pagination-page'], `${i}`);
      }
    }
  }

  private changeControlsState() {
    this.activePage <= 1 ? this.prevControl.classList.add('disabled') : this.prevControl.classList.remove('disabled');
    this.activePage === this.totalPages
      ? this.nextControl.classList.add('disabled')
      : this.nextControl.classList.remove('disabled');
    console.log(this.activePage, this.totalPages);
  }

  private changeActivePage() {
    const pages = this.paginationPages.childNodes;
    pages.forEach((page) => (page as HTMLElement).classList.remove('active-page'));
    const targetPage = pages[this.activePage - 1] as HTMLElement;
    targetPage.classList.add('active-page');

    this.emitter.emit('setPaginationOffset', this.activePage);
    this.changeControlsState();
  }

  private onChangePage() {
    this.paginationContainer.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('pagination-page') && !target.classList.contains('active-page')) {
        this.activePage = Number(target.textContent);
        this.changeActivePage();
      }
      if (target.classList.contains('control-prev') && this.activePage > 1) {
        this.activePage -= 1;
        this.changeActivePage();
      }
      if (target.classList.contains('control-next') && this.activePage !== this.totalPages) {
        this.activePage += 1;
        this.changeActivePage();
      }
    });
  }
}

export default PaginationComponent;

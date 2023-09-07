import noUiSlider from 'nouislider';
import { ProductProjection } from '@commercetools/platform-sdk';
import BaseComponent from '../../shared/view/base-component';
import CustomInput from '../../shared/view/custom-input';
import CatalogController from './catalog-controller';
import findMinMaxPrices from '../../shared/util/find-min-max-prices';
import 'nouislider/dist/nouislider.css';
import EventEmitter from '../../shared/util/emitter';

class PriceRangeComponent extends BaseComponent {
  private minPriceInput!: HTMLInputElement;
  private maxPriceInput!: HTMLInputElement;

  constructor(
    private eventEmitter: EventEmitter,
    private catalogController: CatalogController,
    private items: ProductProjection[]
  ) {
    super(eventEmitter);
  }

  public render(parent: HTMLElement) {
    const priceWrapper = BaseComponent.renderElem(parent, 'div', ['price_wrapper']);
    const slider = document.createElement('div');
    slider.id = 'price-slider';
    const priceInfoWrapper = BaseComponent.renderElem(priceWrapper, 'div', ['price-info_wrapper']);
    priceWrapper.appendChild(slider);

    this.minPriceInput = new CustomInput().render(priceInfoWrapper, 'min-price', 'number', 'Min', false);
    this.maxPriceInput = new CustomInput().render(priceInfoWrapper, 'max-price', 'number', 'Max', false);

    const prices = findMinMaxPrices(this.items);

    this.minPriceInput.value = prices.min.toString();
    this.maxPriceInput.value = prices.max.toString();

    const sliderOptions = {
      start: [this.minPriceInput.value, this.maxPriceInput.value],
      connect: true,
      step: 1,
      range: {
        min: prices.min,
        max: prices.max,
      },
    };

    const sliderInstance = noUiSlider.create(slider, sliderOptions);

    sliderInstance.on('change', (values, handle) => {
      const value = Number(values[handle]);
      if (handle === 0) {
        this.minPriceInput.value = value.toFixed(0);
      } else {
        this.maxPriceInput.value = value.toFixed(0);
      }
      this.catalogController.setPriceRange({ min: +this.minPriceInput.value, max: +this.maxPriceInput.value });
    });

    this.catalogController.setPriceRange({ min: +this.minPriceInput.value, max: +this.maxPriceInput.value });
  }
}

export default PriceRangeComponent;

import noUiSlider, { API, Options } from 'nouislider';
import BaseComponent from '../../shared/view/base-component';
import CustomInput from '../../shared/view/custom-input';
import CatalogController from './catalog-controller';
import 'nouislider/dist/nouislider.css';
import EventEmitter from '../../shared/util/emitter';
import PriceRange from '../../shared/types/price-range-type';

class PriceRangeComponent extends BaseComponent {
  private minPriceInput!: HTMLInputElement;
  private maxPriceInput!: HTMLInputElement;
  private sliderInstance!: API;
  private defaultSliderOptions!: Options;

  constructor(
    private eventEmitter: EventEmitter,
    private catalogController: CatalogController,
    private defaultPriceRange: PriceRange
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

    this.minPriceInput.value = this.defaultPriceRange.min.toString();
    this.maxPriceInput.value = this.defaultPriceRange.max.toString();

    this.defaultSliderOptions = {
      start: [this.minPriceInput.value, this.maxPriceInput.value],
      connect: true,
      step: 1,
      range: {
        min: this.defaultPriceRange.min,
        max: this.defaultPriceRange.max,
      },
    };

    this.sliderInstance = noUiSlider.create(slider, this.defaultSliderOptions);

    this.sliderInstance.on('change', (values, handle) => {
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

  public resetSlider() {
    this.minPriceInput.value = this.defaultPriceRange.min.toString();
    this.maxPriceInput.value = this.defaultPriceRange.max.toString();

    this.sliderInstance.updateOptions(this.defaultSliderOptions, true);
  }
}

export default PriceRangeComponent;

import BaseComponent from './base-component';

class CustomSelect {
  private container!: HTMLElement;
  private label!: HTMLLabelElement;
  private select!: HTMLSelectElement;
  private onChangeCallback: ((selectedValue: string) => void) | null = null;

  public render(parent: HTMLElement, id: string, labelText: string, selectOptions: string[]): HTMLSelectElement {
    this.container = BaseComponent.renderElem(parent, 'div', ['select-container']);
    this.label = BaseComponent.renderElem(
      this.container,
      'label',
      ['select-container__label'],
      labelText
    ) as HTMLLabelElement;

    this.label.htmlFor = id;
    this.select = BaseComponent.renderElem(this.container, 'select', ['select-container__select']) as HTMLSelectElement;

    selectOptions.forEach((option) => BaseComponent.renderElem(this.select, 'option', ['country-option'], option));

    this.onChangeSelect();

    return this.select;
  }

  public setOnChangeCallback(callback: (selectedValue: string) => void) {
    this.onChangeCallback = callback;
  }

  private onChangeSelect() {
    this.select.addEventListener('change', () => {
      if (this.onChangeCallback) {
        this.onChangeCallback(this.select.value);
      }
    });
  }
}

export default CustomSelect;

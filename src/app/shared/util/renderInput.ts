import BaseComponent from '../view/base-component';

export function renderInput(form: HTMLElement, id: string, type: string, labelText: string): HTMLInputElement {
  const inputContainer = BaseComponent.renderElem(form, 'div', ['input-container']);
  const label = BaseComponent.renderElem(inputContainer, 'label', ['input-container__label'], labelText);
  if (label instanceof HTMLLabelElement) label.htmlFor = id;
  const input = BaseComponent.renderElem(
    inputContainer,
    'input',
    ['input-container__input'],
    null,
    type
  ) as HTMLInputElement;
  return input;
}

export function renderSelect(form: HTMLElement, id: string, labelText: string): HTMLSelectElement {
  const inputContainer = BaseComponent.renderElem(form, 'div', ['input-container']);
  const label = BaseComponent.renderElem(inputContainer, 'label', ['input-container__label'], labelText);
  if (label instanceof HTMLLabelElement) label.htmlFor = id;
  const select = BaseComponent.renderElem(inputContainer, 'select', ['input-container__input']) as HTMLSelectElement;
  return select;
}

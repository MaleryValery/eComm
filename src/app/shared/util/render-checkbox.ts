import BaseComponent from '../view/base-component';

function renderCheckbox(form: HTMLElement, id: string | null, type: string, labelText: string): HTMLInputElement {
  const inputContainer = BaseComponent.renderElem(form, 'div', ['input-checkbox-container']);
  const label = BaseComponent.renderElem(inputContainer, 'label', ['input-container__label'], labelText);
  const input = BaseComponent.renderElem(
    inputContainer,
    'input',
    ['input-container__input'],
    null,
    type
  ) as HTMLInputElement;
  if (id) {
    if (label instanceof HTMLLabelElement) label.htmlFor = id;
    input.id = id;
  }
  return input;
}

export default renderCheckbox;

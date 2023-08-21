import BaseComponent from '../view/base-component';

function renderInput(form: HTMLElement, id: string, type: string, labelText: string): HTMLInputElement {
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
  input.id = id;
  return input;
}

export default renderInput;

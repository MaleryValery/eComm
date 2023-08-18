import BaseComponent from '../view/base-component';

function renderSelect(form: HTMLElement, id: string, labelText: string): HTMLSelectElement {
  const inputContainer = BaseComponent.renderElem(form, 'div', ['input-container']);
  const label = BaseComponent.renderElem(inputContainer, 'label', ['input-container__label'], labelText);
  if (label instanceof HTMLLabelElement) label.htmlFor = id;
  const select = BaseComponent.renderElem(inputContainer, 'select', ['input-container__input']) as HTMLSelectElement;
  return select;
}
export default renderSelect;

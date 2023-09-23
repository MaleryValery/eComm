import BaseComponent from '../view/base-component';

function renderSelect(form: HTMLElement, id: string | null, labelText: string): HTMLSelectElement {
  const inputContainer = BaseComponent.renderElem(form, 'div', ['input-container']);
  const label = BaseComponent.renderElem(
    inputContainer,
    'label',
    ['input-container__label'],
    labelText
  ) as HTMLLabelElement;
  const select = BaseComponent.renderElem(inputContainer, 'select', ['input-container__input']) as HTMLSelectElement;

  if (id) {
    label.htmlFor = id;
    select.id = id;
  }

  return select;
}
export default renderSelect;

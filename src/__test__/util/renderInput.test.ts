import renderInput from '../../app/shared/util/renderInput';

describe('Test renderInput function', () => {
  const form = document.createElement('form');

  beforeEach(() => {
    form.innerHTML = '';
  });

  test('should return correct input', () => {
    const input1 = renderInput(form, '1', 'text', 'first');
    const input2 = renderInput(form, '2', 'password', 'second');

    expect(input1 instanceof HTMLInputElement).toBe(true);
    expect(input2 instanceof HTMLInputElement).toBe(true);

    expect(input1.getAttribute('id')).toBe('1');
    expect(input2.getAttribute('id')).toBe('2');

    expect(input1.getAttribute('type')).toBe('text');
    expect(input2.getAttribute('type')).toBe('password');
  });

  test('form should contain correct elements', () => {
    const input1 = renderInput(form, '1', 'text', 'first');
    const inputContainer = form.firstChild as HTMLElement;
    const label = inputContainer.firstChild as HTMLElement;
    const input = inputContainer.children[1] as HTMLElement;

    expect(inputContainer.classList.contains('input-container')).toBe(true);
    expect(label instanceof HTMLLabelElement).toBe(true);
    expect(label.textContent).toBe('first');
    expect(label.classList.contains('input-container__label')).toBe(true);

    expect(input instanceof HTMLInputElement).toBe(true);
    expect(input === input1).toBe(true);
  });
});

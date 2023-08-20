/* eslint-disable @typescript-eslint/dot-notation */
import ModalAuthorizComponent from '../../app/header-component/modal-authorization/modal-auth-component';
import EventEmitter from '../../app/shared/util/emitter';

describe('test ModalAuthorizComponent', () => {
  let modal: ModalAuthorizComponent;
  const parent = document.createElement('div');
  const emitter = new EventEmitter();

  beforeEach(() => {
    modal = new ModalAuthorizComponent(emitter);
    parent.innerHTML = '';
  });

  describe('test render method', () => {
    test('should contain correct container classname', () => {
      modal.render(parent);
      const container = parent.firstChild as HTMLElement;
      expect(container instanceof HTMLElement).toBe(true);
      expect(container.classList.contains('login__menu'));
    });
  });

  describe('test toggle modal method', () => {
    test('should toggle modal visibility correctly', () => {
      modal.show = jest.fn();
      modal.hide = jest.fn();

      modal.toggleModal();
      expect(modal.show).toHaveBeenCalled();

      modal['isShown'] = true;
      modal.toggleModal();
      expect(modal.hide).toHaveBeenCalled();
    });
  });
});

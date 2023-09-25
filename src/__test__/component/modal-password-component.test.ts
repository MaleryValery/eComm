/* eslint-disable @typescript-eslint/dot-notation */
import fetchMock from 'jest-fetch-mock';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { Customer } from '@commercetools/platform-sdk';
import ModalPasswordComponent from '../../app/pages/profile-page/modal-password/modal-password-component';
import EventEmitter from '../../app/shared/util/emitter';
import AuthService from '../../app/services/auth-service';

describe('test ModalPasswordComponent', () => {
  const emitter = new EventEmitter();
  const main = document.createElement('main');
  let modal: ModalPasswordComponent;

  beforeEach(() => {
    modal = new ModalPasswordComponent(emitter);
    main.innerHTML = '';
    fetchMock.resetMocks();
  });

  describe('test render method', () => {
    test('should set correct container in parent and set isRendered flag to true', () => {
      modal.render(main);
      const container = main.firstChild as HTMLElement;

      expect(container.classList.contains('modal-password')).toBe(true);
      expect(modal.isRendered).toBe(true);
    });

    test('should set 3 password inputs and 2 buttons', () => {
      modal.render(main);

      const passwordInputs = main.querySelectorAll('input');
      const buttons = main.querySelectorAll('button');

      expect(passwordInputs.length).toBe(3);
      expect(buttons.length).toBe(2);
    });
  });

  describe('test submitPassword method', () => {
    beforeEach(() => {
      AuthService.checkRefreshtToken = jest.fn();
      AuthService.createApiRootPassword = jest.fn();
      AuthService.user = { email: 'email', password: 'password' } as Customer;

      const execute = jest.fn().mockImplementation(() => ({ body: AuthService.user }));
      const post = jest.fn().mockImplementation(() => ({ execute }));
      const password = jest.fn().mockImplementation(() => ({ post }));
      const login = jest.fn().mockImplementation(() => ({ post }));
      const get = jest.fn().mockImplementation(() => ({ execute }));
      const me = jest.fn().mockImplementation(() => ({ password, login, get }));

      AuthService.apiRoot = ({ me } as unknown) as ByProjectKeyRequestBuilder;
      AuthService.apiRoot = ({ me } as unknown) as ByProjectKeyRequestBuilder;
    });

    test('should call isValid method on every input', () => {
      modal['oldPasswordInp'].isValid = jest.fn().mockImplementation(() => true);
      modal['newPasswordInp'].isValid = jest.fn().mockImplementation(() => true);
      modal['retypePasswordInp'].isValid = jest.fn().mockImplementation(() => true);

      modal.render(main);
      modal['submitPassword']();

      expect(modal['oldPasswordInp'].isValid).toHaveBeenCalled();
      expect(modal['newPasswordInp'].isValid).toHaveBeenCalled();
      expect(modal['retypePasswordInp'].isValid).toHaveBeenCalled();
    });

    test('should call hide method if inputs are valid', () => {
      modal['oldPasswordInp'].isValid = jest.fn().mockImplementation(() => true);
      modal['newPasswordInp'].isValid = jest.fn().mockImplementation(() => true);
      modal['retypePasswordInp'].isValid = jest.fn().mockImplementation(() => true);
      modal['hide'] = jest.fn();

      modal.render(main);
      modal['submitPassword']();

      expect(modal['hide']).toHaveBeenCalled();
    });

    test('should call showError method on every input if at least 1 input is not valid', () => {
      modal['oldPasswordInp'].isValid = jest.fn().mockImplementation(() => true);
      modal['newPasswordInp'].isValid = jest.fn().mockImplementation(() => true);
      modal['retypePasswordInp'].isValid = jest.fn().mockImplementation(() => false);
      modal['oldPasswordInp'].showError = jest.fn();
      modal['newPasswordInp'].showError = jest.fn();
      modal['retypePasswordInp'].showError = jest.fn();

      modal.render(main);
      modal['submitPassword']();

      expect(modal['oldPasswordInp'].showError).toHaveBeenCalled();
      expect(modal['newPasswordInp'].showError).toHaveBeenCalled();
      expect(modal['retypePasswordInp'].showError).toHaveBeenCalled();
    });
  });

  describe('test show and hide methods', () => {
    test('show method should set hidden overflow to body', () => {
      modal.render(main);
      modal.show();

      expect(document.body.classList.contains('no-scroll')).toBe(true);
    });

    test('hide method should clean inputs fields and call hideError method', () => {
      modal['oldPasswordInp'].hideError = jest.fn();
      modal['newPasswordInp'].hideError = jest.fn();
      modal['retypePasswordInp'].hideError = jest.fn();

      modal.render(main);
      modal.show();

      modal['oldPasswordInp'].value = 'a';
      modal['newPasswordInp'].value = 'a';
      modal['retypePasswordInp'].value = 'a';

      modal.hide();

      expect(modal['oldPasswordInp'].hideError).toHaveBeenCalled();
      expect(modal['newPasswordInp'].hideError).toHaveBeenCalled();
      expect(modal['retypePasswordInp'].hideError).toHaveBeenCalled();

      expect(modal['oldPasswordInp'].value).toBeFalsy();
      expect(modal['newPasswordInp'].value).toBeFalsy();
      expect(modal['retypePasswordInp'].value).toBeFalsy();
    });
  });
});

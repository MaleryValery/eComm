/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/dot-notation */
import fetchMock from 'jest-fetch-mock';
import ProfileComponent from '../../app/pages/profile-page/profile-component';
import ReadonlyProfileComponent from '../../app/pages/profile-page/readonly-profile/readonly-profile-component';
import WritableProfileComponennot from '../../app/pages/profile-page/writable-profile/writeble-profile-component';
import EventEmitter from '../../app/shared/util/emitter';

describe('test Profile component', () => {
  let profile: ProfileComponent;
  const emitter = new EventEmitter();
  const main = document.createElement('main');

  const profileRead = ({
    render: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    clearProfile: jest.fn(),
  } as unknown) as ReadonlyProfileComponent;
  const profileWrite = ({
    render: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    clearProfile: jest.fn(),
  } as unknown) as WritableProfileComponennot;

  beforeEach(() => {
    main.innerHTML = '';
    profile = new ProfileComponent(emitter, '/profile');
    profile['profileRead'] = profileRead;
    profile['profileWrite'] = profileWrite;
    profile['curProfile'] = profileRead;
    fetchMock.resetMocks();
  });

  describe('test onChangeProfile method', () => {
    beforeEach(() => {
      profile.hide = jest.fn();
      profile.show = jest.fn();
    });

    test('should call show and hide methods', () => {
      profile['onChangeProfile']('toProfileWrite');

      expect(profile.hide).toHaveBeenCalled();
      expect(profile.show).toHaveBeenCalled();
    });

    test('should switch current profile', () => {
      profile['onChangeProfile']('toProfileWrite');
      expect(profile['curProfile']).toBe(profileWrite);

      profile['onChangeProfile']('toProfileRead');
      expect(profile['curProfile']).toBe(profileRead);
    });
  });

  describe('test show and hide methods', () => {
    test('show method should call render method of current profile if it"s not rendered', () => {
      profile.show();
      expect(profileRead.render).toHaveBeenCalled();

      profile['onChangeProfile']('toProfileWrite');
      expect(profileWrite.render).toHaveBeenCalled();
    });

    test('show method should call show method of current profile', () => {
      profile.show();
      expect(profileRead.show).toHaveBeenCalled();

      profile['onChangeProfile']('toProfileWrite');
      expect(profileWrite.show).toHaveBeenCalled();
    });

    test('hide method should call hide method of current profile', () => {
      profile.hide();
      expect(profileRead.hide).toHaveBeenCalled();

      profile['onChangeProfile']('toProfileWrite');

      profile.hide();
      expect(profileWrite.hide).toHaveBeenCalled();
    });
  });

  describe('test subscribeEvents method', () => {
    beforeEach(() => {
      profile.render(main);

      profile['onChangeProfile'] = jest.fn();
      profile['hide'] = jest.fn();
    });

    test('should change profile after changeProfile event', () => {
      emitter.emit('changeProfile', 'toProfileWrite');

      expect(profile['onChangeProfile']).toHaveBeenCalledWith('toProfileWrite');
    });

    test('should hide, clearProfile and change profile to profileRead after hashchange event', () => {
      profile['curProfile'] = profileWrite;
      emitter.emit('hashchange', '#/login');

      expect(profile.hide).toHaveBeenCalled();
      expect(profileWrite.clearProfile).toHaveBeenCalled();
      expect(profile['curProfile']).toBe(profileRead);
    });

    test('should do nothing if path is #/profile', () => {
      profile['curProfile'] = profileWrite;
      emitter.emit('hashchange', '#/profile');

      expect(profile['curProfile']).toBe(profileWrite);
    });

    test('should clear profiles and set to profileRead after updateProfile', () => {
      profile['curProfile'] = profileWrite;
      profile['show'] = jest.fn();

      emitter.emit('updateProfile', null);

      expect(profile['hide']).toHaveBeenCalled();
      expect(profileRead.clearProfile).toHaveBeenCalled();
      expect(profileWrite.clearProfile).toHaveBeenCalled();
      expect(profile['curProfile']).toBe(profileRead);
      expect(profile['show']).toHaveBeenCalled();
    });
  });
});

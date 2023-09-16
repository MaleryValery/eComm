import Loader from '../../app/shared/view/loader/loader';

describe('test Loader', () => {
  let loader!: Loader;
  const main = document.createElement('main');

  beforeEach(() => {
    main.innerHTML = '';
    main.style.position = 'static';
    loader = new Loader();
  });

  describe('test show and hide methods', () => {
    test('should add loader to parent elem passed into init method', () => {
      loader.init(main, ['some__class']);
      loader.show();

      const loaderWrapper = main.firstChild as HTMLElement;
      const loaderSpin = loaderWrapper.firstChild as HTMLElement;

      expect(loaderWrapper instanceof HTMLElement).toBe(true);
      expect(loaderSpin instanceof HTMLElement).toBe(true);

      expect(loaderWrapper.classList.contains('loader')).toBe(true);
      expect(loaderWrapper.classList.contains('some__class')).toBe(true);
      expect(loaderSpin.classList.contains('loader__spin')).toBe(true);
    });

    test('should remove loader from parent after remove method', () => {
      loader.init(main);
      loader.show();
      loader.hide();

      expect(main.firstChild instanceof HTMLElement).not.toBe(true);
    });

    test('should change position style', () => {
      loader.init(main);
      const styles1 = getComputedStyle(main);
      expect(styles1.position).toBe('static');

      loader.show();
      const styles2 = getComputedStyle(main);

      expect(styles2.position).toBe('relative');

      loader.hide();
      const styles3 = getComputedStyle(main);

      expect(styles3.position).toBe('static');
    });
  });
});

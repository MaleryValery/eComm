/* eslint-disable @typescript-eslint/dot-notation */
import '../../app/header-component/header-component.scss';
import HeaderComponent from '../../app/header/header-component';
import EventEmitter from '../../app/shared/util/emitter';

describe('test header component', () => {
  let header: HeaderComponent;
  const emitter = new EventEmitter();
  const { body } = document;

  beforeEach(() => {
    body.innerHTML = '';
    header = new HeaderComponent(emitter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('test render menthod', () => {
    test('should append header into body', () => {
      expect(body.firstChild).toBe(null);
      header.render(body);
      expect(body.firstChild instanceof HTMLElement);
    });

    test('should contain correct links', () => {
      header.render(body);
      const links = body.querySelectorAll('.nav__item');
      const home = links[0].firstChild as HTMLElement;

      expect(home instanceof HTMLAnchorElement).toBe(true);
      expect(home.textContent).toBe('Home');
    });
  });
});

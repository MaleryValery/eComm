import './about-comoponent.scss';
import { DEVELOPERS, aboutIntroduction } from '../../consts/about-descript';
import BaseComponent from '../../shared/view/base-component';
import RouteComponent from '../../shared/view/route-component';
import { IDeveloper } from '../../shared/types/about-dev-type';

export default class AboutComponent extends RouteComponent {
  private wrapper!: HTMLElement;
  private cardWrapper!: HTMLElement;
  private devs = DEVELOPERS;

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.container.classList.add('about-route');
    BaseComponent.renderElem(this.container, 'h2', ['about-route__head', 'text-head-m'], 'About us');

    this.wrapper = BaseComponent.renderElem(this.container, 'div', ['about-route__wrapper']);
    BaseComponent.renderElem(this.wrapper, 'p', ['about-route__introduction'], aboutIntroduction);

    const rsLogo = BaseComponent.renderElem(this.wrapper, 'a', ['about-route__rs-logo']) as HTMLAnchorElement;
    rsLogo.href = 'https://rs.school/index.html';

    this.cardWrapper = BaseComponent.renderElem(this.wrapper, 'div', ['about-route__cards-wrapper']);

    this.devs.forEach((dev) => this.renderBio(this.cardWrapper, dev));
    // this.renderBio(this.cardWrapper, developerOleg);
    // this.renderBio(this.cardWrapper, developerMark);
    // this.renderBio(this.cardWrapper, developerValeria);
  }

  private renderBio(parent: HTMLElement, developer: IDeveloper): void {
    const aboutCard = BaseComponent.renderElem(parent, 'div', ['about-card']);

    const imgContainer = BaseComponent.renderElem(aboutCard, 'div', ['about-card__img-container']);
    const img = BaseComponent.renderElem(imgContainer, 'img', ['about-card__img']) as HTMLImageElement;
    img.alt = 'Developer photo';
    img.src = developer.img;

    BaseComponent.renderElem(aboutCard, 'p', ['about-card__name', 'text-regular-s'], developer.name);
    BaseComponent.renderElem(aboutCard, 'p', ['about-card__descript'], developer.description);

    const role = BaseComponent.renderElem(aboutCard, 'p', ['about-card__role']);
    role.innerHTML = `<span class="about-card__text_bold">Role: </span>${developer.role}`;

    const contributWrapper = BaseComponent.renderElem(aboutCard, 'div', ['about-card__contribution']);
    BaseComponent.renderElem(contributWrapper, 'h4', ['about-card__contribution-head'], 'Contribution:');
    const contributList = BaseComponent.renderElem(contributWrapper, 'ul', ['about-card__contribution-list']);
    developer.contribution.forEach((achieve) => {
      BaseComponent.renderElem(contributList, 'li', ['about-card__contribution-item'], achieve);
    });

    const git = BaseComponent.renderElem(
      aboutCard,
      'a',
      ['about-card__git', 'about-card__text_bold'],
      '> GitHub'
    ) as HTMLAnchorElement;
    git.href = developer.git;
    git.target = '_blank';
  }
}

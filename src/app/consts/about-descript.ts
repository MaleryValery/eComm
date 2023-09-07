import '../../assets/img/devOleg.jpg';
import '../../assets/img/devValeria.jpg';
import '../../assets/img/devMark.jpg';

export interface IDeveloper {
  name: string;
  role: string;
  contribution: string[];
  description: string;
  img: string;
}

const aboutIntroduction =
  'This is our first team learning project and the most we have done during the course. During the writing of the project we got used to working in a team, for efficiency we organized daily calls, during which we discussed current tasks, explained the principle of work of certain utilities, as well as distributed the work. We also used the canban board to track the status of current tasks, if some task slowed down the project we tried to close this task by common efforts. Below are the participants of the project.';

const developerOleg: IDeveloper = {
  name: 'Oleg',
  role: 'Handyman',
  contribution: ['> Unscrupulous Profile page', '> Routing into the Unknown'],
  description: 'Lorem ipsum lalalalalal ghamala shamala bum bam bdish',
  img: './img/devOleg..jpg',
};

const developerValeria: IDeveloper = {
  name: 'Valeria',
  role: 'Api Wizard',
  contribution: ['> eCommerce magic', '> Registration page for coupons', '> The dizzying product page'],
  description: 'Lorem ipsum i potom kak vshuh i nakoldoval kirpich',
  img: './img/devValeria..jpg',
};

const developerMark: IDeveloper = {
  name: 'Mark',
  role: 'Ringleader',
  contribution: ['> Discouraging login page', '> Star Validation', '> Wandering Catalog page'],
  description: 'Lorem ipsum shel potom sel i vse tram-pam tik tok',
  img: './img/devMark..jpg',
};

export { aboutIntroduction, developerOleg, developerMark, developerValeria };

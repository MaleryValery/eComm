import { IDeveloper } from '../shared/types/about-dev-type';

export const aboutIntroduction =
  'This is our first team learning project and the most we have done during the course. During the writing of the project we got used to working in a team, for efficiency we organized daily calls, during which we discussed current tasks, explained the principle of work of certain utilities, as well as distributed the work. We also used the canban board to track the status of current tasks, if some task slowed down the project we tried to close this task by common efforts. Below are the participants of the project.';

export const DEVELOPERS: IDeveloper[] = [
  {
    name: 'Oleg Alkhimov',
    role: 'Handyman',
    contribution: ['> Unscrupulous Profile page', '> Routing into the Unknown', '> Broken tests'],
    description:
      'I was born and live in the Moscow region. I have a specialized secondary education - electrical technician. After several years of work in my specialty, I decided to try something new and chose frontend development. IT attracts me by constant development and possibility to interact with modern technologies at the code level, as well as I want to find a job not connected with physical labor. Before starting at RSschool, I did a couple of months of self-education and then enrolled in stage 0.',
    img: './img/devOleg..jpg',
    git: 'https://github.com/5kazo4nik',
  },
  {
    name: 'Mark Romanov',
    role: 'Ringleader',
    contribution: ['> Outstanding login page', '> Star Validation', '> Wandering Catalog page'],
    description:
      'Hi! I am 21 years old, born and raised in Russia, I moved to Germany at the end of 2022 and met RS School. I had little knowledge of programming and web development in general, so I started my studies from stage 0. Then I continued my learning in further stages and now you can see the result of my and other team members hard work in this web application. <br/> P.s. I plan to continue learning more and shoveling money by repainting the buttons.',
    img: './img/devMark..jpg',
    git: 'https://github.com/HRn9',
  },
  {
    name: 'Valeria Melnikova',
    role: 'Api Wizard',
    contribution: ['> Leaky cart page', '> Registration page for coupons', '> The dizzying product page'],
    description:
      'Hi, may name is Valeria. Last year I moved from Russia to Israel and decided to start new career. My goal is get job as junior front-end developer and grow up to senior front-end developer. My main priorities are openmind, honest and responsibility. I am a good team worker, love to know new and deeply explore the system where I work. I started to study front-end development with Rolling Scopes School in 2022 from stage 0 and now i have fineshed stage 2. My next goal study React in stage 3 and start looking for a job.',
    img: './img/devValeria..jpg',
    git: 'https://github.com/MaleryValery',
  },
];

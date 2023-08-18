import AppComponent from './app/app';
import EventEmitter from './app/shared/util/emitter';
import Router from './app/shared/util/router';

import './assets/icons/basket.svg';
import './main.scss';

const emitter = new EventEmitter();
const router = new Router();
const app = new AppComponent(emitter, router);

app.render();

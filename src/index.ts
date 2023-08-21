import AppComponent from './app/app';
import EventEmitter from './app/shared/util/emitter';
import Router from './app/shared/util/router';

import './app/consts/svg-imports';
import './main.scss';

const emitter = new EventEmitter();
const router = new Router();
const app = new AppComponent(emitter, router);

app.render();

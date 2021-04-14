import { Game } from './game';
import './style.scss';

function init() {
  const bodyEl: HTMLElement = document.getElementsByTagName('body')[0];
  const gameEl: HTMLCanvasElement = document.createElement('canvas');
  gameEl.setAttribute('id', 'game');
  bodyEl.appendChild(gameEl);
  new Game(gameEl).start();
}

init();

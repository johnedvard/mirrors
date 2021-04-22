import './style.scss';
import { Game } from './game';
import { NearConnection } from './nearConnection';

function init() {
  const bodyEl: HTMLElement = document.getElementsByTagName('body')[0];
  const gameEl: HTMLCanvasElement = document.createElement('canvas');
  const levelDescriptionEl = document.createElement('div');
  levelDescriptionEl.setAttribute('id', 'levelDescription');
  gameEl.setAttribute('id', 'game');
  bodyEl.appendChild(levelDescriptionEl);
  bodyEl.appendChild(gameEl);
  const nearConnection = new NearConnection();
  new Game(gameEl, nearConnection);
}

init();

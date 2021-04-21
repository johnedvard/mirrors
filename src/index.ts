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
  new Game(gameEl);
  const nearConnection = new NearConnection();
  nearConnection.initContract().then(async (res) => {
    if (!nearConnection.walletConnection.isSignedIn()) {
      // TODO (johnedvard add Login button)
    } else {
      const scores = await nearConnection.getScores('level4');
      const score = await nearConnection.getScore('level4');
      console.log('scores', scores);
      console.log('score', score);
      nearConnection.setScore('level4', '999', 'asdsdf');
    }
  });
}

init();

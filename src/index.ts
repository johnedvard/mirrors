import './style.scss';
import { Game } from './game';
import { NearConnection } from './nearConnection';

function init() {
  const bodyEl: HTMLElement = document.getElementsByTagName('body')[0];
  const gameEl: HTMLCanvasElement = document.createElement('canvas');
  gameEl.setAttribute('id', 'game');
  bodyEl.appendChild(gameEl);
  new Game(gameEl).start();
  const nearConnection = new NearConnection();
  nearConnection.initContract().then(async (res) => {
    const greet = await (<any>nearConnection.contract).getGreeting({
      accountId: nearConnection.accountId,
    });
  });
}

init();

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
    if (!nearConnection.walletConnection.isSignedIn()) {
      // TODO (johnedvard add Login button)
    } else {
      // get and set new greeting
      // const greet = await (<any>nearConnection.contract).getGreeting({
      //   accountId: nearConnection.accountId,
      // });
      // const newGreeting = await (<any>nearConnection.contract).setGreeting({
      //   message: 'test',
      // });
    }
  });
}

init();

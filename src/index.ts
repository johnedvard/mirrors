import './style.scss';
import { Game } from './game';
import { NearConnection } from './nearConnection';
import { injectMonetizationTag, monetize } from './monetizationUtils';

function init() {
  let totalSupport = 0;
  const bodyEl: HTMLElement = document.getElementsByTagName('body')[0];
  const gameEl: HTMLCanvasElement = document.createElement('canvas');

  const levelDescriptionEl = document.createElement('div');
  const monetizationProgressEl = document.createElement('div');
  levelDescriptionEl.setAttribute('id', 'levelDescription');
  monetizationProgressEl.setAttribute('id', 'monetizationProgress');
  gameEl.setAttribute('id', 'game');
  bodyEl.appendChild(levelDescriptionEl);
  bodyEl.appendChild(gameEl);
  bodyEl.appendChild(monetizationProgressEl);
  injectMonetizationTag();
  const nearConnection = new NearConnection();

  monetize.subscribe((res) => {
    if (res) {
      const detail: { amount: string; assetCode: string; assetScale: number } =
        res.detail;
      totalSupport =
        totalSupport +
        Number.parseInt(detail.amount) / Math.pow(10, detail.assetScale);
      monetizationProgressEl.innerHTML = `Thanks for being a Coil subscriber!<br/>You support me with 
      ${totalSupport.toPrecision(10)} ${detail.assetCode} this session`;
    }
  });
  new Game(gameEl, nearConnection);
}

init();

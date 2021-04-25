import { init, GameLoop, initPointer, initKeys, on, emit } from 'kontra';
import { Crate } from './crate';
import { fadeIn, fadeOut } from './domUtils';
import { Goal } from './goal';
import { IGameObject } from './IGameObject';
import { IWall } from './iWall';
import { loadLevel } from './levelEngine';

import { Mirror } from './mirror';
import { NearConnection } from './nearConnection';
import { Player } from './player';
import { Popup } from './popup';
import { Wall } from './Wall';

function loginout(loginoutEl: HTMLElement, nearConnection: NearConnection) {
  console.log('login or out');
  if (!nearConnection) return;
  if (nearConnection.walletConnection.isSignedIn()) {
    nearConnection.logout();
    loginoutEl.innerHTML = 'Login to NEAR wallet';
  } else {
    nearConnection.login();
    loginoutEl.innerHTML = 'Logout from NEAR wallet';
  }
}

function initLoginLogout(nearConnection: NearConnection) {
  const loginoutEl: HTMLElement = document.getElementById('loginout');
  if (
    nearConnection &&
    nearConnection.walletConnection &&
    nearConnection.walletConnection.isSignedIn()
  ) {
    loginoutEl.innerHTML = 'Logout from NEAR wallet';
  } else {
    loginoutEl.innerHTML = 'Login to NEAR wallet';
  }
  loginoutEl.addEventListener('click', () =>
    loginout(loginoutEl, nearConnection)
  );
}

export class Game {
  private loop: GameLoop;
  gameObjects: IGameObject[] = [];
  currentLevel = 4;
  popup: Popup;
  timeStart: number;
  constructor(
    canvas: HTMLCanvasElement,
    private nearConnection: NearConnection
  ) {
    console.log('new game');
    canvas.width = 400;
    canvas.height = 400;
    init(canvas);
    this.nearConnection.initContract().then((res) => {
      initLoginLogout(this.nearConnection);
    });
    this.popup = new Popup(this.nearConnection);
    this.initGame(`level${this.currentLevel}`);
    initKeys();
    initPointer();
    on('levelcomplete', this.levelComplete);
    on('gamecomplete', this.gameComplete);
  }

  async initGame(level: string) {
    try {
      this.gameObjects = [];
      const level1 = await loadLevel(level);
      level1.goalPos.forEach((g) => {
        this.gameObjects.push(new Goal(g.x, g.y));
      });
      level1.walls.forEach((w: IWall) => {
        this.gameObjects.push(new Wall(w));
      });
      level1.mirrorPos.forEach((m) => {
        this.gameObjects.push(new Mirror(this, m.x, m.y));
      });
      level1.cratePos.forEach((c) => {
        this.gameObjects.push(new Crate(c.x, c.y));
      });
      level1.playerPos.forEach((p) => {
        this.gameObjects.push(new Player(this, p.x, p.y));
      });

      this.loop = GameLoop({
        update: (dt: number) => {
          this.gameObjects.forEach((go) => go.update(dt));
        },
        render: (dt: number) => {
          this.gameObjects.forEach((go) => go.render(dt));
        },
      });

      document.getElementById('levelDescription').innerHTML =
        level1.description;
      this.start();
      this.timeStart = Date.now();
    } catch {
      emit('gamecomplete', {});
    }
  }

  levelComplete = () => {
    this.loop.stop();
    const timeEnd = Date.now();
    const nextLevel = `level${++this.currentLevel}`;
    fadeIn();
    this.popup.openPopup(timeEnd - this.timeStart).then((res) => {
      if (res) {
        fadeOut();
        this.initGame(nextLevel);
      }
    });
  };

  gameComplete = () => {
    document.getElementById('levelDescription').innerHTML =
      'Game complete. Thanks for playing. Reload page to start agian';
    this.gameObjects = [];
  };

  start(): Game {
    this.loop.start(); // start the game
    return this;
  }
}

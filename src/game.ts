import {
  init,
  GameLoop,
  initPointer,
  initKeys,
  on,
  emit,
  keyPressed,
  bindKeys,
  load,
  audioAssets,
} from 'kontra';
import { Crate } from './crate';
import { fadeIn, fadeOut } from './domUtils';
import { rectCollision } from './gameUtils';
import { Goal } from './goal';
import { IGameObject } from './IGameObject';
import { IWall } from './iWall';
import { loadLevel } from './levelEngine';
import {
  closePopup,
  isLevelSelectorOpen,
  openLevelSelector,
} from './levelSelector';

import { Mirror } from './mirror';
import { NearConnection } from './nearConnection';
import { Player } from './player';
import { Popup } from './popup';
import { Spikes } from './spikes';
import { Wall } from './Wall';

function loginout(loginoutEl: HTMLElement, nearConnection: NearConnection) {
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
  currentLevel = 1;
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
    bindKeys(
      'm',
      (e) => {
        if (!this.loop.isStopped && !isLevelSelectorOpen()) {
          this.loop.stop();
          openLevelSelector()
            .then((level: number) => {
              this.currentLevel = level;
              console.log('this.current level', this.currentLevel);
              this.initGame(`level${level}`);
            })
            .catch((err) => {
              this.loop.start();
            });
        } else {
          closePopup();
        }
      },
      'keyup'
    );
    bindKeys(
      'r',
      (e) => {
        this.restartLevel();
      },
      'keyup'
    );

    on('levelcomplete', this.levelComplete);
    on('gamecomplete', this.gameComplete);
    on('playerkill', this.playerKill);

    load('assets/Electric castle.mp3').then(() => {
      audioAssets['assets/Electric castle'].play();
      audioAssets['assets/Electric castle'].loop = true;
    });
    load('assets/walk.wav').then(() => {});
    load('assets/mirror.wav').then(() => {});
    load('assets/goal.wav').then(() => {});
    load('assets/hurt.wav').then(() => {});
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
      level1.spikesPos.forEach((s) => {
        this.gameObjects.push(new Spikes(s.x, s.y));
      });
      level1.playerPos.forEach((p) => {
        this.gameObjects.push(new Player(this, p.x, p.y));
      });

      this.loop = GameLoop({
        update: (dt: number) => {
          this.gameObjects.forEach((go) => {
            // this.gameObjects.forEach((other) => {
            //   if (
            //     go !== other &&
            //     rectCollision(go.mainSprite, other.mainSprite)
            //   ) {
            //     if (go instanceof Spikes && other instanceof Crate)
            //       emit('collision', go, other);
            //   }
            // });
            go.update(dt);
          });
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
    if (audioAssets['assets/goal']) {
      audioAssets['assets/goal'].play();
    }
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

  restartLevel = () => {
    this.loop.stop();
    this.initGame(`level${this.currentLevel}`);
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

  playerKill = () => {
    if (audioAssets['assets/hurt']) {
      audioAssets['assets/hurt'].play();
    }
    this.restartLevel();
  };
}

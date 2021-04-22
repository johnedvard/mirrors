import { init, GameLoop, initPointer, initKeys, on } from 'kontra';
import { Crate } from './crate';
import { fadeIn, fadeOut } from './domUtils';
import { Goal } from './goal';
import { IGameObject } from './iGameObject';
import { IWall } from './iWall';
import { loadLevel } from './levelEngine';

import { Mirror } from './mirror';
import { NearConnection } from './nearConnection';
import { Player } from './player';
import { Popup } from './popup';
import { Wall } from './Wall';

export class Game {
  private loop: GameLoop;
  gameObjects: IGameObject[] = [];
  currentLevel = 1;
  popup: Popup;
  constructor(
    canvas: HTMLCanvasElement,
    private nearConnection: NearConnection
  ) {
    console.log('new game');
    canvas.width = 400;
    canvas.height = 400;
    init(canvas);
    this.popup = new Popup(nearConnection);
    this.initGame(`level${this.currentLevel}`);
    initKeys();
    initPointer();
    on('levelcomplete', this.levelComplete);
  }

  async initGame(level: string) {
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

    document.getElementById('levelDescription').innerHTML = level1.description;
    this.start();
  }

  levelComplete = () => {
    console.log('prompt dialog to save score');
    console.log('load new level');
    this.loop.stop();
    const nextLevel = `level${++this.currentLevel}`;
    fadeIn();
    this.popup.openPopup().then((res) => {
      if (res) {
        fadeOut();
        this.initGame(nextLevel);
      }
    });
  };

  start(): Game {
    this.loop.start(); // start the game
    return this;
  }
}

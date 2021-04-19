import { init, GameLoop } from 'kontra';
import { Block } from './block';
import { IGameObject } from './iGameObject';

import { Mirror } from './mirror';
import { Player } from './player';

export class Game {
  private loop: GameLoop;
  gameObjects: IGameObject[] = [];
  constructor(canvas: HTMLCanvasElement) {
    console.log('new game');
    canvas.width = 400;
    canvas.height = 400;
    init(canvas);
    const player = new Player(this);
    this.gameObjects.push(player);
    this.gameObjects.push(new Mirror(this));
    this.gameObjects.push(new Block());
    this.loop = GameLoop({
      update: (dt: number) => {
        this.gameObjects.forEach((go) => go.update());
      },
      render: (dt: number) => {
        this.gameObjects.forEach((go) => go.render());
      },
    });
  }

  start(): Game {
    this.loop.start(); // start the game
    return this;
  }
}

import { init, GameLoop } from 'kontra';
import { Player } from './player';

export class Game {
  private loop: GameLoop;
  constructor(canvas: HTMLCanvasElement) {
    console.log('new game');
    canvas.width = 400;
    canvas.height = 400;
    init(canvas);
    const player = new Player();

    this.loop = GameLoop({
      update: (dt: number) => {
        player.update();
      },
      render: (dt: number) => {
        player.render();
      },
    });
  }

  start(): Game {
    this.loop.start(); // start the game
    return this;
  }
}

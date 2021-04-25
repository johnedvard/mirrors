import { Sprite } from 'kontra';
import { IGameObject } from './IGameObject';
import { IWall } from './iWall';

export class Wall implements IGameObject {
  mainSprite: Sprite;
  isMovable = false;
  constructor(w: IWall) {
    this.mainSprite = Sprite({
      x: w.x,
      y: w.y,
      width: w.width * w.repeatX, // width and height of the sprite rectangle
      height: w.height * w.repeatY,
      color: '#94216a',
      anchor: { x: 0.5, y: 0.5 },
    });
  }
  render() {
    this.mainSprite.render();
  }
  update() {
    this.mainSprite.update();
  }
}

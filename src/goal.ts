import { Sprite } from 'kontra';
import { IGameObject } from './iGameObject';

export class Goal implements IGameObject {
  mainSprite: Sprite;
  isMovable = false;
  constructor(x: number, y: number) {
    this.mainSprite = Sprite({
      x: x,
      y: y,
      width: 16, // width and height of the sprite rectangle
      height: 16,
      color: '#fefefe',
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

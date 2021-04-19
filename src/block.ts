import { Sprite } from 'kontra';
import { IGameObject } from './iGameObject';

export class Block implements IGameObject {
  mainSprite: Sprite;
  constructor() {
    this.mainSprite = Sprite({
      x: 100,
      y: 20,
      color: '#ae3e8f',
      width: 10, // width and height of the sprite rectangle
      height: 10,
    });
  }

  update() {
    this.mainSprite.update();
  }
  render() {
    this.mainSprite.render();
  }
}

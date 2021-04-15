import { Sprite } from 'kontra';

import { IGameObject } from './iGameObject';

export class Mirror implements IGameObject {
  mainSprite: Sprite;
  constructor() {
    this.mainSprite = new Sprite({
      x: 100,
      y: 100,
      radius: 8,
      width: 16,
      height: 16,
      render: function () {
        this.context.fillStyle = '#ffffff';
        this.context.beginPath();
        this.context.arc(8, 8, this.radius, 0, 2 * Math.PI);
        this.context.fill();
      },
      // x: 40, // starting x,y position of the sprite
      // y: 150,
      // color: '#ffffff', // fill color of the sprite rectangle
      // width: 10, // width and height of the sprite rectangle
      // height: 10,
    });
  }
  render() {
    this.mainSprite.render();
  }
  update() {
    this.mainSprite.update();
  }
}

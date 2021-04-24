import { on, Sprite } from 'kontra';
import { IGameObject } from './iGameObject';
import { Mirror } from './mirror';

export class Crate implements IGameObject {
  mainSprite: Sprite;
  isMovable = true;
  friction = 3;
  constructor(x: number, y: number) {
    let image = new Image();
    image.src = 'assets/crate.png';
    image.onload = () => {
      this.mainSprite.image = image;
    };
    this.mainSprite = Sprite({
      x: x,
      y: y,
      width: 16, // width and height of the sprite rectangle
      height: 16,
      anchor: { x: 0.5, y: 0.5 },
    });
    on('collision', this.onCollision);
  }

  update(dt: number) {
    this.handleFriction(dt);
    this.mainSprite.update();
  }
  render() {
    this.mainSprite.render();
  }

  handleFriction(dt: number) {
    this.mainSprite.dx /= Math.pow(this.friction, dt);
    this.mainSprite.dy /= Math.pow(this.friction, dt);
  }

  onCollision = (go: IGameObject, other: IGameObject) => {
    // TODO push or something when in proximity of something
    if (go instanceof Mirror && other === this) {
      this.mainSprite.dx = 0;
      this.mainSprite.dy = 0;
    }
  };
}

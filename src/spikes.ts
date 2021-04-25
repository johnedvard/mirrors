import { emit, on, Sprite } from 'kontra';
import { IGameObject } from './IGameObject';
import { Player } from './player';

export class Spikes implements IGameObject {
  mainSprite: Sprite;
  isMovable = false;
  constructor(x: number, y: number) {
    let image = new Image();
    image.src = 'assets/spikes.png';
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

  update() {
    this.mainSprite.update();
  }
  render() {
    this.mainSprite.render();
  }

  onCollision = (go: IGameObject, other: IGameObject) => {
    if (go instanceof Player && other === this) {
      emit('playerkill');
    }
  };
}

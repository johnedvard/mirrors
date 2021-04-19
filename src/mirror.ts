import { GameObject, initPointer, Sprite, track, Vector } from 'kontra';
import { Game } from './game';

import { IGameObject } from './iGameObject';

export class Mirror implements IGameObject {
  mainSprite: Sprite;
  closestObject: { go: IGameObject; pos: Vector; dist: number };
  currPos: Vector;
  image = new Image();
  constructor(private game: Game) {
    initPointer();
    this.image.src = './assets/mirrorCrystal.png';
    this.image.onload = () => {
      this.mainSprite.image = this.image;
    };
    this.mainSprite = new Sprite({
      x: 100,
      y: 100,
      radius: 8,
      width: 16,
      height: 16,
      onUp: () => {
        this.mirrorObject(this.closestObject);
      },
    });

    this.currPos = new Vector(
      this.mainSprite.x + this.mainSprite.width / 2,
      this.mainSprite.y + this.mainSprite.height / 2
    );
    track(this.mainSprite);
  }

  render() {
    this.mainSprite.render();
  }

  update() {
    this.getClosestObject();
    this.mainSprite.update();
  }

  getClosestObject() {
    let currClosestObject = null;
    let currClosestDistance = 99999999;

    this.game.gameObjects.forEach((other: IGameObject) => {
      if (other === this) return;
      const otherPos: Vector = new Vector(
        other.mainSprite.x + other.mainSprite.width / 2,
        other.mainSprite.y + other.mainSprite.height / 2
      );
      const otherDist = otherPos.distance(this.currPos);
      if (otherDist < currClosestDistance) {
        currClosestDistance = otherDist;
        currClosestObject = { go: other, pos: otherPos, dist: otherDist };
      }
    });
    if (this.closestObject !== currClosestObject) {
      this.closestObject = currClosestObject;
    }
  }
  mirrorObject(obj: { go: IGameObject; pos: Vector; dist: number }) {
    if (obj) {
      let scale = 1;
      if (obj.dist < 0) {
        scale = -1;
      }
      obj.go.mainSprite.x =
        this.currPos.x +
        (this.currPos.x - obj.pos.x) * scale -
        obj.go.mainSprite.width / 2;
      obj.go.mainSprite.y =
        this.currPos.y +
        (this.currPos.y - obj.pos.y) * scale -
        obj.go.mainSprite.height / 2;
    }
  }
}

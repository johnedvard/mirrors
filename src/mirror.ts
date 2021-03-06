import { audioAssets, bindKeys, emit, Sprite, track, Vector } from 'kontra';
import { Game } from './game';
import { getFuturePos, rectCollision } from './gameUtils';

import { IGameObject } from './IGameObject';
import { Wall } from './Wall';

export class Mirror implements IGameObject {
  mainSprite: Sprite;
  isMovable = true;
  friction = 4;
  closestObject: { go: IGameObject; pos: Vector; dist: number };
  currPos: Vector;
  image = new Image();
  constructor(private game: Game, x: number, y: number) {
    // TODO copy zelda crystal as mirror
    this.image.src = 'assets/mirrorCrystal.png';
    this.image.onload = () => {
      this.mainSprite.image = this.image;
    };
    this.mainSprite = new Sprite({
      x: x,
      y: y,
      radius: 8,
      width: 16,
      height: 16,
      anchor: { x: 0.5, y: 0.5 },
      onUp: () => {
        this.mirrorObject(this.closestObject);
      },
    });
    track(this.mainSprite);
  }

  render() {
    this.mainSprite.render();
  }

  update(dt: number) {
    this.currPos = new Vector(
      this.mainSprite.x + this.mainSprite.width / 2,
      this.mainSprite.y + this.mainSprite.height / 2
    );
    this.handleFriction(dt);
    this.handleKeys();
    this.handleMirrorCollision();
    this.getClosestObject();
    this.mainSprite.update();
  }

  handleFriction(dt: number) {
    this.mainSprite.dx /= Math.pow(this.friction, dt);
    this.mainSprite.dy /= Math.pow(this.friction, dt);
  }

  handleKeys() {
    bindKeys(
      'space',
      () => {
        this.mirrorObject(this.closestObject);
      },
      'keyup'
    );
  }
  handleMirrorCollision() {
    this.game.gameObjects.forEach((other: IGameObject) => {
      if (other.isMovable) {
        const futurePos = getFuturePos(
          other.mainSprite,
          new Vector(other.mainSprite.dx, other.mainSprite.dy)
        );
        if (rectCollision(this.mainSprite, futurePos)) {
          emit('collision', this, other);
        }
      }
    });
  }

  getClosestObject() {
    let currClosestObject = null;
    let currClosestDistance = 99999999;

    this.game.gameObjects.forEach((other: IGameObject) => {
      if (other === this || other instanceof Wall) return;
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
    this.closestObject = currClosestObject;
  }

  mirrorObject(obj: { go: IGameObject; pos: Vector; dist: number }) {
    if (obj) {
      if (audioAssets['assets/mirror']) {
        audioAssets['assets/mirror'].play();
      }
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

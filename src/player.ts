import {
  bindKeys,
  emit,
  GameObject,
  on,
  Sprite,
  SpriteSheet,
  Vector,
} from 'kontra';
import { Game } from './game';
import { getFuturePos, rectCollision } from './gameUtils';

import { IGameObject } from './iGameObject';
import { InputHandler } from './inputHandler';
import { KeyState } from './keyState';
import { Mirror } from './mirror';

export class Player implements IGameObject {
  PLAYER_ID = 'p';
  isMovable = false;
  mainSprite: Sprite;
  player: Sprite;
  keyState: KeyState;
  inputHandler: InputHandler;
  directionKeys: string[] = ['up', 'down', 'left', 'right'];
  speed = 2;
  game: Game;
  constructor(game: Game) {
    let image = new Image();
    image.src = 'assets/heroMove.png';
    image.onload = () => {
      let spriteSheet = SpriteSheet({
        image: image,
        frameWidth: 16,
        frameHeight: 16,
        animations: {
          // create a named animation: walk
          walk: {
            frames: [0, 1, 2], // frames 0 through 9
            frameRate: 4,
          },
        },
      });
      this.player.animations = spriteSheet.animations;
    };
    this.game = game;
    this.inputHandler = new InputHandler();
    this.player = Sprite({
      x: 40, // starting x,y position of the sprite
      y: 150,
      width: 16, // width and height of the sprite rectangle
      height: 16,
      anchor: { x: 0.5, y: 0.5 },
    });

    this.mainSprite = this.player;
    this.handleKeys(this.inputHandler);
    this.inputHandler
      .getKeyState(this.PLAYER_ID)
      .subscribe((keyState) => (this.keyState = keyState));

    on('collision', this.onCollision);
  }

  handleKeys(inputHandler: InputHandler) {
    const releaseKey = (e: KeyboardEvent) => {
      inputHandler.releaseKey(this.PLAYER_ID, e.code);
    };
    const pressKey = (e: KeyboardEvent) => {
      inputHandler.pressKey(this.PLAYER_ID, e.code);
    };
    bindKeys(this.directionKeys, releaseKey, 'keyup');
    bindKeys(this.directionKeys, pressKey, 'keydown');
  }

  update() {
    const moveSpeed = this.getMovementSpeedFromKeyState();
    this.handleCollision(moveSpeed);
    this.handlePlayerAnimation(moveSpeed);
    this.player.update();
  }

  render() {
    this.player.render();
  }

  handleCollision(moveSpeed: Vector) {
    const futurePos = getFuturePos(this.player, moveSpeed);
    const collided: IGameObject[] = this.checkCollisions(futurePos);
    if (!collided.length) {
      this.player.dx = moveSpeed.x;
      this.player.dy = moveSpeed.y;
    } else {
      this.player.dx = 0;
      this.player.dy = 0;
    }

    collided.forEach((coll) => {
      // if (coll && coll.isMovable) {
      //   this.pushOther(coll);
      // }
    });
  }
  pushOther(collided: IGameObject) {
    const oWorld = collided.mainSprite.world;
    const mWorld = this.mainSprite.world;
    const deltaDist = new Vector(
      oWorld.x - mWorld.x,
      oWorld.y - mWorld.y
    ).normalize();
    collided.mainSprite.dx = deltaDist.x * 2;
    collided.mainSprite.dy = deltaDist.y * 2;
  }
  checkCollisions = (futureP: GameObject): IGameObject[] => {
    const collided: IGameObject[] = [];
    this.game.gameObjects.forEach((other) => {
      if (other !== this && rectCollision(futureP, other.mainSprite)) {
        emit('collision', this, other);
        collided.push(other);
        return;
      }
    });
    return collided;
  };

  getMovementSpeedFromKeyState() {
    const direction: Vector = new Vector(0, 0);
    if (this.keyState.ArrowLeft && this.keyState.ArrowLeft.pressed) {
      direction.x = -1;
    }
    if (this.keyState.ArrowRight && this.keyState.ArrowRight.pressed) {
      direction.x = 1;
    }
    if (this.keyState.ArrowUp && this.keyState.ArrowUp.pressed) {
      direction.y = -1;
    }
    if (this.keyState.ArrowDown && this.keyState.ArrowDown.pressed) {
      direction.y = 1;
    }
    return new Vector(direction.x * this.speed, direction.y * this.speed);
  }

  handlePlayerAnimation = (moveSpeed: Vector) => {
    if (moveSpeed.x > 0) {
      this.player.setScale(-1, 1);
    } else if (moveSpeed.x === 0) {
      // nothing.
    } else {
      this.player.setScale(1, 1);
    }
  };

  onCollision = (go: IGameObject, other: IGameObject) => {
    // TODO push or something when in proximity of something
    if (go === this) {
      if (other instanceof Mirror) {
      } else if (other.isMovable) {
        this.pushOther(other);
      }
    }
  };
}

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
import { Goal } from './goal';

import { IGameObject } from './IGameObject';
import { InputHandler } from './inputHandler';
import { KeyState } from './keyState';
import { Mirror } from './mirror';
import { Wall } from './Wall';

export class Player implements IGameObject {
  PLAYER_ID = 'p';
  isMovable = false;
  mainSprite: Sprite;
  player: Sprite;
  keyState: KeyState;
  inputHandler: InputHandler;
  directionKeys: string[] = ['up', 'down', 'left', 'right', 'w', 's', 'a', 'd'];
  speed = 1.5;
  pushForce = 1.5;
  game: Game;
  isLevelComplete = false;
  constructor(game: Game, x: number, y: number) {
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
      x: x,
      y: y,
      width: 16,
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

    let shouldStop = false;
    collided.forEach((c) => {
      if (c instanceof Mirror || c instanceof Wall) {
        shouldStop = true;
      }
    });
    if (shouldStop) {
      this.player.dx = 0;
      this.player.dy = 0;
    } else {
      this.player.dx = moveSpeed.x;
      this.player.dy = moveSpeed.y;
    }
  }
  pushOther(collided: IGameObject) {
    const oWorld = collided.mainSprite.world;
    const mWorld = this.mainSprite.world;
    const deltaDist = new Vector(
      oWorld.x - mWorld.x,
      oWorld.y - mWorld.y
    ).normalize();
    collided.mainSprite.dx = deltaDist.x * this.pushForce;
    collided.mainSprite.dy = deltaDist.y * this.pushForce;
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
    } else if (this.keyState.KeyA && this.keyState.KeyA.pressed) {
      direction.x = -1;
    }
    if (this.keyState.ArrowRight && this.keyState.ArrowRight.pressed) {
      direction.x = 1;
    } else if (this.keyState.KeyD && this.keyState.KeyD.pressed) {
      direction.x = 1;
    }
    if (this.keyState.ArrowUp && this.keyState.ArrowUp.pressed) {
      direction.y = -1;
    } else if (this.keyState.KeyW && this.keyState.KeyW.pressed) {
      direction.y = -1;
    }
    if (this.keyState.ArrowDown && this.keyState.ArrowDown.pressed) {
      direction.y = 1;
    } else if (this.keyState.KeyS && this.keyState.KeyS.pressed) {
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
      if (other instanceof Goal) {
        if (!this.isLevelComplete) {
          emit('levelcomplete', null);
          this.isLevelComplete = true;
        }
      } else if (other.isMovable) {
        this.pushOther(other);
      }
    }
  };
}

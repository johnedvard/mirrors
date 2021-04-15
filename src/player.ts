import {
  bindKeys,
  emit,
  GameObject,
  initKeys,
  on,
  Sprite,
  Vector,
} from 'kontra';
import { Game } from './game';
import { rectCollision } from './gameUtils';

import { IGameObject } from './iGameObject';
import { InputHandler } from './inputHandler';
import { KeyState } from './keyState';
import { Mirror } from './mirror';

export class Player implements IGameObject {
  PLAYER_ID = 'p';
  mainSprite: Sprite;
  player: Sprite;
  keyState: KeyState;
  inputHandler: InputHandler;
  directionKeys: string[] = ['up', 'down', 'left', 'right'];
  speed = 2;
  game: Game;
  constructor(game: Game) {
    this.game = game;
    this.inputHandler = new InputHandler();
    this.player = Sprite({
      x: 40, // starting x,y position of the sprite
      y: 150,
      color: '#000000', // fill color of the sprite rectangle
      width: 10, // width and height of the sprite rectangle
      height: 10,
    });

    this.mainSprite = this.player;
    initKeys();
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
    this.handleStopOnCollision();
    this.player.update();
  }

  render() {
    this.player.render();
  }

  handleStopOnCollision() {
    const moveSpeed = this.getMovementSpeedFromKeyState();
    const futurePos = {
      ...this.player,
      width: this.player.width,
      height: this.player.height,
      x: moveSpeed.x + this.player.x,
      y: moveSpeed.y + this.player.y,
    };
    if (!this.checkCollisions(futurePos)) {
      this.player.dx = moveSpeed.x;
      this.player.dy = moveSpeed.y;
    } else {
      this.player.dx = 0;
      this.player.dy = 0;
    }
  }

  checkCollisions = (futureP: GameObject) => {
    let collided = false;
    this.game.gameObjects.forEach((other) => {
      if (other !== this && rectCollision(futureP, other.mainSprite)) {
        emit('collision', this, other);
        collided = true;
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

  onCollision = (go: IGameObject, other: IGameObject) => {
    // TODO push or something when in proximity of something
    if (go === this) {
      if (other instanceof Mirror) {
        console.log('is mirror');
      }
    }
  };
}

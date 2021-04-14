import { bindKeys, initKeys, Sprite, Vector } from 'kontra';
import { IGameObject } from './IGameObject';
import { InputHandler } from './inputHandler';
import { KeyState } from './keyState';

export class Player implements IGameObject {
  PLAYER_ID = 'p';
  mainSprite: Sprite;
  player: Sprite;
  keyState: KeyState;
  inputHandler: InputHandler;
  directionKeys: string[] = ['up', 'down', 'left', 'right'];
  speed = 2;
  constructor() {
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
    this.setMovementFromKeyState();
    this.player.update();
  }

  render() {
    this.player.render();
  }

  setMovementFromKeyState() {
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
    this.player.dx = direction.x * this.speed;
    this.player.dy = direction.y * this.speed;
  }
}

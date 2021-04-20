import { Sprite } from 'kontra';

export interface IGameObject {
  mainSprite: Sprite;
  isMovable: boolean;
  update(dt?: number): void;
  render(dt?: number): void;
}

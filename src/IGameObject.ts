import { Sprite } from 'kontra';

export interface IGameObject {
  mainSprite: Sprite;
  update(dt?: number): void;
  render(dt?: number): void;
}

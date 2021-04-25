import { IWall } from './iWall';

export interface ILevel {
  description: string;
  playerPos: { x: number; y: number }[];
  mirrorPos: { x: number; y: number }[];
  cratePos: { x: number; y: number }[];
  goalPos: { x: number; y: number }[];
  walls: IWall[];
  spikesPos: { x: number; y: number }[];
}

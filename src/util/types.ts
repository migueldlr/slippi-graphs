import { PlayerInput } from '@slippi/slippi-js/dist/stats/inputs';

export interface Position {
  frameIdx: number;
  positionX: number;
  positionY: number;
}

export type InputsType = Record<number, PlayerInput[]>;

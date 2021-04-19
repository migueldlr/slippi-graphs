import { PlayerInput } from '@slippi/slippi-js/dist/stats/inputs';

export interface Position {
  frameIdx: number;
  positionX: number;
  positionY: number;
}

export type InputsType = Record<number, PlayerInput[]>;

export interface Action {
  id: number;
  state: string;
  notes?: string;
}

export enum Tech {
  MISSED = 'MISSED',
  IN_PLACE = 'IN_PLACE',
  IN = 'IN',
  AWAY = 'AWAY',
  WALL = 'WALL',
}

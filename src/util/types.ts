import {
  FramesType,
  GameStartType,
  MetadataType,
  StatsType,
} from '@slippi/slippi-js';
import { PlayerInput } from '@slippi/slippi-js/dist/stats/inputs';

export interface Position {
  frameIdx: number;
  positionX: number;
  positionY: number;
}

export type PlayerInputWithExtra = PlayerInput & {
  frameIndex: number;
  singleFrameInput: number;
};

export type PlayerID = number;
export type FrameID = number;

export type InputsType = Record<PlayerID, PlayerInputWithExtra[]>;

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

export interface Data {
  frames: FramesType;
  stats: StatsType;
  metadata: MetadataType;
  settings: GameStartType;
  inputs: InputsType;
}

import { GameStartType } from '@slippi/slippi-js';
import React from 'react';
import { STAGE_IDS } from '../util/ids';

interface Props {
  settings: GameStartType;
}

const GameInfo = ({ settings }: Props) => {
  const playerIds = settings.players.map(p => p.port - 1);
  return <div>{STAGE_IDS[settings.stageId]}</div>;
};

export default GameInfo;

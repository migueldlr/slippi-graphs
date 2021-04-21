import { GameStartType } from '@slippi/slippi-js';
import React from 'react';
import { STAGE_IDS } from '../util/ids';

interface Props {
  settings: GameStartType;
}

const GameInfo = ({ settings }: Props) => {
  return <div>{STAGE_IDS[settings.stageId]}</div>;
};

export default GameInfo;

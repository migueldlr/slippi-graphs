import { GameStartType } from '@slippi/slippi-js';
import React from 'react';
import { frameCountToSeconds } from '../util/calc';
import { STAGE_IDS } from '../util/ids';

interface Props {
  settings: GameStartType;
  currentFrames: [number, number];
}

const GameInfo = ({ settings, currentFrames }: Props) => {
  const playerIds = settings.players.map(p => p.port - 1);
  return (
    <div>
      {STAGE_IDS[settings.stageId]}
      {' - '}
      {frameCountToSeconds(currentFrames[1] - currentFrames[0])} (
      {currentFrames[1] - currentFrames[0]} frames)
    </div>
  );
};

export default React.memo(GameInfo);

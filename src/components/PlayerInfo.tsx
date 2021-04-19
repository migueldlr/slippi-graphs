import { FramesType, MetadataType, StatsType } from '@slippi/slippi-js';
import React from 'react';
import { getTechOptions } from '../util/calc';
import { CHARACTER_IDS } from '../util/ids';

interface Props {
  frames: FramesType;
  stats: StatsType;
  metadata: MetadataType;
  playerIndex: number;
  opponentIndex: number;
}

const PlayerInfo = ({
  frames,
  stats,
  metadata,
  playerIndex,
  opponentIndex,
}: Props) => {
  const chars = metadata.players[playerIndex].characters;

  const techs = getTechOptions(frames, playerIndex, opponentIndex);

  return (
    <div>
      <p>{CHARACTER_IDS[Object.keys(chars)[0]]}</p>
      <p>{JSON.stringify(techs)}</p>
    </div>
  );
};

export default React.memo(PlayerInfo);

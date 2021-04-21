import { FramesType, MetadataType, StatsType } from '@slippi/slippi-js';
import React from 'react';
import { countStates, getTechOptions } from '../util/calc';
import { CHARACTER_IDS } from '../util/ids';
import Bar from './Bar';

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
  const states = countStates(frames, playerIndex);

  return (
    <div style={{ width: '300px' }}>
      <p>{CHARACTER_IDS[Object.keys(chars)[0]]}</p>
      <p>{JSON.stringify(techs)}</p>
      <p
        style={{
          wordBreak: 'break-all',
          height: '100px',
          overflow: 'hidden',
        }}
      >
        {JSON.stringify(states)}
      </p>
      <Bar data={states} playerId={playerIndex} />
    </div>
  );
};

export default React.memo(PlayerInfo);

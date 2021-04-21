import { FramesType, MetadataType, StatsType } from '@slippi/slippi-js';
import React from 'react';
import { ACTION_STATES } from '../util/actionStates';
import { countStates, getTechOptions } from '../util/calc';
import { TECH_OPTIONS } from '../util/constants';
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
  const techTooltipText = (d: [number, number]) => {
    return `${TECH_OPTIONS[d[0]]}: ${d[1]}`;
  };

  const states = countStates(frames, playerIndex);
  const stateTooltipText = (d: [number, number]) => {
    const action = ACTION_STATES[d[0]];
    const state =
      action == null
        ? 'Missing State'
        : action.notes.length > 0
        ? action.notes
        : action.state;
    return `${state}: ${d[1]}`;
  };

  return (
    <div style={{ width: '300px' }}>
      <p>{CHARACTER_IDS[Object.keys(chars)[0]]}</p>
      <Bar
        data={states}
        playerId={playerIndex}
        tooltipText={stateTooltipText}
      />
      <Bar
        data={Object.entries(techs).map(x => [+x[0], x[1]])}
        playerId={playerIndex}
        tooltipText={techTooltipText}
      />
    </div>
  );
};

export default React.memo(PlayerInfo);

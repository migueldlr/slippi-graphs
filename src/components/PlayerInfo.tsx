import { FramesType, MetadataType, StatsType } from '@slippi/slippi-js';
import React from 'react';
import { ACTION_STATES } from '../util/actionStates';
import {
  actionIdToString,
  countStates,
  getShieldOptions,
  getTechOptions,
} from '../util/calc';
import { TECH_OPTIONS } from '../util/constants';
import { CHARACTER_IDS } from '../util/ids';
import Bar from './Bar';
import StackedBar from './StackedBar';
import { IndividualData } from './stackedbar-d3';

interface Props {
  frames: FramesType;
  stats: StatsType;
  metadata: MetadataType;
  playerIndex: number;
  opponentIndex: number;
  setFrame: React.Dispatch<React.SetStateAction<number>>;
}

const PlayerInfo = ({
  frames,
  stats,
  metadata,
  playerIndex,
  opponentIndex,
  setFrame,
}: Props) => {
  const chars = metadata.players[playerIndex].characters;

  const techs = getTechOptions(frames, playerIndex, opponentIndex);

  const techTooltipText = (d: IndividualData) => {
    return `${TECH_OPTIONS[d.data]}: ${d.sectionTotal}\n${d.frameIdx}`;
  };

  const shields = getShieldOptions(frames, playerIndex, opponentIndex);
  const shieldTooltipText = (d: IndividualData) => {
    return `${actionIdToString(d.data)}: ${d.sectionTotal}\n${d.frameIdx}`;
  };

  const states = countStates(frames, playerIndex);
  const stateTooltipText = (d: [number, number]) => {
    return `${actionIdToString(d[0])}: ${d[1]}`;
  };

  return (
    <div style={{ width: '300px' }}>
      <Bar
        data={states}
        playerId={playerIndex}
        tooltipText={stateTooltipText}
      />
      <StackedBar
        data={techs}
        playerId={playerIndex}
        tooltipText={techTooltipText}
        setFrame={setFrame}
      />
      <StackedBar
        data={shields}
        playerId={playerIndex}
        tooltipText={shieldTooltipText}
        setFrame={setFrame}
      />
    </div>
  );
};

export default React.memo(PlayerInfo);

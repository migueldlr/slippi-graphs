import { FramesType, MetadataType, StatsType } from '@slippi/slippi-js';
import React from 'react';
import { ACTION_STATES } from '../util/actionStates';
import {
  actionIdToString,
  countConversionStarts,
  countStates,
  getShieldOptions,
  getTechOptions,
} from '../util/calc';
import { TECH_OPTIONS } from '../util/constants';
import { CHARACTER_IDS, MOVE_IDS } from '../util/ids';
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

  const neutralWins = countConversionStarts(
    stats,
    frames,
    playerIndex,
    'neutral-win'
  );
  const neutralTooltipText = (d: IndividualData) => {
    return `${MOVE_IDS[d.data]}: ${d.sectionTotal}\n${d.frameIdx}`;
  };

  const counterAttacks = countConversionStarts(
    stats,
    frames,
    playerIndex,
    'counter-attack'
  );

  const states = countStates(frames, playerIndex);
  const stateTooltipText = (d: [number, number]) => {
    return `${actionIdToString(d[0])}: ${d[1]}`;
  };

  return (
    <div style={{ display: 'flex' }}>
      <Bar
        title="Character states"
        data={states}
        playerId={playerIndex}
        tooltipText={stateTooltipText}
      />
      <div>
        <StackedBar
          title="Tech"
          data={techs}
          playerId={playerIndex}
          tooltipText={techTooltipText}
          setFrame={setFrame}
        />
        <StackedBar
          title="Out-of-shield options"
          data={shields}
          playerId={playerIndex}
          tooltipText={shieldTooltipText}
          setFrame={setFrame}
        />
        <StackedBar
          title="Neutral wins"
          data={neutralWins}
          playerId={playerIndex}
          tooltipText={neutralTooltipText}
          setFrame={setFrame}
        />
        <StackedBar
          title="Counter attacks"
          data={counterAttacks}
          playerId={playerIndex}
          tooltipText={neutralTooltipText}
          setFrame={setFrame}
        />
      </div>
    </div>
  );
};

export default React.memo(PlayerInfo);

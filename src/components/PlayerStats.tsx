import {
  ActionCountsType,
  FramesType,
  MetadataType,
  StatsType,
} from '@slippi/slippi-js';
import React from 'react';
import { ACTION_STATES } from '../util/actionStates';
import {
  actionIdToString,
  countConversionStarts,
  countStates,
  frameCountToGameTime,
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
  frame: number;
  actions: ActionCountsType;
}

const PlayerInfo = ({
  frames,
  stats,
  metadata,
  playerIndex,
  opponentIndex,
  setFrame,
  frame,
  actions,
}: Props) => {
  const techs = getTechOptions(frames, playerIndex, opponentIndex);
  const techTooltipText = (d: IndividualData) => {
    return `${TECH_OPTIONS[d.data]}: ${d.sectionTotal}\n${frameCountToGameTime(
      d.frameIdx
    )}`;
  };

  const shields = getShieldOptions(frames, playerIndex, opponentIndex);
  const shieldTooltipText = (d: IndividualData) => {
    return `${actionIdToString(d.data)}: ${
      d.sectionTotal
    }\n${frameCountToGameTime(d.frameIdx)}`;
  };

  const neutralWins = countConversionStarts(
    stats,
    frames,
    playerIndex,
    'neutral-win'
  );
  const neutralTooltipText = (d: IndividualData) => {
    return `${MOVE_IDS[d.data]}: ${d.sectionTotal}\n${frameCountToGameTime(
      d.frameIdx
    )}`;
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

  const currentConversions =
    frame != null
      ? stats.conversions.find(
          conversion =>
            conversion.startFrame <= frame &&
            frame <= conversion.endFrame &&
            conversion.moves.length > 0 &&
            conversion.moves[0].playerIndex == playerIndex
        )
      : null;

  const throwSum = Object.values(actions.throwCount).reduce(
    (acc, curr) => acc + curr
  );

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: '5px' }}>
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
        {currentConversions != null ? (
          <>
            <div style={{ width: '300px', height: '90px', overflow: 'hidden' }}>
              {currentConversions.openingType === 'neutral-win'
                ? 'Neutral Win'
                : 'Counter'}
              <br />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}
              >
                {currentConversions.moves.map((m, i) => (
                  <span
                    style={{ fontWeight: m.frame < frame ? 'bold' : 'normal' }}
                  >
                    {i !== 0 ? '  >' : ''}
                    {MOVE_IDS[m.moveId]}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ height: '90px' }}></div>
        )}
      </div>
      <p
        style={{
          width: '300px',
          height: '200px',
          fontSize: '12px',
          marginTop: 0,
        }}
      >
        Wavedashes: {actions.wavedashCount}
        <br />
        Wavelands: {actions.wavelandCount}
        <br />
        Air dodges: {actions.airDodgeCount}
        <br />
        Dash dances: {actions.dashDanceCount}
        <br />
        Spotdodges: {actions.spotDodgeCount}
        <br />
        Ledgegrabs: {actions.ledgegrabCount}
        <br />
        Rolls: {actions.rollCount}
        <br />
        L-Cancels: {actions.lCancelCount.success}/
        {actions.lCancelCount.fail + actions.lCancelCount.success}
        <br />
        Grabs: {actions.grabCount.success}/
        {actions.grabCount.fail + actions.grabCount.success}
        <br />
        Throws: {throwSum}
        {throwSum > 0
          ? ` (${Object.entries(actions.throwCount)
              .filter(a => a[1] > 0)
              .map(a => `${a[0]}: ${a[1]}`)
              .join(', ')})`
          : ''}
      </p>
      {/* <Bar
        title="Character states"
        data={states}
        playerId={playerIndex}
        tooltipText={stateTooltipText}
      /> */}
    </div>
  );
};

export default React.memo(PlayerInfo);

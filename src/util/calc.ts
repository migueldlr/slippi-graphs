import { FramesType, MetadataType } from '@slippi/slippi-js';
import { PlayerInput } from '@slippi/slippi-js/dist/stats/inputs';
import { Data, FrameID, InputsType, PlayerID, Tech } from './types';

export const getPositions = (frames: FramesType, playerId = 0) => {
  const positions: {
    frameIdx: number;
    positionX: number;
    positionY: number;
  }[] = [];
  for (let frameIdx in frames) {
    const frame = frames[frameIdx];
    const { positionX, positionY } = frame.players[playerId].pre;
    positions.push({ frameIdx: +frameIdx, positionX, positionY });
  }
  return positions;
};

export const getPercents = (
  frames: FramesType,
  currentFrames: [number, number]
) => {
  const playerIds = Object.entries(frames[currentFrames[0]].players)
    .filter(([k, v]) => v != null)
    .map(([k, v]) => +k);

  const out: Record<number, [number, number][]> = {};

  playerIds.map(id => {
    const playerPercent: [number, number][] = [];
    for (let i = currentFrames[0]; i < currentFrames[1]; i++) {
      const frame = frames[i];
      const { percent } = frame.players[id].pre;
      playerPercent.push([i, percent]);
    }
    out[id] = playerPercent;
  });

  return out;
};

export const getAPM = (data: InputsType, currentFrames: [number, number]) => {
  const out: Record<PlayerID, [FrameID, number][]> = {};
  for (let id in data) {
    const player = data[id];
    out[id] = [];
    let sum = 0;
    for (let i = currentFrames[0]; i < currentFrames[1]; i++) {
      const frame = player[i];
      if (i > currentFrames[0] + 120) {
        sum -= player[i - 120].singleFrameInput;
      }
      sum += frame.singleFrameInput;
      out[id].push([i, sum]);
    }
  }
  return out;
};

export const filterData = (data: Data, currentFrames: [number, number]) => {
  const playerIds = Object.keys(data.metadata.players).map(id => +id);
  const filteredFrames: FramesType = Object.fromEntries(
    Object.entries(data.frames).filter(
      ([frameIdx, frame]) =>
        currentFrames[0] <= +frameIdx && +frameIdx <= currentFrames[1]
    )
  );
  const filteredInputs: InputsType = {};
  playerIds.forEach(id => {
    filteredInputs[id] = data.inputs[id].filter(
      (d, i) => currentFrames[0] <= i && i <= currentFrames[1]
    );
  });

  return {
    ...data,
    frames: filteredFrames,
    inputs: filteredInputs,
  };
};

export const getTechOptions = (
  frames: FramesType,
  playerIndex: number,
  opponentIndex: number
) => {
  const out: Record<Tech, number> = {
    [Tech.IN_PLACE]: 0,
    [Tech.MISSED]: 0,
    [Tech.IN]: 0,
    [Tech.AWAY]: 0,
    [Tech.WALL]: 0,
  };

  for (let frame in frames) {
    const state = frames[frame].players[playerIndex].pre.actionStateId;
    if (+frame - 1 <= 1 || !(+frame - 1 in frames)) {
      continue;
    }

    const prevState = frames[+frame - 1].players[playerIndex].pre.actionStateId;
    if (state === prevState) continue;

    const xVel =
      frames[frame].players[playerIndex].post.selfInducedSpeeds.groundX;

    const xDiff =
      frames[frame].players[opponentIndex].post.positionX -
      frames[frame].players[playerIndex].post.positionX;

    switch (state) {
      case 183:
      case 191:
        // console.log({
        //   playerIndex,
        //   at: frameCountToGameTime(+frame),
        //   type: Tech.MISSED,
        // });
        out[Tech.MISSED] += 1;
        break;
      case 199:
        // console.log({
        //   playerIndex,
        //   at: frameCountToGameTime(+frame),
        //   type: Tech.IN_PLACE,
        // });
        out[Tech.IN_PLACE] += 1;
        break;
      case 200:
      case 201:
        // console.log({
        //   playerIndex,
        //   at: frameCountToGameTime(+frame),
        //   type: xVel < 0 == xDiff < 0 ? Tech.IN : Tech.AWAY,
        // });
        out[xVel < 0 == xDiff < 0 ? Tech.IN : Tech.AWAY] += 1;
        break;
      default:
        break;
    }
  }
  return out;
};

const frameCountToSeconds = (frame: number) => {
  const seconds = Math.floor(frame / 60);
  return `${Math.floor(seconds / 60)}:${(seconds % 60)
    .toString()
    .padStart(2, '0')}`;
};

const frameCountToGameTime = (frame: number) => {
  const seconds = 8 * 60 - frame / 60;
  return `${Math.floor(seconds / 60)}:${(Math.floor(seconds) % 60)
    .toString()
    .padStart(2, '0')}.${Math.floor(
    +(seconds - Math.floor(seconds)).toFixed(2) * 100
  )
    .toString()
    .padEnd(2, '0')}`;
};

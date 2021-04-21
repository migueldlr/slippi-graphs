import { FramesType, MetadataType } from '@slippi/slippi-js';
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
    for (
      let i = Math.max(currentFrames[0] - 120, 0);
      i < currentFrames[1];
      i++
    ) {
      const frame = player[i];
      if (i > currentFrames[0] && i > 120) {
        sum -= player[i - 120].singleFrameInput;
      }
      sum += frame.singleFrameInput;
      if (i >= currentFrames[0]) {
        out[id].push([i, sum]);
      }
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
        out[Tech.MISSED] += 1;
        break;
      case 199:
        out[Tech.IN_PLACE] += 1;
        break;
      case 200:
      case 201:
        out[xVel < 0 == xDiff < 0 ? Tech.IN : Tech.AWAY] += 1;
        break;
      default:
        break;
    }
  }
  return out;
};

export function countStates(
  frames: FramesType,
  playerId: number
): [number, number][] {
  const stateCounts: Record<number, number> = {};
  for (let frameId in frames) {
    const frame = frames[frameId].players[playerId].pre;
    stateCounts[frame.actionStateId] =
      (stateCounts[frame.actionStateId] ?? 0) + 1;
  }
  const out: [number, number][] = Object.entries(stateCounts).map(x => [
    +x[0],
    x[1],
  ]);
  return out.sort((a, b) => b[1] - a[1]);
}

const frameCountToSeconds = (frame: number) => {
  const seconds = Math.floor(frame / 60);
  return `${Math.floor(seconds / 60)}:${(seconds % 60)
    .toString()
    .padStart(2, '0')}`;
};

export const frameCountToGameTime = (frame: number) => {
  const seconds = 8 * 60 - frame / 60;
  return `${Math.floor(seconds / 60)}:${(Math.floor(seconds) % 60)
    .toString()
    .padStart(2, '0')}.${Math.floor(
    +(seconds - Math.floor(seconds)).toFixed(2) * 100
  )
    .toString()
    .padEnd(2, '0')}`;
};

export const distanceBetween = (
  frames: FramesType,
  currentFrames: [number, number]
) => {
  const out: [number, number][] = [];

  let playerIds: number[];
  for (let x in frames) {
    playerIds = Object.keys(frames[x].players).map(x => +x);
    break;
  }

  for (let i = currentFrames[0]; i < currentFrames[1]; i++) {
    const { players } = frames[i];
    const { positionX: p1x, positionY: p1y } = players[playerIds[0]].pre;
    const { positionX: p2x, positionY: p2y } = players[playerIds[1]].pre;

    out.push([+i, Math.hypot(p1x - p2x, p1y - p2y)]);
  }

  console.log(out);

  return out;
};

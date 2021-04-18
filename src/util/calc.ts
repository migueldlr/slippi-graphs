import { FramesType } from '@slippi/slippi-js';
import { PlayerInput } from '@slippi/slippi-js/dist/stats/inputs';

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

export const getPercents = (frames: FramesType, lastFrame: number) => {
  const playerIds = Object.entries(frames[0].players)
    .filter(([k, v]) => v != null)
    .map(([k, v]) => +k);

  const out: Record<number, [number, number][]> = {};

  playerIds.map(id => {
    const playerPercent: [number, number][] = [];
    for (let i = 0; i < lastFrame; i++) {
      const frame = frames[i];
      const { percent } = frame.players[id].pre;
      playerPercent.push([i, percent]);
    }
    out[id] = playerPercent;
  });

  return out;
};

export const getAPM = (data: { [playerId: number]: PlayerInput[] }) => {
  const out: Record<number, [number, number][]> = {};
  for (let id in data) {
    out[id] = data[id].map((d, i) => [
      i,
      d.inputCount - (i < 120 ? 0 : data[id][i - 120].inputCount),
    ]);
  }
  return out;
};

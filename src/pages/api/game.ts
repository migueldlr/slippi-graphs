import fs from 'fs';
import path from 'path';

import {
  default as SlippiGame,
  Frames,
  FramesType,
  GameStartType,
  getSinglesPlayerPermutationsFromSettings,
  InputComputer,
  StatsType,
} from '@slippi/slippi-js';
import { PlayerInput } from '@slippi/slippi-js/dist/stats/inputs';

const getAPM = (
  settings: GameStartType,
  frames: FramesType,
  stats: StatsType
) => {
  const players = getSinglesPlayerPermutationsFromSettings(settings);
  const inputComputer = new InputComputer();
  inputComputer.setPlayerPermutations(players);
  const inputFrames: Record<number, PlayerInput[]> = {};
  players.forEach(id => (inputFrames[id.playerIndex] = []));
  for (let frame in frames) {
    if (+frame < 0 || +frame > stats.lastFrame) continue;
    inputComputer.processFrame(frames[frame], frames);
    const data = [...inputComputer.fetch()].map(x => ({ ...x }));
    data.forEach(datum => {
      inputFrames[datum.playerIndex].push(datum);
    });
  }
  return inputFrames;
};

export default (req, res) => {
  const file = fs.readFileSync(path.resolve('./public', 'games', 'test.slp'));
  const game = new SlippiGame(file);

  res.status(200).json({
    frames: game.getFrames(),
    stats: game.getStats(),
    metadata: game.getMetadata(),
    settings: game.getSettings(),
    inputs: getAPM(game.getSettings(), game.getFrames(), game.getStats()),
  });
};

import fs from 'fs';
import path from 'path';

import {
  SlippiGame,
  Frames,
  FramesType,
  GameStartType,
  InputComputer,
  StatsType,
} from '@slippi/slippi-js';
import { InputsType } from '../../util/types';

const getInputs = (
  settings: GameStartType,
  frames: FramesType,
  stats: StatsType
): InputsType => {
  const players = settings.players;
  const inputComputer = new InputComputer();
  inputComputer.setup(settings);
  const inputFrames: InputsType = {};
  players.forEach(id => (inputFrames[id.playerIndex] = []));
  for (let frame in frames) {
    if (+frame < 0 || +frame > stats.lastFrame) continue;
    inputComputer.processFrame(frames[frame], frames);
    const data = [...inputComputer.fetch()].map(x => ({ ...x }));
    data.forEach(datum => {
      const playerFrames = inputFrames[datum.playerIndex];
      const prevCount =
        playerFrames.length === 0
          ? 0
          : playerFrames[playerFrames.length - 1].inputCount;
      inputFrames[datum.playerIndex].push({
        ...datum,
        frameIndex: +frame,
        singleFrameInput: datum.inputCount - prevCount,
      });
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
    inputs: getInputs(game.getSettings(), game.getFrames(), game.getStats()),
  });
};

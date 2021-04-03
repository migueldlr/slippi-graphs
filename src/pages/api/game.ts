import fs from 'fs';
import path from 'path';

import { default as SlippiGame } from '@slippi/slippi-js';

export default (req, res) => {
  const dir = path.resolve('./public', 'games');

  const file = fs.readFileSync(path.resolve('./public', 'games', 'test.slp'));
  const game = new SlippiGame(file);

  res.status(200).json({
    frames: game.getFrames(),
    stats: game.getStats(),
    metadata: game.getMetadata(),
  });
};

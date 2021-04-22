// dependencies
const AWS = require('aws-sdk');
const util = require('util');
const { SlippiGame, InputComputer } = require('@slippi/slippi-js');

// get reference to S3 client
const s3 = new AWS.S3();

const getInputs = (settings, frames, stats) => {
  const players = settings.players;
  const inputComputer = new InputComputer();
  inputComputer.setup(settings);
  const inputFrames = {};
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

exports.handler = async (event, context, callback) => {
  // Read options from the event parameter.
  console.log(
    'Reading options from event:\n',
    util.inspect(event, { depth: 5 })
  );
  const srcBucket = event.Records[0].s3.bucket.name;
  // Object key may have spaces or unicode non-ASCII characters.
  const srcKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' ')
  );
  const dstBucket = srcBucket + '-parsed';
  const dstKey = srcKey.replace('.slp', '.json');

  // Download the image from the S3 source bucket.

  let gameString;
  try {
    const params = {
      Bucket: srcBucket,
      Key: srcKey,
      ACL: 'public-read',
    };
    gameString = await s3.getObject(params).promise();
    gameString = gameString.Body;
  } catch (error) {
    console.log(error);
    return;
  }

  const game = new SlippiGame(gameString);

  const data = {
    frames: game.getFrames(),
    stats: game.getStats(),
    metadata: game.getMetadata(),
    settings: game.getSettings(),
    inputs: getInputs(game.getSettings(), game.getFrames(), game.getStats()),
  };

  // Upload the thumbnail image to the destination bucket
  try {
    const destparams = {
      Bucket: dstBucket,
      Key: dstKey,
      Body: JSON.stringify(data),
      ContentType: 'application/json',
    };

    const putResult = await s3.putObject(destparams).promise();
  } catch (error) {
    console.log(error);
    return;
  }

  console.log(
    'Successfully resized ' +
      srcBucket +
      '/' +
      srcKey +
      ' and uploaded to ' +
      dstBucket +
      '/' +
      dstKey
  );
};

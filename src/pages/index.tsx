import {
  FramesType,
  GameStartType,
  MetadataType,
  StatsType,
} from '@slippi/slippi-js';
import { useEffect, useMemo, useState } from 'react';

import Brush from '../components/Brush';
import Line from '../components/Line';
import Map from '../components/Map';
import { Data, FlatData, InputsType } from '../util/types';
import LineInputs from '../components/LineInputs';
import InputDisplay from '../components/InputDisplay';
import PlayerInfo from '../components/PlayerInfo';
import {
  filterData,
  frameCountToGameTime,
  getAPM,
  getPercents,
} from '../util/calc';

export default function Home() {
  const [origData, setOrigData] = useState<Data | null>(null);

  const [currentFrames, setCurrentFrames] = useState<[number, number]>([
    0,
    100,
  ]);
  const data = useMemo(
    () => (origData == null ? null : filterData(origData, currentFrames)),
    [origData, currentFrames]
  );

  const [frame, setFrame] = useState<number>();

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/game');
      const data: Data = await response.json();
      setOrigData(data);
      setCurrentFrames([0, data.stats.lastFrame]);
      console.log(data.stats);
      console.log(data.metadata);
      console.log(Object.keys(data.frames).length);
      console.log(data.inputs);
    })();
  }, []);

  const inputs: FlatData | null = useMemo(
    () => (origData == null ? null : getAPM(origData.inputs, currentFrames)),
    [origData, currentFrames]
  );
  const percents: FlatData | null = useMemo(
    () =>
      origData == null ? null : getPercents(origData.frames, currentFrames),
    [origData, currentFrames]
  );

  if (data == null) {
    return (
      <div
        style={{
          display: `flex`,
          flexDirection: `column`,
          alignItems: `center`,
        }}
        className="container"
      >
        Loading frames...
      </div>
    );
  }

  const playerIds = Object.keys(data.metadata.players).map(id => +id);

  return (
    <div
      style={{
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        paddingBottom: 20,
      }}
      className="container"
    >
      <div style={{ display: 'flex' }}>
        <div>
          <PlayerInfo
            frames={data.frames}
            metadata={data.metadata}
            playerIndex={playerIds[0]}
            opponentIndex={playerIds[1]}
            stats={data.stats}
          />
          <InputDisplay
            frame={
              frame == null
                ? null
                : frame in data.frames
                ? data.frames[frame].players[playerIds[0]].pre
                : null
            }
          />
        </div>
        <Map data={origData} currentFrames={currentFrames} frame={frame} />
        <div>
          <PlayerInfo
            frames={data.frames}
            metadata={data.metadata}
            playerIndex={playerIds[1]}
            opponentIndex={playerIds[0]}
            stats={data.stats}
          />
          <InputDisplay
            frame={
              frame == null
                ? null
                : frame in data.frames
                ? data.frames[frame].players[playerIds[1]].pre
                : null
            }
          />
        </div>
      </div>
      <p>
        {frame ?? 'no frame'} -{' '}
        {frame != null ? frameCountToGameTime(frame) : 0} -{' '}
        {JSON.stringify(currentFrames)}
      </p>
      <div
        style={{
          width: `80%`,
        }}
      >
        <Brush
          min={0}
          max={data.stats.lastFrame}
          setValue={e => setCurrentFrames(e)}
          value={currentFrames}
          marks={data.stats.stocks.map(stock => {
            return [stock.endFrame, `Player ${stock.playerIndex} dies`];
          })}
          bands={data.stats.conversions.map(conversion => {
            return [
              [conversion.startFrame, conversion.endFrame],
              conversion.playerIndex,
            ];
          })}
        />
        <Line
          percents={percents}
          frame={frame}
          setFrame={setFrame}
          currentFrames={currentFrames}
        />
        <LineInputs inputs={inputs} frame={frame} setFrame={setFrame} />
      </div>
    </div>
  );
}

export const ususedExport = 'this turns off fast refresh';

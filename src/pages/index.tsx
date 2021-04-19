import {
  FramesType,
  GameStartType,
  MetadataType,
  StatsType,
} from '@slippi/slippi-js';
import { useEffect, useState } from 'react';

import Brush from '../components/Brush';
import Line from '../components/Line';
import Map from '../components/Map';
import { InputsType } from '../util/types';
import LineInputs from '../components/LineInputs';
import InputDisplay from '../components/InputDisplay';

export default function Home() {
  const [data, setData] = useState<null | {
    frames: FramesType;
    stats: StatsType;
    metadata: MetadataType;
    settings: GameStartType;
    inputs: InputsType;
  }>(null);

  const [currentFrames, setCurrentFrames] = useState<[number, number]>([
    0,
    100,
  ]);

  const [frame, setFrame] = useState<number>();

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/game');
      const data = await response.json();
      setData(data);
      console.log(data.stats);
      console.log(data.metadata);
      console.log(Object.keys(data.frames).length);
      console.log(data.inputs);
    })();
  }, []);

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
      }}
      className="container"
    >
      <div style={{ display: 'flex' }}>
        <InputDisplay
          frame={
            frame == null ? null : data.frames[frame].players[playerIds[0]].pre
          }
        />
        <Map data={data} currentFrames={currentFrames} />
        <InputDisplay
          frame={
            frame == null ? null : data.frames[frame].players[playerIds[1]].pre
          }
        />
      </div>
      <br />
      <div
        style={{
          width: `80%`,
        }}
      >
        <Line
          frames={data.frames}
          stats={data.stats}
          frame={frame}
          setFrame={setFrame}
        />
        <LineInputs inputs={data.inputs} frame={frame} setFrame={setFrame} />
        {/* <LineTwo data={data.inputs} /> */}
        <br />
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
      </div>
    </div>
  );
}

export const ususedExport = 'this turns off fast refresh';

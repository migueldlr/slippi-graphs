import {
  FramesType,
  GameStartType,
  MetadataType,
  StatsType,
} from '@slippi/slippi-js';
import { useEffect, useRef, useState } from 'react';

import * as d3 from 'd3';
import Brush from '../components/Brush';
import Line from '../components/Line';
import LineTwo from '../components/LineTwo';
import { PlayerInput } from '@slippi/slippi-js/dist/stats/inputs';
import Map from '../components/Map';

export default function Home() {
  const [data, setData] = useState<null | {
    frames: FramesType;
    stats: StatsType;
    metadata: MetadataType;
    settings: GameStartType;
    inputs: Record<number, PlayerInput[]>;
  }>(null);

  const [currentFrames, setCurrentFrames] = useState<[number, number]>([
    0,
    100,
  ]);

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

  return (
    <div
      style={{
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
      }}
      className="container"
    >
      <Map data={data} currentFrames={currentFrames} />
      <br />
      <div
        style={{
          width: `80%`,
        }}
      >
        <Line frames={data.frames} stats={data.stats} />
        <LineTwo data={data.inputs} />
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

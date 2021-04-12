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

interface Position {
  frameIdx: number;
  positionX: number;
  positionY: number;
}

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
  const updatePlayerDots = useRef(null);
  const playerDeaths = useRef(null);

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

  const updateDots = (positions: Position[], playerId: number) => {
    const center = d3.select('.center');
    const dots = center
      .selectAll(`.dot.p${playerId}`)
      .data(positions, (d: Position) => d.frameIdx);

    const dotsEnter: d3.Selection<
      d3.BaseType,
      Position,
      d3.BaseType,
      unknown
    > = dots.enter().append('circle').attr('class', `dot p${playerId}`);

    dotsEnter
      .merge(dots)
      .attr('r', '4')
      .attr('transform', (d, i) => {
        return `translate(${d.positionX}, ${-d.positionY})`;
      });
  };

  useEffect(() => {
    if (data == null) {
      return;
    }

    const svg = d3.select('svg');
    const center = svg
      .append('g')
      .attr('class', 'center')
      .attr(
        'transform',
        `translate(${+svg.attr('width') / 2}, ${+svg.attr('height') / 2})`
      );

    const playerIds = Object.keys(data.metadata.players).map(id => +id);

    playerIds.forEach(id => {
      updateDots(getPositions(data.frames, id), id);
    });

    // const percents = getPercents(data.frames, data.metadata.lastFrame);
    // getAPM(data.settings, data.frames);
  }, [data]);

  useEffect(() => {
    if (data == null) {
      return;
    }
    const playerIds = Object.keys(data.metadata.players).map(id => +id);

    playerIds.forEach(id => {
      d3.selectAll(`.dot.p${id}`).classed('hidden', (d: Position) => {
        return !(
          currentFrames[0] < d.frameIdx && d.frameIdx < currentFrames[1]
        );
      });
    });
  }, [currentFrames]);

  const getPositions = (frames: FramesType, playerId = 0) => {
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

  const getPercents = (frames: FramesType, lastFrame: number) => {
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

  return (
    <div
      style={{
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
      }}
      className="container"
    >
      {data == null ? (
        'Loading frames...'
      ) : (
        <>
          <svg
            width="500"
            height="500"
            style={{ border: `1px solid black` }}
          ></svg>
          <br />
          <div
            style={{
              width: `80%`,
              // marginLeft: `40px`,
              // marginRight: `40px`,
            }}
          >
            <Line data={getPercents(data.frames, data.stats.lastFrame)} />
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
        </>
      )}
    </div>
  );
}

export const ususedExport = 'this turns off fast refresh';

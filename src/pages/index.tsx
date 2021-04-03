import {
  ConsoleConnection,
  FramesType,
  MetadataType,
  StatsType,
} from '@slippi/slippi-js';
import { useEffect, useRef, useState } from 'react';

import * as d3 from 'd3';
import Brush from '../components/Brush';

export default function Home() {
  const [data, setData] = useState<null | {
    frames: FramesType;
    stats: StatsType;
    metadata: MetadataType;
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
    })();
  }, []);

  const updateDots = (
    positions: {
      frameIdx: number;
      positionX: number;
      positionY: number;
    }[],
    playerId: number
  ) => {
    const center = d3.select('.center');
    const dots = center
      .selectAll(`.dot.p${playerId}`)
      .data(positions, d => d.frameIdx);

    const dotsEnter = dots
      .enter()
      .append('circle')
      .attr('class', `dot p${playerId}`);

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
    console.log(playerIds);

    playerIds.forEach(id => {
      updateDots(getPositions(data.frames, id), id);
    });
  }, [data]);

  useEffect(() => {
    if (data == null) {
      return;
    }
    const playerIds = Object.keys(data.metadata.players).map(id => +id);

    playerIds.forEach(id => {
      d3.selectAll(`.dot.p${id}`).classed('hidden', d => {
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
          {/* <br />
          <input
            type="range"
            id="progress"
            value={currentFrame}
            onChange={e => setCurrentFrame(+e.target.value)}
            min={0}
            max={data.stats.lastFrame}
          ></input> */}
          {/* <Range
            min={0}
            max={data.stats.lastFrame}
            setValue={e => setCurrentFrames(e)}
            value={currentFrames}
          /> */}
          <Brush
            min={0}
            max={data.stats.lastFrame}
            setValue={e => setCurrentFrames(e)}
            value={currentFrames}
          />
        </>
      )}
    </div>
  );
}

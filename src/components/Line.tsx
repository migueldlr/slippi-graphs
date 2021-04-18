import { FramesType, StatsType } from '@slippi/slippi-js';
import React, { memo, useEffect, useRef, useState } from 'react';
import { getPercents } from '../util/calc';
import LineD3 from './line-d3';

interface Props {
  frames: FramesType;
  stats: StatsType;
}

let vis: LineD3;

const Line = ({ frames, stats }: Props) => {
  const ref = useRef(null);
  const [frame, setFrame] = useState<number>();

  useEffect(() => {
    vis = new LineD3(ref.current, getPercents(frames, stats.lastFrame));
  }, []);

  useEffect(() => {
    console.log('updating data??');
    vis.updateData(getPercents(frames, stats.lastFrame));
  }, [frames, stats.lastFrame]);

  useEffect(() => {
    vis.updateFrame(frame);
  }, [frame]);

  return (
    <div
      ref={ref}
      id="scatter"
      style={{
        width: `100%`,
        height: `200px`,
        overflow: `visible`,
      }}
      onMouseMove={e => {
        const newFrame = vis.onMouseMove(e);
        setFrame(newFrame);
      }}
      onMouseLeave={e => {
        setFrame(undefined);
      }}
    >
      <svg>
        <g className="lines" />
        <g className="marker">
          <rect className="marker-line" />
          <g className="dots" />
        </g>
      </svg>
      <div className="tooltip">
        <p className="text"></p>
      </div>
    </div>
  );
};

Line.whyDidYouRender = true;

export default React.memo(Line);

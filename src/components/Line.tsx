import { FramesType, StatsType } from '@slippi/slippi-js';
import React, { memo, useEffect, useRef, useState } from 'react';
import { getPercents } from '../util/calc';
import LineD3 from './line-d3';

interface Props {
  percents: Record<number, [number, number][]>;
  frame: number;
  setFrame: React.Dispatch<React.SetStateAction<number>>;
  currentFrames: [number, number];
}

let vis: LineD3;

const Line = ({ percents, currentFrames, frame, setFrame }: Props) => {
  const ref = useRef(null);

  useEffect(() => {
    vis = new LineD3(ref.current, percents);
  }, []);

  useEffect(() => {
    vis.updateData(percents);
  }, [percents, currentFrames]);

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

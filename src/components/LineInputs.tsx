import { FramesType, StatsType } from '@slippi/slippi-js';
import React, { memo, useEffect, useRef, useState } from 'react';
import { getAPM, getPercents } from '../util/calc';
import { InputsType } from '../util/types';
import LineD3 from './line-d3';

interface Props {
  inputs: Record<number, [number, number][]>;
  frame: number;
  setFrame: React.Dispatch<React.SetStateAction<number>>;
}

let vis: LineD3;

const Line = ({ inputs, frame, setFrame }: Props) => {
  const ref = useRef(null);

  useEffect(() => {
    vis = new LineD3(ref.current, inputs);
  }, []);

  useEffect(() => {
    vis.updateData(inputs);
  }, [inputs]);

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

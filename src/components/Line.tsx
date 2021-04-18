import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import LineD3 from './line-d3';

interface Props {
  data: { [playerId: number]: [number, number][] };
}

let vis: LineD3;
const Line = ({ data }: Props) => {
  const ref = useRef(null);
  const [frame, setFrame] = useState<number>();

  useEffect(() => {
    vis = new LineD3(ref.current, data);
  }, []);

  useEffect(() => {
    vis.update();
  }, [data]);

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

export default Line;

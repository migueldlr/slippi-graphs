import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import LineD3 from './line-d3';

interface Props {
  data: { [playerId: number]: [number, number][] };
}

let vis: LineD3;
const Line = ({ data }: Props) => {
  const ref = useRef(null);

  useEffect(() => {
    vis = new LineD3(ref.current, data);
  }, []);

  useEffect(() => {
    vis.update();
  }, [data]);

  return (
    <div
      ref={ref}
      id="scatter"
      style={{
        width: `100%`,
        height: `200px`,
        overflow: `visible`,
      }}
      onMouseMove={e => vis.onMouseMove(e)}
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

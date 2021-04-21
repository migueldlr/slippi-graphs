import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

interface Props {
  min: number;
  max: number;
  value: number;
}

const BrushOverlay = ({ min, max, value }: Props) => {
  const scale = useRef(
    d3
      .scaleLinear()
      .domain([min, max]) // data space
      .range([0, 100])
  );

  const ref = useRef(null);

  useEffect(() => {
    const marker = d3.select(ref.current);
    if (value == null) {
      marker.style('visibility', 'hidden');
    } else {
      marker
        .style('visibility', 'visible')
        .style('left', `calc(${scale.current(value)}% - 2px)`);
    }
  }, [value]);
  return (
    <div
      style={{
        width: `100%`,
        height: `50px`,
        position: 'relative',
      }}
    >
      <div
        ref={ref}
        className="marker"
        style={{
          zIndex: 10,
          height: 50,
          width: 4,
          backgroundColor: 'black',
          position: 'absolute',
          top: 0,
        }}
      />
    </div>
  );
};

export default BrushOverlay;

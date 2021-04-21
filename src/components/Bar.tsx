import React, { useEffect, useRef } from 'react';
import BarD3 from './bar-d3';

interface Props {
  data: [number, number][];
  playerId: number;
  tooltipText: (d: [number, number]) => string;
}

const Bar = (props: Props) => {
  const ref = useRef(null);
  let vis = useRef<BarD3>(null);

  useEffect(() => {
    vis.current = new BarD3(
      ref.current,
      props.data,
      props.playerId,
      props.tooltipText
    );
  }, []);

  useEffect(() => {
    vis.current.updateData(props.data);
  }, [props.data]);

  return (
    <div
      ref={ref}
      style={{ position: 'relative' }}
      onMouseMove={e => vis.current.onMouseMove(e)}
      onMouseOut={e => vis.current.onMouseOut(e)}
    >
      <svg height="200" width="300">
        <g className="bars"></g>
      </svg>
      <div className="tooltip-text" style={{ position: 'absolute' }}>
        <p></p>
      </div>
    </div>
  );
};

export default React.memo(Bar);

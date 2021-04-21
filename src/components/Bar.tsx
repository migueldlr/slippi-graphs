import React, { useEffect, useRef } from 'react';
import { ACTION_STATES } from '../util/actionStates';
import BarD3 from './bar-d3';

interface Props {
  data: [number, number][];
  playerId: number;
}

const Bar = (props: Props) => {
  const ref = useRef(null);
  let vis = useRef<BarD3>(null);

  useEffect(() => {
    vis.current = new BarD3(
      ref.current,
      props.data,
      props.playerId,
      tooltipText
    );
  }, []);

  useEffect(() => {
    vis.current.updateData(props.data);
  }, [props.data]);

  const tooltipText = (d: [number, number]) => {
    const action = ACTION_STATES[d[0]];
    const state =
      action == null
        ? 'Missing State'
        : action.notes.length > 0
        ? action.notes
        : action.state;
    return `${state}: ${d[1]}`;
  };

  return (
    <div
      ref={ref}
      style={{ position: 'relative' }}
      onMouseMove={e => vis.current.onMouseMove(e)}
      onMouseOut={e => vis.current.onMouseOut(e)}
    >
      <svg height="300" width="300">
        <g className="bars"></g>
      </svg>
      <div className="tooltip-text" style={{ position: 'absolute' }}>
        <p></p>
      </div>
    </div>
  );
};

export default React.memo(Bar);

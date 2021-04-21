import React, { useEffect, useRef } from 'react';
import StackedBarD3, { IndividualData } from './stackedbar-d3';

interface Props {
  data: Record<number, number[]>;
  playerId: number;
  tooltipText: (d: IndividualData) => string;
  setFrame: React.Dispatch<React.SetStateAction<number>>;
  title: string;
}

const StackedBar = (props: Props) => {
  const ref = useRef(null);
  let vis = useRef<StackedBarD3>(null);

  useEffect(() => {
    vis.current = new StackedBarD3(
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
    <div>
      <p className="subtitle">{props.title}</p>
      <div
        ref={ref}
        style={{ position: 'relative' }}
        onMouseMove={e => {
          const newFrame = vis.current.onMouseMove(e);
          props.setFrame(newFrame);
        }}
        onMouseOut={e => {
          vis.current.onMouseOut(e);
          props.setFrame(null);
        }}
      >
        <div
          style={{ height: 20, width: 300, display: 'flex' }}
          className="bars"
        ></div>
        <div className="tooltip-text" style={{ position: 'absolute' }}>
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(StackedBar);

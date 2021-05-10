import React, { useEffect, useRef } from 'react';
import LineD3 from './line-d3';

import { VscArrowBoth } from 'react-icons/vsc';

interface Props {
  data: Record<number, [number, number][]>;
  frame: number;
  setFrame: React.Dispatch<React.SetStateAction<number>>;
  title: string;
  tooltipText: (frame: number, d: [number, number][]) => string;
  toggle?: () => void;
}

const Line = ({ data, frame, setFrame, title, tooltipText, toggle }: Props) => {
  const ref = useRef(null);
  const vis = useRef<LineD3>(null);

  useEffect(() => {
    vis.current = new LineD3(ref.current, data, tooltipText);
  }, []);

  useEffect(() => {
    vis.current.updateData(data);
  }, [data]);

  useEffect(() => {
    vis.current.updateFrame(frame);
  }, [frame]);

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', marginBottom: '5px' }}>
        <p className="subtitle">{title}</p>
        {toggle != null && (
          <VscArrowBoth
            onClick={toggle}
            style={{ marginLeft: '5px', cursor: 'pointer' }}
          />
        )}
      </div>
      <div
        ref={ref}
        id="scatter"
        style={{
          width: `100%`,
          height: `100px`,
          overflow: `visible`,
        }}
        onMouseMove={e => {
          const newFrame = vis.current.onMouseMove(e);
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
          <g className="axis">
            <g className="high">
              <rect />
              <text />
            </g>
            <g className="low">
              <rect />
              <text />
            </g>
          </g>
        </svg>
        <div className="tooltip-text">
          <p></p>
        </div>
      </div>
    </div>
  );
};

Line.whyDidYouRender = true;

export default React.memo(Line);

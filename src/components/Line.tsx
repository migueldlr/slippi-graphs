import React, { useEffect, useRef } from 'react';
import LineD3 from './line-d3';

interface Props {
  data: Record<number, [number, number][]>;
  frame: number;
  setFrame: React.Dispatch<React.SetStateAction<number>>;
  title: string;
  tooltipText: (frame: number, d: [number, number][]) => string;
}

const Line = ({ data, frame, setFrame, title, tooltipText }: Props) => {
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
    <div>
      <p className="subtitle">{title}</p>
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

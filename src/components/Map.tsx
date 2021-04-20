import {
  FramesType,
  StatsType,
  MetadataType,
  GameStartType,
} from '@slippi/slippi-js';
import { PlayerInput } from '@slippi/slippi-js/dist/stats/inputs';
import React, { useEffect, useRef } from 'react';
import MapD3 from './map-d3';

interface Props {
  data: {
    frames: FramesType;
    stats: StatsType;
    metadata: MetadataType;
    settings: GameStartType;
    inputs: Record<number, PlayerInput[]>;
  };
  currentFrames: [number, number];
  frame?: number;
  setFrame: React.Dispatch<React.SetStateAction<number>>;
}

let vis: MapD3;

const Map = ({ data, currentFrames, frame, setFrame }: Props) => {
  const ref = useRef(null);

  useEffect(() => {
    vis = new MapD3(ref.current, data);
  }, []);

  useEffect(() => {
    vis.updateFrames(currentFrames);
  }, [currentFrames]);

  useEffect(() => {
    vis.updateFrame(frame);
  }, [frame]);

  return (
    <div ref={ref}>
      <canvas
        width="500"
        height="500"
        id="real"
        style={{ border: `1px solid black` }}
        onMouseMove={e => {
          const newFrame = vis.mouseMove(e);
          setFrame(newFrame);
        }}
      ></canvas>
      <canvas
        width="500"
        height="500"
        id="fake"
        style={{ display: 'none', border: `1px solid black` }}
      />
    </div>
  );
};

export default React.memo(Map);

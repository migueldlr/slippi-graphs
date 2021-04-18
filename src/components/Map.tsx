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
}

let vis: MapD3;

const Map = ({ data, currentFrames }: Props) => {
  const ref = useRef(null);

  useEffect(() => {
    vis = new MapD3(ref.current, data);
  }, []);

  useEffect(() => {
    vis.updateFrames(currentFrames);
  }, [currentFrames]);

  return (
    <div ref={ref}>
      <svg width="500" height="500" style={{ border: `1px solid black` }}>
        <g className="center"></g>
      </svg>
    </div>
  );
};

export default Map;

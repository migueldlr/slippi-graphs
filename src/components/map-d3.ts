import {
  FramesType,
  StatsType,
  MetadataType,
  GameStartType,
} from '@slippi/slippi-js';
import { PlayerInput } from '@slippi/slippi-js/dist/stats/inputs';
import * as d3 from 'd3';
import { getPositions } from '../util/calc';
import { PlayerID, Position } from '../util/types';

export default class MapD3 {
  containerEl: HTMLDivElement;
  container: d3.Selection<d3.BaseType, unknown, null, undefined>;
  data: {
    frames: FramesType;
    stats: StatsType;
    metadata: MetadataType;
    settings: GameStartType;
    inputs: Record<number, PlayerInput[]>;
  };
  currentFrames: [number, number];
  dots: Record<
    PlayerID,
    d3.Selection<d3.BaseType, Position, d3.BaseType, unknown>
  >;
  constructor(containerEl: HTMLDivElement, data) {
    this.containerEl = containerEl;
    this.container = d3.select(this.containerEl as d3.BaseType);
    this.data = data;
    this.dots = {};

    const svg = this.container
      .select('svg')
      .attr('width', 500)
      .attr('height', 500);

    console.log(svg);
    this.container
      .select('svg')
      .select('.center')
      .attr(
        'transform',
        `translate(${+svg.attr('width') / 2}, ${+svg.attr('height') / 2})`
      );

    this.update();
  }

  updateDots = (positions: Position[], playerId: number) => {
    const center = this.container.select('.center');
    const dots = center
      .selectAll(`.dot.p${playerId}`)
      .data(positions, (d: Position) => d.frameIdx);

    const dotsEnter: d3.Selection<
      d3.BaseType,
      Position,
      d3.BaseType,
      unknown
    > = dots.enter().append('circle').attr('class', `dot p${playerId}`);

    dotsEnter
      .merge(dots)
      .attr('r', '4')
      .attr('transform', (d, i) => {
        return `translate(${d.positionX}, ${-d.positionY})`;
      });
  };

  update() {
    const playerIds = Object.keys(this.data.metadata.players).map(id => +id);

    playerIds.forEach(id => {
      this.updateDots(getPositions(this.data.frames, id), id);
    });
  }

  updateFrames(currentFrames: [number, number]) {
    const playerIds = Object.keys(this.data.metadata.players).map(id => +id);

    playerIds.forEach(id => {
      this.container
        .select('.center')
        .selectAll(`.dot.p${id}`)
        .classed('hidden', (d: Position) => {
          return !(
            currentFrames[0] < d.frameIdx && d.frameIdx < currentFrames[1]
          );
        });
    });
    this.currentFrames = currentFrames;
  }

  updateFrame(frame: number) {
    const playerIds = Object.keys(this.data.metadata.players).map(id => +id);
    if (frame == null) {
      playerIds.forEach(id => {
        this.container
          .select('.center')
          .selectAll(`.dot.p${id}`)
          .classed('highlight', false)
          .classed('antihighlight', false);
      });
      this.updateFrames(this.currentFrames);
      return;
    }

    playerIds.forEach(id => {
      this.container
        .select('.center')
        .selectAll(`.dot.p${id}`)
        .classed('highlight', (d: Position) => frame === d.frameIdx)
        .classed(
          'antihighlight',
          (d: Position) =>
            this.currentFrames[0] < d.frameIdx &&
            d.frameIdx < this.currentFrames[1] &&
            frame !== d.frameIdx
        );
    });
  }
}

import {
  FramesType,
  StatsType,
  MetadataType,
  GameStartType,
} from '@slippi/slippi-js';
import { PlayerInput } from '@slippi/slippi-js/dist/stats/inputs';
import * as d3 from 'd3';
import { getPositions } from '../util/calc';
import { getColor } from '../util/colors';
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
  positions: Record<number, Position[]>;
  ctx: CanvasRenderingContext2D;
  playerIds: number[];
  fakeContainerEl: HTMLElement;
  fakeContainer: d3.Selection<d3.BaseType, unknown, null, undefined>;
  frame: number;

  constructor(containerEl: HTMLDivElement, data) {
    this.fakeContainerEl = document.createElement('custom');
    this.fakeContainer = d3.select(this.fakeContainerEl as d3.BaseType);
    this.containerEl = containerEl;
    this.container = d3.select(this.containerEl as d3.BaseType);
    this.data = data;
    this.dots = {};

    const canvas: HTMLCanvasElement = this.container
      .select('canvas')
      .node() as HTMLCanvasElement;

    this.ctx = canvas.getContext('2d');
    const size = 500;

    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    canvas.width = Math.floor(size * scale);
    canvas.height = Math.floor(size * scale);

    // Normalize coordinate system to use css pixels.
    this.ctx.scale(scale, scale);

    this.playerIds = Object.keys(this.data.metadata.players).map(id => +id);

    this.positions = {};
    this.playerIds.forEach(id => {
      this.positions[id] = getPositions(this.data.frames, id);
    });

    this.update();
  }

  clear() {
    this.ctx.clearRect(
      0,
      0,
      this.containerEl.clientWidth,
      this.containerEl.clientHeight
    );
  }

  // update() {
  //   this.clear();
  //   this.playerIds.forEach(id => {
  //     const positions = this.positions[id];
  //     this.ctx.fillStyle = getColor(id);
  //     positions.forEach(pos => {
  //       this.ctx.beginPath();
  //       //this.ctx.arc(x-center, y-center, radius, startAngle, endAngle, counterclockwise)
  //       //A circle would thus look like:
  //       this.ctx.arc(
  //         pos.positionX + this.containerEl.clientWidth / 2,
  //         -pos.positionY + this.containerEl.clientHeight / 2,
  //         4,
  //         0,
  //         2 * Math.PI
  //       );
  //       this.ctx.fill();
  //     });
  //     this.ctx.closePath();
  //   });
  // }

  updateDots = (positions: Position[], playerId: number) => {
    this.clear();
    const dots = this.fakeContainer
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
      .attr('playerid', playerId)
      .attr('frameIdx', d => d.frameIdx)
      .attr('x', d => d.positionX)
      .attr('y', d => d.positionY);
  };

  update() {
    const playerIds = Object.keys(this.data.metadata.players).map(id => +id);

    playerIds.forEach(id => {
      this.updateDots(this.positions[id], id);
    });
  }

  updateFrames(currentFrames: [number, number]) {
    this.currentFrames = currentFrames;
    this.redraw();
  }

  drawCircle(
    x: number,
    y: number,
    id: number,
    config?: Parameters<typeof getColor>[1]
  ) {
    this.ctx.fillStyle = getColor(id, config);
    this.ctx.beginPath();
    this.ctx.arc(
      x + this.containerEl.clientWidth / 2,
      -y + this.containerEl.clientHeight / 2,
      4,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
    this.ctx.closePath();
  }

  // updateFrames(currentFrames: [number, number]) {
  //   this.clear();
  //   this.currentFrames = currentFrames;
  //   this.playerIds.forEach(id => {
  //     const positions = this.positions[id];
  //     positions.forEach(pos => {
  //       this.ctx.fillStyle = getColor(id);
  //       if (
  //         !(
  //           this.currentFrames[0] < pos.frameIdx &&
  //           pos.frameIdx < this.currentFrames[1]
  //         )
  //       ) {
  //         return;
  //       }
  //       this.ctx.beginPath();
  //       this.ctx.arc(
  //         pos.positionX + this.containerEl.clientWidth / 2,
  //         -pos.positionY + this.containerEl.clientHeight / 2,
  //         4,
  //         0,
  //         2 * Math.PI
  //       );
  //       this.ctx.fill();
  //     });
  //     this.ctx.closePath();
  //   });
  // }

  // updateFrame(frame: number) {
  //   if (frame == null) {
  //   }
  // }

  redraw() {
    this.clear();
    this.fakeContainer.selectAll(`.dot`).each((d, i, nodes) => {
      const node = d3.select(nodes[i]);

      if (
        this.currentFrames[0] < +node.attr('frameIdx') &&
        +node.attr('frameIdx') < this.currentFrames[1]
      ) {
        this.drawCircle(
          +node.attr('x'),
          +node.attr('y'),
          +node.attr('playerid'),
          this.frame == null
            ? {}
            : {
                highlight: +node.attr('frameIdx') === this.frame,
                antihighlight: +node.attr('frameIdx') !== this.frame,
              }
        );
      }
    });
  }

  updateFrame(frame: number) {
    this.frame = frame;
    this.redraw();
  }
}

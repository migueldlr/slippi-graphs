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
  fakeCtx: CanvasRenderingContext2D;
  colors: Set<string>;
  colorToNode: Record<
    string,
    d3.Selection<d3.BaseType, unknown, null, undefined>
  >;
  width: number;
  canvas: HTMLCanvasElement;
  height: number;

  constructor(containerEl: HTMLDivElement, data) {
    this.fakeContainerEl = document.createElement('custom');
    this.fakeContainer = d3.select(this.fakeContainerEl as d3.BaseType);
    this.containerEl = containerEl;
    this.container = d3.select(this.containerEl as d3.BaseType);
    this.data = data;
    this.dots = {};

    this.canvas = this.container
      .select('canvas#real')
      .node() as HTMLCanvasElement;

    const fakeCanvas: HTMLCanvasElement = this.container
      .select('canvas#fake')
      .node() as HTMLCanvasElement;

    this.fakeCtx = fakeCanvas.getContext('2d');
    this.ctx = this.canvas.getContext('2d');

    this.width = +this.canvas.width;
    this.height = +this.canvas.height;
    const scale = window.devicePixelRatio;

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.canvas.width = Math.floor(this.width * scale);
    this.canvas.height = Math.floor(this.height * scale);
    this.ctx.scale(scale, scale);

    fakeCanvas.style.width = `${this.width}px`;
    fakeCanvas.style.height = `${this.height}px`;
    fakeCanvas.width = Math.floor(this.width * scale);
    fakeCanvas.height = Math.floor(this.height * scale);
    this.fakeCtx.scale(scale, scale);

    this.playerIds = Object.keys(this.data.metadata.players).map(id => +id);

    this.positions = {};
    this.playerIds.forEach(id => {
      this.positions[id] = getPositions(this.data.frames, id);
    });

    this.colorToNode = {};
    this.colors = new Set();

    this.update();
  }

  clear(preserveFake: boolean) {
    this.ctx.clearRect(0, 0, this.width, this.width);
    if (!preserveFake) {
      this.fakeCtx.clearRect(0, 0, this.width, this.width);
      this.colors.clear();
      this.colorToNode = {};
    }
  }

  update() {
    this.playerIds.forEach(id => {
      const dots = this.fakeContainer
        .selectAll(`.dot.p${id}`)
        .data(this.positions[id], (d: Position) => d.frameIdx);

      const dotsEnter: d3.Selection<
        d3.BaseType,
        Position,
        d3.BaseType,
        unknown
      > = dots.enter().append('circle').attr('class', `dot p${id}`);

      dotsEnter
        .merge(dots)
        .attr('playerid', id)
        .attr('frameIdx', d => d.frameIdx)
        .attr('x', d => d.positionX)
        .attr('y', d => d.positionY);
    });
  }

  updateFrames(currentFrames: [number, number]) {
    this.currentFrames = currentFrames;
    this.redraw();
  }

  genColor() {
    let color: string;
    do {
      color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    } while (this.colors.has(color));

    this.colors.add(color);
    return color;
  }

  drawCircle(
    node: d3.Selection<d3.BaseType, unknown, null, undefined>,
    fake: boolean
  ) {
    const ctx = fake ? this.fakeCtx : this.ctx;
    if (fake) {
      const color = this.genColor();
      ctx.fillStyle = color;
      this.colorToNode[color] = node;
    } else {
      ctx.fillStyle = getColor(
        +node.attr('playerid'),
        this.frame == null
          ? {}
          : {
              highlight: +node.attr('frameIdx') === this.frame,
              antihighlight: +node.attr('frameIdx') !== this.frame,
            }
      );
    }
    ctx.beginPath();
    ctx.arc(
      +node.attr('x') + this.width / 2,
      -+node.attr('y') + this.height / 2,
      4,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.closePath();
  }

  redraw(preserveFake?: boolean) {
    this.clear(preserveFake);
    this.fakeContainer.selectAll(`.dot`).each((d, i, nodes) => {
      const node = d3.select(nodes[i]);

      if (
        this.currentFrames[0] < +node.attr('frameIdx') &&
        +node.attr('frameIdx') < this.currentFrames[1]
      ) {
        if (!preserveFake) this.drawCircle(node, true);
        this.drawCircle(node, false);
      }
    });
  }

  mouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const x = e.pageX - this.canvas.offsetLeft;
    const y = e.pageY - this.canvas.offsetTop;
    const color = this.fakeCtx.getImageData(
      x * window.devicePixelRatio,
      y * window.devicePixelRatio,
      1,
      1
    ).data;
    const hex =
      '#' +
      ((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2])
        .toString(16)
        .slice(1);

    const node = this.colorToNode[hex];
    if (node != null) {
      return +node.attr('frameIdx');
    }
    return null;
  }

  updateFrame(frame: number) {
    this.frame = frame;
    this.redraw(true);
  }
}

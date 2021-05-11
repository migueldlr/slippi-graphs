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

export default class HeatmapD3 {
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
  colorToNode: Record<string, string>;
  width: number;
  canvas: HTMLCanvasElement;
  height: number;
  selectedPlayer: number;
  idToRgb: Record<number, [number, number, number]>;
  highlightCanvas: HTMLCanvasElement;
  highlightCtx: CanvasRenderingContext2D;

  constructor(
    containerEl: HTMLDivElement,
    data,
    idToRgb: Record<number, [number, number, number]>
  ) {
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

    this.highlightCanvas = this.container
      .select('canvas#highlight')
      .node() as HTMLCanvasElement;

    this.fakeCtx = fakeCanvas.getContext('2d');
    this.ctx = this.canvas.getContext('2d');
    this.highlightCtx = this.highlightCanvas.getContext('2d');

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

    this.highlightCanvas.style.width = `${this.width}px`;
    this.highlightCanvas.style.height = `${this.height}px`;
    this.highlightCanvas.width = Math.floor(this.width * scale);
    this.highlightCanvas.height = Math.floor(this.height * scale);
    this.highlightCtx.scale(scale, scale);

    this.playerIds = Object.keys(this.data.metadata.players).map(id => +id);

    this.positions = {};
    this.playerIds.forEach(id => {
      this.positions[id] = getPositions(this.data.frames, id);
    });

    this.colorToNode = {};
    this.colors = new Set();

    this.updateColors(idToRgb);
  }

  clear(preserveFake: boolean) {
    this.ctx.clearRect(0, 0, this.width, this.width);
    if (!preserveFake) {
      this.fakeCtx.clearRect(0, 0, this.width, this.width);
      this.colors.clear();
      this.colorToNode = {};
    }
  }

  updateFrames(currentFrames: [number, number], selectedPlayer: number) {
    this.currentFrames = currentFrames;
    this.selectedPlayer = selectedPlayer;
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
    playerId: number,
    pos: Position,
    context: 'fake' | 'real' | 'highlight' = 'real'
  ) {
    const ctx =
      context === 'fake'
        ? this.fakeCtx
        : context === 'highlight'
        ? this.highlightCtx
        : this.ctx;

    if (context === 'fake') {
      const color = this.genColor();
      ctx.fillStyle = color;
      this.colorToNode[color] = `${playerId}-${pos.frameIdx}`;
    } else if (context === 'real') {
      const rgb = this.idToRgb[playerId];
      ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${
        this.frame == null ? 0.05 : 0.01
      }`;
    } else {
      const rgb = this.idToRgb[playerId];
      ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
    }

    ctx.fillRect(
      pos.positionX + this.width / 2 - 3,
      -pos.positionY + this.height / 2 - 3,
      6,
      6
    );
  }

  redraw(preserveFake?: boolean) {
    this.clear(preserveFake);

    if (this.currentFrames == null) {
      return;
    }
    for (let i = this.currentFrames[0]; i < this.currentFrames[1]; i++) {
      this.playerIds.forEach(id => {
        if (this.selectedPlayer != null && id != this.selectedPlayer) {
          return;
        }
        const pos = this.positions[id][i];
        if (!preserveFake) this.drawCircle(id, pos, 'fake');
        this.drawCircle(id, pos, 'real');
      });
    }
  }

  highlight(oldFrame: number | null, newFrame: number | null) {
    const ctx = this.highlightCtx;

    if (oldFrame != null) {
      this.playerIds.forEach(id => {
        const pos = this.positions[id][oldFrame];

        ctx.clearRect(
          pos.positionX + this.width / 2 - 5,
          -pos.positionY + this.height / 2 - 5,
          10,
          10
        );
      });
    }

    if (newFrame != null) {
      this.playerIds.forEach(id => {
        const pos = this.positions[id][newFrame];
        const rgb = this.idToRgb[id];
        ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;

        ctx.fillRect(
          pos.positionX + this.width / 2 - 4,
          -pos.positionY + this.height / 2 - 4,
          8,
          8
        );
      });
    }
  }

  mouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const x = e.pageX - this.canvas.getBoundingClientRect().left;
    const y = e.pageY - this.canvas.getBoundingClientRect().top;
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
      return +node.split('-')[1];
    }
    return null;
  }

  updateFrame(frame: number) {
    const oldFrame = this.frame;
    this.frame = frame;

    this.highlight(oldFrame, frame);

    if (oldFrame == null || frame == null) {
      this.redraw(true);
    }
  }

  updateColors(idToRgb: Record<number, [number, number, number]>) {
    this.idToRgb = idToRgb;
    this.redraw(true);
  }
}

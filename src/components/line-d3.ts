import * as d3 from 'd3';

interface Data {
  [playerId: number]: [number, number][];
}

type DataArr = [number, [number, number][]][];

export default class LineD3 {
  containerEl: HTMLDivElement;
  container: d3.Selection<d3.BaseType, unknown, null, undefined>;
  data: Data;
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  xScale: d3.ScaleLinear<number, number, never>;
  yScale: d3.ScaleLinear<number, number, never>;
  playerIds: number[];
  tooltip: d3.Selection<d3.BaseType, unknown, null, undefined>;
  tooltipText: (frame: number, d: [number, number][]) => string;
  unflattenedData: {};

  constructor(containerEl: HTMLDivElement, data: Data, tooltipText) {
    this.containerEl = containerEl;
    this.container = d3.select(this.containerEl as d3.BaseType);
    this.data = data;
    this.playerIds = Object.keys(this.data).map(x => +x);
    this.unflattenData();
    this.tooltipText = tooltipText;
    this.update();
  }

  updateData(data) {
    this.data = data;
    this.unflattenData();
    this.update();
  }

  unflattenData() {
    this.unflattenedData = {};
    this.playerIds.forEach(id => {
      const out = {};
      const player = this.data[id];
      player.forEach(([frame, data]) => {
        out[frame] = data;
      });
      this.unflattenedData[id] = out;
    });
  }

  update() {
    const xDomain = d3.extent(
      d3.merge<number>(
        this.playerIds.map(id => this.data[id].map(frame => frame[0]))
      )
    );
    const yDomain = d3.extent(
      d3.merge<number>(
        this.playerIds.map(id => this.data[id].map(frame => frame[1]))
      )
    );

    const dataArr: DataArr = Object.entries(this.data).map(([k, v]) => [+k, v]);

    const svg = this.container
      .select('svg')
      .style('width', `100%`)
      .style('height', `100%`)
      .style('overflow', `visible`);

    const w = this.containerEl.clientWidth;
    const h = this.containerEl.clientHeight;

    //   console.log({ w, h });

    const margin = { top: 0, bottom: 0, left: 0, right: 0 };

    // dimensions of slider bar
    const width = w - margin.left - margin.right;
    const height = h - margin.top - margin.bottom;

    this.xScale = d3.scaleLinear().domain(xDomain).range([0, width]);
    this.yScale = d3.scaleLinear().domain(yDomain).range([height, 0]);
    const lineInterpolate = d3
      .line()
      .x(d => this.xScale(d[0]))
      .y(d => this.yScale(d[1]));

    // set up lines
    const lines = svg
      .select('.lines')
      .selectAll('.line')
      .data(dataArr, d => d[0]);

    const linesEnter = lines
      .enter()
      .append('path')
      .attr('class', d => `line p${d[0]}`)
      .merge(lines)
      .attr('d', d => {
        return lineInterpolate(d[1]);
      })
      .attr('fill', 'none');

    // set up dots
    const dots = svg
      .select('.marker')
      .select('.dots')
      .selectAll('.line-marker-dot')
      .data(dataArr);

    const dotsEnter = dots
      .enter()
      .append('circle')
      .attr('class', d => `line-marker-dot p${d[0]}`);

    dotsEnter.merge(dots);
    dotsEnter.attr('r', 4);

    // set up marker
    const marker = svg
      .select('.marker')
      .select(`.marker-line`)
      .attr('width', 1)
      .attr('height', 100);

    this.tooltip = this.container.select('.tooltip-text');

    const axis = svg.select('.axis');
    axis.selectAll('rect').attr('width', 10).attr('height', 1);
    axis
      .selectAll('text')
      .style('font-size', 10)
      .style('transform', `translate(10px, 4px)`);

    const highMarker = axis.select('.high');
    highMarker.select('text').text(yDomain[1].toFixed(1));

    const lowMarker = axis.select('.low');
    lowMarker.style(
      'transform',
      `translateY(${
        (svg.node() as SVGSVGElement).getBoundingClientRect().height
      }px)`
    );
    lowMarker.select('text').text(yDomain[0].toFixed(1));

    dots.exit().remove();
    lines.exit().remove();
  }

  onMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const xOffset = e.clientX - this.containerEl.getBoundingClientRect().x;
    if (
      xOffset > this.containerEl.getBoundingClientRect().width ||
      xOffset < 0
    ) {
      return;
    }

    const frame = Math.round(this.xScale.invert(xOffset));

    return frame;
  }

  updateFrame(frame?: number) {
    const markerG = this.container.select('svg').select('.marker');
    if (frame == null) {
      // this.container.select('svg').select('')
      markerG.style('visibility', 'hidden');
      this.tooltip.style('visibility', 'hidden');
      return;
    }
    markerG.style('visibility', 'visible');
    this.tooltip.style('visibility', 'visible');

    markerG.attr('transform', `translate(${this.xScale(frame)}, 0)`);
    this.playerIds.forEach(id => {
      const y = this.yScale(this.unflattenedData[id][frame]);
      markerG
        .select('.dots')
        .select(`.p${id}`)
        .attr('transform', `translate(0, ${y})`);
    });
    this.tooltip
      .style(
        'left',
        `${
          this.containerEl.getBoundingClientRect().left + this.xScale(frame)
        }px`
      )
      .style(
        'top',
        `${
          window.pageYOffset + this.containerEl.getBoundingClientRect().top - 10
        }px`
      );

    this.tooltip.select('p').text(
      this.tooltipText(
        frame,
        this.playerIds.map(id => [id, this.unflattenedData[id][frame]])
      )
    );
    return frame;
  }
}

import * as d3 from 'd3';
import React from 'react';

type Data = [number, number][];

export default class BarD3 {
  containerEl: HTMLDivElement;
  data: Data;
  container: d3.Selection<d3.BaseType, unknown, null, undefined>;
  playerId: number;
  tooltip: d3.Selection<d3.BaseType, unknown, null, undefined>;
  currData: [number, number] | null;
  tooltipText: (d: [number, number]) => string;

  constructor(
    containerEl: HTMLDivElement,
    data: Data,
    playerId: number,
    tooltipText: (d: [number, number]) => string
  ) {
    this.containerEl = containerEl;
    this.container = d3.select(this.containerEl as d3.BaseType);
    this.data = data;
    this.playerId = playerId;
    this.tooltip = this.container.select('.tooltip');
    this.currData = null;
    this.tooltipText = tooltipText;
    this.update();
  }

  updateData(data: Data) {
    this.data = data;
    this.update();
  }

  update() {
    const svg = this.container.select('svg');
    const height = +svg.attr('height');
    const barHeight = height / this.data.length;

    const axisMax = d3.max(this.data.map(d => d[1]));
    const bars = svg.select('g.bars').selectAll('.bar').data(this.data);

    const barsEnter = bars
      .enter()
      .append('rect')
      .attr('class', `bar hoverable p${this.playerId}`);

    barsEnter.merge(bars);

    bars
      .attr('height', barHeight)
      .attr('width', d => `${(d[1] / axisMax) * 100}%`)
      .style('transform', (d, i) => `translateY(${barHeight * i}px)`);

    bars.on('mousemove', (e, d) => {
      this.currData = d as [number, number];
    });

    bars.on('mouseleave', e => {
      this.currData = null;
    });

    bars.exit().remove();
  }

  onMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (this.currData != null) {
      this.container
        .select('.tooltip-text')
        .style('visibility', 'visible')
        .style(
          'left',
          `${e.clientX - this.containerEl.getBoundingClientRect().left + 5}px`
        )
        .style(
          'top',
          `${e.clientY - this.containerEl.getBoundingClientRect().top + 5}px`
        );
      this.container
        .select('.tooltip-text')
        .select('p')
        .text(this.tooltipText(this.currData));
    } else {
      this.container.select('.tooltip-text').style('visibility', 'hidden');
    }
  }

  onMouseOut(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    this.currData = null;
    this.container.select('.tooltip-text').style('visibility', 'hidden');
  }
}

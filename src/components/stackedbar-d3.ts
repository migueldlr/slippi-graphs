import * as d3 from 'd3';
import React from 'react';

type Data = Record<number, number[]>;

export interface IndividualData {
  frameIdx: number;
  data: number;
  sectionTotal?: number;
}

export default class StackedBarD3 {
  containerEl: HTMLDivElement;
  data: Data;
  container: d3.Selection<d3.BaseType, unknown, null, undefined>;
  playerId: number;
  tooltip: d3.Selection<d3.BaseType, unknown, null, undefined>;
  currData: IndividualData | null;
  tooltipText: (d: IndividualData) => string;
  colorScale: d3.ScaleOrdinal<string, string, never>;

  constructor(
    containerEl: HTMLDivElement,
    data: Data,
    playerId: number,
    tooltipText: (d: IndividualData) => string
  ) {
    this.containerEl = containerEl;
    this.container = d3.select(this.containerEl as d3.BaseType);
    this.data = data;
    this.playerId = playerId;
    this.currData = null;
    this.tooltipText = tooltipText;
    this.colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    this.update();
  }

  updateData(data: Data) {
    this.data = data;
    this.update();
  }

  update() {
    const flatData: IndividualData[] = Object.entries(this.data)
      .map(([k, v]) =>
        v.map(d => ({ frameIdx: d, data: +k, sectionTotal: v.length }))
      )
      .flat();
    const total = flatData.length;

    this.container
      .select('.bars')
      .style('display', 'grid')
      .style('grid-template-columns', `repeat(${total}, 1fr)`);

    const bars = this.container
      .select('.bars')
      .selectAll('.bar')
      .data(flatData);

    const barsEnter = bars
      .enter()
      .append('div')
      .attr('class', `bar p${this.playerId}`);

    barsEnter.merge(bars);

    bars
      .style('height', this.container.select('.bars').style('height'))
      // .style('width', d => `${(1 / total) * 100}%`)
      .style('background-color', d => this.colorScale(d.data.toString()));

    bars.on('mousemove', (e, d) => {
      this.currData = d;
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
      this.container.select('.bars').style('gap', '2px');
      return this.currData.frameIdx;
    } else {
      this.container.select('.tooltip-text').style('visibility', 'hidden');
      this.container.select('.bars').style('gap', '0');
    }
  }

  onMouseOut(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    this.container.select('.tooltip-text').style('visibility', 'hidden');
    this.container.select('.bars').style('gap', '0');
  }
}

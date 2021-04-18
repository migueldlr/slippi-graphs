import { PlayerInput } from '@slippi/slippi-js/dist/stats/inputs';
import * as d3 from 'd3';
import React, { useEffect } from 'react';

interface Props {
  data: { [playerId: number]: PlayerInput[] };
}

const LineTwo = ({ data: initData }: Props) => {
  useEffect(() => {
    const data: { [playerId: number]: number[] } = {};
    for (let id in initData) {
      console.log(id);
      data[id] = initData[id].map(
        (d, i) =>
          d.inputCount - (i < 120 ? 0 : initData[id][i - 120].inputCount)
      );
    }
    console.log(data);
    const playerIds = Object.keys(data).map(x => +x);
    const xDomain = [0, data[playerIds[0]].length];
    const yDomain = d3.extent(d3.merge<number>(playerIds.map(id => data[id])));
    console.log(xDomain);
    console.log(yDomain);

    const svg = d3
      .select('#scatter2')
      .append('svg')
      .style('width', `100%`)
      .style('height', `100%`)
      .style('overflow', `visible`);

    const container = document.querySelector('#scatter2');
    const containerSelect = d3.select('#scatter2');
    const w = container.clientWidth;
    const h = container.clientHeight;

    const margin = { top: 0, bottom: 0, left: 0, right: 0 };

    // dimensions of slider bar
    const width = w - margin.left - margin.right;
    const height = h - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().domain(xDomain).range([0, width]);
    const yScale = d3.scaleLinear().domain(yDomain).range([height, 0]);
    const lineInterpolate = d3
      .line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]));

    console.log(data[0]);

    const markerG = svg.append('g').style('display', 'none');

    const marker = markerG
      .append('rect')
      .attr('class', `line-marker-line`)
      .attr('width', 1)
      .attr('height', 200);

    const lines = svg.append('g');
    const dotG = markerG.append('g');

    playerIds.forEach(id => {
      lines
        .append('path')
        .attr('class', `line-plot p${id}`)
        .attr('d', lineInterpolate(data[id].map((d, i) => [i, d])))
        .attr('stroke', 'red')
        .attr('fill', 'none');
      dotG
        .append('circle')
        .attr('class', `line-marker-dot p${id}`)
        .attr('r', 4)
        .attr('transform', `translate(${0}, ${yScale(0)})`);
    });

    const tooltip = d3
      .select('#scatter')
      .append('div')
      .attr('class', 'tooltip')
      .style('display', 'none')
      .style('position', 'absolute')
      .style('padding', `5px`);

    const text = tooltip.append('p');

    const mousemove = (event, d) => {
      const node = svg.node() as SVGSVGElement;
      const xOffset = event.clientX - node.getBoundingClientRect().x;
      const yOffset = event.clientY - node.getBoundingClientRect().y;
      const frame = xScale.invert(xOffset);
      markerG
        .style('display', 'inline')
        .attr('transform', `translate(${xOffset}, 0)`);
      playerIds.forEach(id => {
        const y = yScale(data[id][Math.round(frame)]);
        dotG.select(`.p${id}`).attr('transform', `translate(0, ${y})`);
      });
      tooltip.style('display', 'block');
      tooltip.style('left', `${event.clientX}px`);
      tooltip.style('top', `${event.clientY}px`);
      text.text(
        playerIds
          .map(id => `Player ${id}: ${data[id][Math.round(frame)]}`)
          .join('\n')
      );
    };

    containerSelect.on('mousemove', mousemove);
    // tooltip.on('mousemove', mousemove);

    containerSelect.on('mouseleave', () => {
      tooltip.style('display', 'none');
      markerG.style('display', 'none');
    });
  }, []);

  return (
    <div
      id="scatter2"
      style={{
        width: `100%`,
        height: `200px`,
        overflow: `visible`,
      }}
    />
  );
};

LineTwo.whyDidYouRender = true;

export default React.memo(LineTwo);

import * as d3 from 'd3';
import React, { useEffect } from 'react';

interface Props {
  data: Record<number, [number, number][]>;
}

const Line = ({ data }: Props) => {
  useEffect(() => {
    const playerIds = Object.keys(data).map(x => +x);
    const xDomain = [0, data[playerIds[0]].length];
    const yDomain = d3.extent(
      d3.merge<number>(playerIds.map(id => data[id].map(frame => frame[1])))
    );
    console.log(yDomain);

    const svg = d3.select('#scatter');

    const container = document.querySelector('#scatter');
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
    playerIds.forEach(id => {
      svg
        .append('path')
        .attr('class', `line-plot p${id}`)
        .attr('d', lineInterpolate(data[id]))
        .attr('stroke', 'red')
        .attr('fill', 'none');
    });
  }, []);

  return (
    <svg
      id="scatter"
      style={{
        width: `100%`,
        height: `200px`,
        overflow: `visible`,
      }}
    />
  );
};

export default Line;

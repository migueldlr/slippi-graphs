import * as d3 from 'd3';
import React, { useEffect } from 'react';

interface Props {
  min: number;
  max: number;
  value: [number, number];
  setValue: (x: [number, number]) => void;
}

const Brush = (props: Props) => {
  const px = 40;
  const slider = function (min: number, max: number) {
    const range = [min, max];

    // get container width/height
    const container = document.querySelector('#slider');
    const w = container.clientWidth;
    const h = container.clientHeight;

    // set width and height of svg
    // const w = 300;
    // const h = 50;
    const margin = { top: 0, bottom: 10, left: px, right: px };

    // dimensions of slider bar
    const width = w - margin.left - margin.right;
    const height = h - margin.top - margin.bottom;

    // create x scale
    const x = d3
      .scaleLinear()
      .domain(range) // data space
      .range([0, width]); // display space

    // create svg and translated g
    const svg = d3
      .select('#slider')
      .append('svg')
      .style('width', `100%`)
      .style('height', `100%`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // labels
    const labelL = g
      .append('text')
      .attr('id', 'labelleft')
      .attr('text-anchor', 'middle')
      .attr('x', 0)
      .attr('y', height + 5);

    const labelR = g
      .append('text')
      .attr('id', 'labelright')
      .attr('text-anchor', 'middle')
      .attr('x', 0)
      .attr('y', height + 5);

    // define brush
    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on('brush', function (event, d) {
        const s = event.selection;
        // update and move labels
        labelL.attr('x', s[0]).text(d3.format('.0f')(x.invert(s[0])));
        labelR.attr('x', s[1]).text(d3.format('.0f')(x.invert(s[1])));
        // move brush handles
        handle.attr('display', null).attr('transform', function (d, i) {
          return 'translate(' + [s[i], -height / 4] + ')';
        });
        // update view
        // if the view should only be updated after brushing is over,
        // move these two lines into the on('end') part below
        svg.node().value = s.map(function (d) {
          const temp = x.invert(d);
          return +temp;
        });
        svg.node().dispatchEvent(new CustomEvent('input'));
      });

    // append brush to g
    const gBrush = g.append('g').attr('class', 'brush').call(brush);

    // add brush handles (from https://bl.ocks.org/Fil/2d43867ba1f36a05459c7113c7f6f98a)
    const brushResizePath = function (d) {
      const e = +(d.type == 'e'),
        x = e ? 1 : -1,
        y = height / 2;
      return (
        'M' +
        0.5 * x +
        ',' +
        y +
        'A6,6 0 0 ' +
        e +
        ' ' +
        6.5 * x +
        ',' +
        (y + 6) +
        'V' +
        (2 * y - 6) +
        'A6,6 0 0 ' +
        e +
        ' ' +
        0.5 * x +
        ',' +
        2 * y +
        'Z' +
        'M' +
        2.5 * x +
        ',' +
        (y + 8) +
        'V' +
        (2 * y - 8) +
        'M' +
        4.5 * x +
        ',' +
        (y + 8) +
        'V' +
        (2 * y - 8)
      );
    };

    const handle = gBrush
      .selectAll('.handle--custom')
      .data([{ type: 'w' }, { type: 'e' }])
      .enter()
      .append('path')
      .attr('class', 'handle--custom')
      .attr('stroke', '#000')
      .attr('fill', '#eee')
      .attr('cursor', 'ew-resize')
      .attr('d', brushResizePath);

    // override default behaviour - clicking outside of the selected area
    // will select a small piece there rather than deselecting everything
    // https://bl.ocks.org/mbostock/6498000
    gBrush
      .selectAll('.overlay')
      .each(function (d) {
        d.type = 'selection';
      })
      .on('mousedown touchstart', function (event) {
        const dx = x(max / 10) - x(0), // Use a fixed width when recentering.
          cx = d3.pointer(event)[0],
          x0 = cx - dx / 2,
          x1 = cx + dx / 2;
        d3.select(this.parentNode).call(
          brush.move,
          x1 > width ? [width - dx, width] : x0 < 0 ? [0, dx] : [x0, x1]
        );
      });

    // select entire range
    gBrush.call(brush.move, range.map(x));

    return svg.node();
  };

  let sliderEl: SVGSVGElement;
  useEffect(() => {
    sliderEl = slider(props.min, props.max);

    sliderEl.addEventListener('input', e => props.setValue(sliderEl.value));
  }, []);

  return (
    <div
      id="slider"
      style={{
        width: `100%`,
        height: `50px`,
        backgroundColor: `#D8D5DB`,
        overflow: `visible`,
      }}
    >
      {sliderEl}
    </div>
  );
};

export default Brush;

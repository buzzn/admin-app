import * as React from 'react';

const d3 = require('d3');

class Bubbles extends React.Component {
  data: Array<{ id: number; r: number }>;
  svgDom: SVGSVGElement | null;
  redrawTimer: number;
  width: number;
  height: number;
  simulation: any;
  node: any;

  constructor(props) {
    super(props);

    this.svgDom = null;
    this.data = Array.from(Array(30).keys()).map(i => ({ id: i, r: this.getRandomIntInclusive(20, 100) }));
    this.width = 1000;
    this.height = 1000;
    this.simulation = null;
    this.node = null;
  }

  componentDidMount() {
    this.draw();
    setTimeout(() => {
      this.redrawTimer = window.setInterval(this.redraw.bind(this), 5000);
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.redrawTimer);
  }

  getRandomIntInclusive(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  ticked() {
    this.node.attr('cx', d => d.x).attr('cy', d => d.y);
  }

  draw() {
    this.simulation = d3
      .forceSimulation()
      .force(
        'collide',
        d3
          .forceCollide(d => d.r - 1)
          .radius(d => d.r - 1)
          .strength(1)
          .iterations(1),
      )
      .force('charge', d3.forceManyBody().strength(1))
      // .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('y', d3.forceY(this.height / 2).strength(0.1))
      .force('x', d3.forceX(this.width / 2).strength(0.1));

    this.node = d3
      .select(this.svgDom)
      .append('g')
      .attr('class', 'bubbles')
      .selectAll('circle')
      .data(this.data)
      .enter()
      .append('circle')
      .style('fill', '#d8d8d8')
      .attr('r', d => d.r);

    this.simulation
      .nodes(this.data)
      // .alphaTarget(1)
      .on('tick', this.ticked.bind(this));
  }

  redraw() {
    if (document.hidden) return;

    const winner = this.getRandomIntInclusive(0, this.data.length - 1);
    const oldVal = this.data[winner].r;
    this.data[winner].r = this.getRandomIntInclusive(Math.abs(oldVal - 10), oldVal + 10);

    this.node
      .transition()
      .ease(d3.easeExpOut)
      .duration(4000)
      .attr('r', d => d.r);

    this.simulation
      .nodes(this.data)
      .velocityDecay(0.2)
      .force(
        'collide',
        d3
          .forceCollide(d => d.r - 1)
          .radius(d => d.r - 1)
          .strength(1)
          .iterations(1),
      )
      .force('charge', d3.forceManyBody().strength(1))
      // .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('y', d3.forceY(this.height / 2).strength(0.1))
      .force('x', d3.forceX(this.width / 2).strength(0.1))
      .restart();
  }

  render() {
    return <svg ref={svgDom => (this.svgDom = svgDom)} width="100%" height="100%" viewBox="0 0 1000 1000" />;
  }
}

export default Bubbles;

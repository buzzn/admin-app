import * as React from 'react';
import sample from 'lodash/sample';

const d3 = require('d3');

class Bubbles extends React.Component {
  data: Array<{ id: number; r: number }>;
  svgDom: SVGSVGElement | null;
  redrawTimer: number;
  width: number;
  height: number;
  simulation: any;
  node: any;
  colors: Array<string>;
  baseColor: string;

  constructor(props) {
    super(props);

    this.svgDom = null;
    this.baseColor = '#d8d8d8';
    this.colors = [
      '#d4e157',
      '#afb42b',
      '#f57c00',
      '#f3e861',
      '#90caf9',
      '#00bcd4',
      '#ff9800',
      '#fdd835',
      '#1e88e5',
      '#4dd0e1',
    ];
    this.width = 1000;
    this.height = 1000;
    this.data = Array.from(Array(30).keys()).map(i => ({
      id: i,
      r: this.getRandomIntInclusive(20, 100),
      x: this.width / 2,
      y: this.height / 2,
    }));
    this.simulation = null;
    this.node = null;
  }

  componentDidMount() {
    this.draw();
    setTimeout(() => {
      this.redrawTimer = window.setInterval(this.redraw, 5000);
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.redrawTimer);
  }

  getRandomIntInclusive = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

  ticked = () => {
    this.node.attr('cx', d => d.x).attr('cy', d => d.y);
  };

  draw = () => {
    const colors = this.colors;
    const baseColor = this.baseColor;
    const showDetails = (_data, _i, element) => {
      d3
        .select(element)
        .transition()
        .duration(500)
        .styleTween('fill', function () {
          return d3.interpolateRgb(this.style.fill, sample(colors));
        });
    };
    const hideDetails = (_data, _i, element) => {
      d3
        .select(element)
        .transition()
        .duration(1000)
        .styleTween('fill', function () {
          return d3.interpolateRgb(this.style.fill, baseColor);
        });
    };

    this.simulation = d3
      .forceSimulation()
      .alpha(0.4)
      .force(
        'collide',
        d3
          .forceCollide(d => d.r - 1)
          .radius(d => d.r - 1)
          .strength(1)
          .iterations(1),
      )
      .force('charge', d3.forceManyBody().strength(1))
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
      .style('fill', this.baseColor)
      .attr('r', d => d.r)
      .on('mouseover', function mouseShow(d, i) {
        showDetails(d, i, this);
      })
      .on('mouseout', function mouseHide(d, i) {
        hideDetails(d, i, this);
      })
      .on('touchstart', function touchShow(d, i) {
        showDetails(d, i, this);
      })
      .on('touchend', function touchHide(d, i) {
        const elementSelf = this;
        setTimeout(() => hideDetails(d, i, elementSelf), 1000);
      });

    this.simulation.nodes(this.data).on('tick', this.ticked);
  };

  redraw = () => {
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
      .alpha(0.1)
      .nodes(this.data)
      .force(
        'collide',
        d3
          .forceCollide(d => d.r - 1)
          .radius(d => d.r - 1)
          .strength(1)
          .iterations(1),
      )
      .force('charge', d3.forceManyBody().strength(1))
      .force('y', d3.forceY(this.height / 2).strength(0.01))
      .force('x', d3.forceX(this.width / 2).strength(0.01))
      .restart();
  };

  render() {
    return <svg ref={svgDom => (this.svgDom = svgDom)} width="100%" height="100%" viewBox="0 0 1000 1000" />;
  }
}

export default Bubbles;

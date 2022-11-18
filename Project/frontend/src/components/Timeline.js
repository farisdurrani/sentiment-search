import React, { useEffect, useState, useRef } from "react";
import { Button, Container } from "react-bootstrap";
import * as d3 from "d3";
import * as Papa from "papaparse";
import PropTypes from "prop-types";

const Timeline = (props) => {
  const d3Chart = useRef();
  // define the dimensions and margins for the graph
  const NUMBER_OF_GRAPHS = 2;
  const ABSOLUTE_WIDTH = 960;
  const ABSOLUTE_HEIGHT = 540 * NUMBER_OF_GRAPHS;
  const ABSOLUTE_MARGIN = {
    top: 10,
    right: 10,
    bottom: 20,
    left: 10,
    in_between_block: 20,
  };
  const SVG_HEIGHT =
    (ABSOLUTE_HEIGHT -
      ABSOLUTE_MARGIN.top -
      ABSOLUTE_MARGIN.bottom -
      ABSOLUTE_MARGIN.in_between_block * (NUMBER_OF_GRAPHS - 1)) /
    NUMBER_OF_GRAPHS;
  const SVG_WIDTH =
    ABSOLUTE_WIDTH - ABSOLUTE_MARGIN.left - ABSOLUTE_MARGIN.right;
  const SVG_PADDING = { t: 30, r: 120, b: 40, l: 60 };
  const SVG2_PADDING = { t: 30, r: 120, b: 40, l: 100 };
  const GRAPH_HEIGHT = SVG_HEIGHT - SVG_PADDING.t - SVG_PADDING.b;
  const GRAPH2_HEIGHT = SVG_HEIGHT - SVG2_PADDING.t - SVG2_PADDING.b;
  const GRAPH_WIDTH = SVG_WIDTH - SVG_PADDING.l - SVG_PADDING.r;
  const GRAPH2_WIDTH = SVG_WIDTH - SVG2_PADDING.l - SVG2_PADDING.r;

  const createSVGGroup = () => {
    // create base SVG
    const svg_base = d3
      .select(d3Chart.current)
      .attr("width", SVG_WIDTH)
      .attr("height", SVG_HEIGHT)
      .attr(
        "transform",
        `translate(${ABSOLUTE_MARGIN.left}, ${
          ABSOLUTE_MARGIN.top + ABSOLUTE_MARGIN.in_between_block
        })`
      )
      .attr("id", "line_chart");

    // create main group <g> in main SVG
    const svg = svg_base
      .append("g")
      .attr("id", "container")
      .attr("transform", `translate(${SVG_PADDING.l}, ${SVG_PADDING.t})`);

    // draw boundary circles
    svg_base.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 20);
    svg_base.append("circle").attr("cx", SVG_WIDTH).attr("cy", 0).attr("r", 20);
    svg_base
      .append("circle")
      .attr("cx", 0)
      .attr("cy", SVG_HEIGHT)
      .attr("r", 20);
    svg_base
      .append("circle")
      .attr("cx", SVG_WIDTH)
      .attr("cy", SVG_HEIGHT)
      .attr("r", 20);

    const plotGroup = svg.append("g").attr("id", "plot1");

    return plotGroup;
  };

  const createDomainScale = (dataset) => {
    // set the domains of X and Y scales based on data
    const xDomain = [
      d3.min(dataset, (d) => d.date),
      d3.max(dataset, (d) => d.date),
    ];
    const yDomain = [-1, 1];
    const xScale = d3.scaleTime().domain(xDomain).range([0, GRAPH_WIDTH]);
    const yScale = d3.scaleLinear().domain(yDomain).range([GRAPH_HEIGHT, 0]);
    return [xScale, yScale];
  };

  const importData = () => {
    const raw_dataset = require("../data/cnn_sample.json")["rows"];
    const dataset = raw_dataset.map((e) => ({
      date: new Date(e.date),
      sentiment: +e.sentiment,
    }));
    return dataset;
  };

  const addAxes = (plotGroup, xScale, yScale) => {
    // Add the X Axis
    const xAxisGroup = plotGroup.append("g").attr("id", "x-axis-lines");
    const xAxis = d3.axisBottom(xScale);
    xAxisGroup
      .attr("transform", `translate(0, ${GRAPH_HEIGHT / 2})`)
      .call(xAxis);

    // Add the text label for X Axis
    xAxisGroup
      .append("text")
      .attr("x", GRAPH_WIDTH / 2)
      .attr("y", GRAPH_HEIGHT + SVG_PADDING.t)
      .attr("text-anchor", "middle")
      .text("Date");

    // Add the Y Axis
    const yAxisGroup = plotGroup.append("g").attr("id", "y-axis-lines");
    const yAxis = d3.axisLeft(yScale);
    yAxisGroup.call(yAxis);

    // Add the text label for Y axis
    yAxisGroup
      .append("text")
      .attr("x", 0)
      .attr("y", GRAPH_HEIGHT / 2 - 40)
      .attr("transform", `rotate(270 ${0} ${GRAPH_HEIGHT / 2})`)
      .text("Sentiment");
  };

  const addGraphTitle = (plotGroup) => {
    // Add graph title
    plotGroup
      .append("text")
      .attr("x", GRAPH_WIDTH / 2)
      .attr("text-anchor", "middle")
      .attr("y", -10)
      .attr("id", "line_chart_title")
      .text("Board games by Rating 2015-2019");
  };

  const addCircles = (plotGroup, dataset, xScale, yScale) => {
    const colorArray = [d3.schemeCategory10, d3.schemeAccent];
    const colorScheme = d3.scaleOrdinal(colorArray[0]);

    const linesGroup = plotGroup.append("g").attr("id", "lines-a");

    // Draw circles
    linesGroup
      .selectAll(".circle-sentiment")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("fill", colorScheme(0))
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.sentiment))
      .attr("r", 2);
  };

  const createTimeline = () => {
    const dataset = importData();

    const plotGroup = createSVGGroup();

    const [xScale, yScale] = createDomainScale(dataset);

    addAxes(plotGroup, xScale, yScale);

    addGraphTitle(plotGroup);

    addCircles(plotGroup, dataset, xScale, yScale);
  };

  useEffect(() => {
    createTimeline();
  }, []);

  return (
    <div>
      <svg ref={d3Chart}></svg>
    </div>
  );
};

Timeline.propTypes = {};

export default Timeline;

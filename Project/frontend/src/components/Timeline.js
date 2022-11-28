import React, { useEffect, useState, useRef, useMemo } from "react";
import { Button, Container } from "react-bootstrap";
import * as d3 from "d3";
import * as Papa from "papaparse";
import PropTypes from "prop-types";

const Timeline = (props) => {
  const svg1Ref = useRef();
  const svg2Ref = useRef();
  // define the dimensions and margins for the graph
  const NUMBER_OF_GRAPHS = 1;
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
  const GRAPH_HEIGHT = SVG_HEIGHT - SVG_PADDING.t - SVG_PADDING.b;
  const GRAPH_WIDTH = SVG_WIDTH - SVG_PADDING.l - SVG_PADDING.r;

  const dataset = useMemo(() => importData(), []);

  const initializeSVG = (svgRef) => {
    // create base SVG
    const svg_base = d3
      .select(svgRef.current)
      .attr("width", SVG_WIDTH)
      .attr("height", SVG_HEIGHT)
      .attr(
        "transform",
        `translate(${ABSOLUTE_MARGIN.left}, ${ABSOLUTE_MARGIN.top})`
      )
      .attr("id", "svg-1");

    // create main group <g> in main SVG
    const svg = svg_base
      .append("g")
      .attr("id", "plot-1")
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

    return svg;
  };

  const createScale = (dataset) => {
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

  function importData() {
    const raw_dataset = require("../data/data.json")["rows"];
    const dataset = raw_dataset.map((e) => ({
      date: new Date(e.date),
      sentiment: +e.meanSentiment,
    }));
    return dataset;
  }

  const addAxes = (plotGroup, xScale, yScale) => {
    // Add the X Axis
    const xAxisGroup = plotGroup.append("g").attr("class", "x-axis");
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
    const yAxisGroup = plotGroup.append("g").attr("class", "y-axis");
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
      .attr("class", "title")
      .text("Plot 1");
  };

  const addMainVis = (plotGroup, dataset, xScale, yScale) => {
    const colorArray = [d3.schemeCategory10, d3.schemeAccent];
    const colorScheme = d3.scaleOrdinal(colorArray[0]);

    const plotElements = plotGroup.append("g").attr("class", "plot-elements");

    // Draw circles
    plotElements
      .selectAll(".circle-sentiment")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("fill", colorScheme(0))
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => {
        const a = yScale(d.sentiment);
        return a;
      })
      .attr("r", 1);
  };

  const addMainVis2 = (plotGroup, dataset, xScale, yScale) => {
    const colorArray = [d3.schemeCategory10, d3.schemeAccent];
    const colorScheme = d3.scaleOrdinal(colorArray[0]);

    const plotElements = plotGroup.append("g").attr("class", "plot-elements");

    // Draw circles
    plotElements
      .selectAll(".rects")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("fill", colorScheme(0))
      .attr("height", (d) => yScale(d.sentiment))
      .attr("width", GRAPH_WIDTH / dataset.length)
      .attr("x", (d) => xScale(d.date))
      .attr("y", GRAPH_HEIGHT / 2);
  };

  const createPlot1 = (svg, xScale, yScale) => {
    addAxes(svg, xScale, yScale);
    addGraphTitle(svg);
    addMainVis(svg, dataset, xScale, yScale);
  };

  const createPlot2 = (svg, xScale, yScale) => {
    addAxes(svg, xScale, yScale);
    addGraphTitle(svg);
    addMainVis2(svg, dataset, xScale, yScale);
  };

  const createAll = () => {
    const svg1 = initializeSVG(svg1Ref);
    const svg2 = initializeSVG(svg2Ref);
    const [xScale, yScale] = createScale(dataset);
    createPlot1(svg1, xScale, yScale);
    createPlot2(svg2, xScale, yScale);
  };

  useEffect(() => {
    createAll();
  }, []);

  return (
    <div>
      <svg ref={svg1Ref}></svg>
      <svg ref={svg2Ref}></svg>
    </div>
  );
};

Timeline.propTypes = {};

export default Timeline;

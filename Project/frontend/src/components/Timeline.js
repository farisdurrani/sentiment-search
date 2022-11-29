import * as d3 from "d3";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Button, Container } from "react-bootstrap";
import { MAX_SENTIMENT, MIN_SENTIMENT, sentimentColor } from "../common";

const Timeline = (props) => {
  const svg1Ref = useRef();
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

  const [dataset, sig_events_dataset] = useMemo(() => importData(), []);

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

  const createScale = () => {
    // set the domains of X and Y scales based on data
    const dateDomain = [dataset[0].date, dataset[dataset.length - 1].date];
    const countDomain = [0, d3.max(dataset, (d) => d.count)];

    const dateScale = d3.scaleTime().domain(dateDomain).range([0, GRAPH_WIDTH]);
    const countScale = d3
      .scaleLinear()
      .domain(countDomain)
      .range([GRAPH_HEIGHT, 0]);

    return [dateScale, countScale];
  };

  function importData() {
    const raw_dataset = require("../data/data.json")["rows"];
    const raw_sig_events_dataset = require("../data/sig_ev_cleaned.json")[
      "rows"
    ];

    const dataset = raw_dataset.map((e) => ({
      date: new Date(e.date),
      sentiment: +e.meanSentiment,
      count: +e.count,
    }));
    const sig_ev_dataset = raw_sig_events_dataset.map((e) => ({
      date: new Date(e.date),
      description: e.description,
    }));
    const dateDomain = [dataset[0].date, dataset[dataset.length - 1].date];
    const sig_ev_idx_range = [
      sig_ev_dataset.findIndex((e) => e.date >= dateDomain[0]),
      sig_ev_dataset.findLastIndex((e) => e.date <= dateDomain[1]),
    ];

    return [
      dataset,
      sig_ev_dataset.slice(sig_ev_idx_range[0], sig_ev_idx_range[1] + 1),
    ];
  }

  const addAxes = (plotGroup, xScale, countScale) => {
    // Add the X Axis
    const xAxisGroup = plotGroup.append("g").attr("class", "x-axis");
    const xAxis = d3.axisBottom(xScale);
    xAxisGroup.attr("transform", `translate(0, ${GRAPH_HEIGHT})`).call(xAxis);

    // Add the text label for X Axis
    xAxisGroup
      .append("text")
      .attr("x", GRAPH_WIDTH / 2)
      .attr("y", GRAPH_HEIGHT + SVG_PADDING.t)
      .attr("text-anchor", "middle")
      .text("Date");

    // Add the Y Axis
    const yAxisGroup = plotGroup.append("g").attr("class", "y-axis");
    const yAxis = d3.axisLeft(countScale);
    yAxisGroup.call(yAxis);

    // Add the text label for Y axis
    yAxisGroup
      .append("text")
      .attr("x", 0)
      .attr("y", GRAPH_HEIGHT / 2 - 40)
      .attr("transform", `rotate(270 ${0} ${GRAPH_HEIGHT / 2})`)
      .text("Count of Posts");
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

  const addMainVis2 = (plotGroup, dateScale, countScale) => {
    const plotElements = plotGroup.append("g").attr("class", "plot-elements");

    // Draw bars
    plotElements
      .selectAll(".rects")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("fill", (d) => sentimentColor(d.sentiment))
      .attr("height", (d) => GRAPH_HEIGHT - countScale(d.count))
      .attr("width", GRAPH_WIDTH / dataset.length)
      .attr("x", (d) => dateScale(d.date))
      .attr("y", (d) => countScale(d.count));

    // Draw circles
    plotElements
      .selectAll(".sig-events-circles")
      .data(sig_events_dataset)
      .enter()
      .append("circle")
      .attr("fill", (d) => {
        const datasetDateInfo = dataset.find((e) => e.date - d.date === 0);

        if (datasetDateInfo == null)
          return sentimentColor((MAX_SENTIMENT + MIN_SENTIMENT) / 2);

        return sentimentColor(datasetDateInfo.sentiment);
      })
      .attr("cx", (d) => dateScale(d.date))
      .attr("cy", (_) => GRAPH_HEIGHT * Math.random())
      .attr("r", 10);
  };

  const createPlot = (svg, dateScale, countScale) => {
    addMainVis2(svg, dateScale, countScale);
    addGraphTitle(svg);
    addAxes(svg, dateScale, countScale);
  };

  const createAll = () => {
    const svg1 = initializeSVG(svg1Ref);
    const [dateScale, countScale] = createScale();
    createPlot(svg1, dateScale, countScale);
  };

  useEffect(() => {
    createAll();
  }, []);

  return (
    <div
      id="timeline"
      className={`${props.className} d-flex justify-content-center`}
    >
      <svg ref={svg1Ref}></svg>
    </div>
  );
};

Timeline.propTypes = {};

export default Timeline;

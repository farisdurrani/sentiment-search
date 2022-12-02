import React, { useEffect, useState, useRef, useMemo } from "react";
import * as d3 from "d3";
import axios from "axios";
import { sentimentColor } from "../common";

const FrequencyChart = (props) => {
  const { className, hoveredFrequencies } = props;

  const svgRef = useRef();
  const xaxisRef = useRef();
  const yaxisRef = useRef();
  const bars = useRef();

  const NUMBER_OF_GRAPHS = 1;
  const ABSOLUTE_WIDTH = Math.min(1200, window.innerWidth);
  const ABSOLUTE_HEIGHT = 540 * NUMBER_OF_GRAPHS;
  const ABSOLUTE_MARGIN = {
    top: 10,
    right: 10,
    bottom: 20,
    left: 10,
    in_between_block: 20,
  };
  const SVG_HEIGHT =
    ABSOLUTE_HEIGHT - ABSOLUTE_MARGIN.top - ABSOLUTE_MARGIN.bottom;
  const SVG_WIDTH =
    ABSOLUTE_WIDTH - ABSOLUTE_MARGIN.left - ABSOLUTE_MARGIN.right;
  const SVG_PADDING = { t: 60, r: 120, b: 30, l: 60 };
  const GRAPH_HEIGHT = SVG_HEIGHT - SVG_PADDING.t;
  const YAXIS_DOMAIN = SVG_HEIGHT - 2 * SVG_PADDING.t;
  const GRAPH_WIDTH = SVG_WIDTH - SVG_PADDING.l - SVG_PADDING.r;

  const dataset = hoveredFrequencies?.posts?.map((d) => ({
    count: +d.count,
    sentiment: +d.sentiment,
    platform: d.platform,
  }));

  const initSVG = () => {
    d3.select(svgRef.current)
      .attr("id", "frequency_chart")
      .attr("width", SVG_WIDTH)
      .attr("height", SVG_HEIGHT)
      .attr(
        "transform",
        "translate(" + ABSOLUTE_MARGIN.left + "," + ABSOLUTE_MARGIN.top + ")"
      );
  };

  const createAxes = (xScale, yScale) => {
    const xaB = d3.select(xaxisRef.current);
    xaB
      .call(d3.axisBottom(xScale))
      .attr(
        "transform",
        "translate(" + SVG_PADDING.l + "," + GRAPH_HEIGHT + ")"
      );

    // Add the text label for X Axis
    d3.select("#xAB-5435").remove();
    xaB
      .append("text")
      .attr("class", "axis-label")
      .attr("id", "xAB-5435")
      .attr("x", GRAPH_WIDTH / 2)
      .attr("y", SVG_PADDING.t)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text("Platform");

    const yaB = d3.select(yaxisRef.current);
    yaB
      .call(d3.axisLeft(yScale))
      .attr(
        "transform",
        "translate(" + SVG_PADDING.l + "," + SVG_PADDING.t + ")"
      );

    // Add the text label for Y axis
    d3.select("#yAB-5435").remove();
    yaB
      .append("text")
      .attr("class", "axis-label")
      .attr("id", "yAB-5435")
      .attr("x", 0)
      .attr("y", 150)
      .attr("fill", "black")
      .attr("transform", `rotate(270 0 200)`)
      .text("Count of Posts");
  };

  const createScales = () => {
    const yScale = d3
      .scaleLinear()
      .domain([d3.max(dataset, (d) => d.count), 0])
      .range([0, YAXIS_DOMAIN]);
    const xScale = d3
      .scaleBand()
      .domain(dataset.map((d) => d.platform))
      .range([0, GRAPH_WIDTH])
      .padding(0.6);
    return [xScale, yScale];
  };

  const createTitle = () => {
    if (!hoveredFrequencies) return;

    const { date, count, sentiment } = hoveredFrequencies;

    d3.select("#freq-chart-title").style("display", "block");
    const titleCircle = d3.select("#freq-chart-title-circle");
    titleCircle.style("background-color", sentimentColor(sentiment));

    const titleText = d3.select("#freq-chart-title-text");
    titleText.html(
      `${date.toLocaleDateString()} | Sentiment: ${sentiment.toPrecision(
        3
      )} | Count: ${count}`
    );
  };

  createTitle();

  const createAll = () => {
    const [xScale, yScale] = createScales();
    createBars(xScale, yScale);
    createAxes(xScale, yScale);
  };

  function createBars(xScale, yScale) {
    const rg = d3
      .select(".rectangles")
      .attr("width", GRAPH_WIDTH)
      .attr("height", GRAPH_HEIGHT)
      .attr("transform", "translate(60,0)");

    rg.selectAll(".freq-chart-bar").remove();
    rg.selectAll(".freq-chart-bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "freq-chart-bar")
      .attr("x", (d) => xScale(d.platform))
      .attr("y", (d) => yScale(d.count) + SVG_PADDING.t)
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => GRAPH_HEIGHT - yScale(d.count) - SVG_PADDING.t)
      .attr("fill", (d) => sentimentColor(d.sentiment));
  }

  useEffect(() => {
    initSVG();
  }, []);

  useEffect(() => {
    if (!dataset?.length) return;

    createAll();
  }, [dataset]);

  return (
    <div
      className={`d-flex justify-content-center ${className}`}
      id="freq-chart"
    >
      <svg ref={svgRef}>
        <g className="x-axis" ref={xaxisRef}></g>
        <g className="y-axis" ref={yaxisRef}></g>
        <g className="rectangles" ref={bars}></g>
      </svg>
      <div id="freq-chart-title" className="pe-3 ps-3 pb-1">
        <p className="chart-title m-auto">Sentiment Analysis of the Day</p>
        <div className="freq-chart-subtitle d-flex flex-row align-items-center justify-content-center">
          <div id="freq-chart-title-circle" className="sentiment-circle me-3" />
          <p id="freq-chart-title-text" className="mb-0"></p>
        </div>
      </div>
    </div>
  );
};

export default FrequencyChart;

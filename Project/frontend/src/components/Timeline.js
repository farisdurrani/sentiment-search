import * as d3 from "d3";
import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import {
  MAX_SENTIMENT,
  MIN_SENTIMENT,
  sentimentColor,
  API_URL,
  getRandomArbitrary,
} from "../common";

const Timeline = (props) => {
  const { className, searchTerm, setHoveredFrequencies } = props;
  const lowerSearchTerm = searchTerm.toLowerCase();

  const svg1Ref = useRef();

  const USE_LOCAL_FILE = true;

  // define the dimensions and margins for the graph
  const NUMBER_OF_GRAPHS = 1;
  const ABSOLUTE_WIDTH = 1200;
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

  const [dataset, setDataset] = useState();
  const [sig_events_dataset, setSig_events_dataset] = useState();

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
      .attr("id", "timeline-base-svg");

    // create main group <g> in main SVG
    const svg = svg_base
      .append("g")
      .attr("id", "timeline-main-plot")
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
    console.debug("Importing data...");

    const raw_sig_events_dataset = require("../data/sig_ev_cleaned.json")[
      "rows"
    ];
    const relevant_sig_ev = raw_sig_events_dataset.filter((e) =>
      e.description.toLowerCase().includes(lowerSearchTerm)
    );

    const clean_up_dataset = (raw_dataset) => {
      const clean_dataset = raw_dataset.map((e) => ({
        date: new Date(e.date),
        sentiment: +e.meanSentiment,
        count: +e.count,
        posts: e.posts,
      }));

      const sig_ev_dataset = relevant_sig_ev.map((se) => {
        const this_date = new Date(se.date);
        const datasetMatch = clean_dataset.find(
          (d) => d.date - this_date === 0
        );
        return {
          date: this_date,
          description: se.description,
          sentiment: datasetMatch?.sentiment,
          count: datasetMatch?.count,
          posts: datasetMatch?.posts,
        };
      });

      const dateDomain = [
        clean_dataset[0].date,
        clean_dataset[clean_dataset.length - 1].date,
      ];
      const sig_ev_idx_range = [
        sig_ev_dataset.findIndex((e) => e.date >= dateDomain[0]),
        sig_ev_dataset.findLastIndex((e) => e.date <= dateDomain[1]),
      ];

      const shortened_se_dataset = sig_ev_dataset.slice(
        sig_ev_idx_range[0],
        sig_ev_idx_range[1] + 1
      );

      setDataset(clean_dataset);
      setSig_events_dataset(shortened_se_dataset);
    };

    if (USE_LOCAL_FILE) {
      const raw_dataset = require("../data/data.json").rows;
      clean_up_dataset(raw_dataset);
      return;
    }

    const params = {
      keywords: lowerSearchTerm,
      orderDescending: "false",
      startDate: "2015-12-31",
      endDate: "2016-12-31",
    };

    axios.get(API_URL + "/api/getSummary", { params }).then((response) => {
      if (response.data.success) console.debug("Response 200 downloaded");
      else {
        console.debug("Backend call failed");
        return;
      }

      const raw_dataset = response.data["rows"];
      clean_up_dataset(raw_dataset);
    });
  }
  const addAxes = (plotGroup, xScale, countScale) => {
    // Add the X Axis
    const xAxisGroup = plotGroup.append("g").attr("class", "x-axis");
    const xAxis = d3.axisBottom(xScale);
    xAxisGroup.attr("transform", `translate(0, ${GRAPH_HEIGHT})`).call(xAxis);

    // Add the text label for X Axis
    xAxisGroup
      .append("text")
      .attr("class", "axis-label")
      .attr("x", GRAPH_WIDTH / 2)
      .attr("y", SVG_PADDING.t)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text("Date");

    // Add the Y Axis
    const yAxisGroup = plotGroup.append("g").attr("class", "y-axis");
    const yAxis = d3.axisLeft(countScale);
    yAxisGroup.call(yAxis);

    // Add the text label for Y axis
    yAxisGroup
      .append("text")
      .attr("class", "axis-label")
      .attr("x", 0)
      .attr("y", 150)
      .attr("fill", "black")
      .attr("transform", `rotate(270 0 200)`)
      .text("Count of Posts");
  };

  const addGraphTitle = (plotGroup) => {
    // Add graph title
    plotGroup
      .append("text")
      .attr("x", GRAPH_WIDTH / 2)
      .attr("text-anchor", "middle")
      .attr("y", -10)
      .attr("class", "title chart-title")
      .text(`Sentiments Over Time for: ${searchTerm}`);
  };

  const drawEventCards = (plotElements, dateScale, countScale) => {
    const eventCardGroup = plotElements
      .append("g")
      .attr("class", "event-card-group");

    const tooltip = d3.select("#sig-ev-tooltip");
    const tooltipMeta = d3.select("#sig-ev-tooltip-meta");
    const tooltipText = d3.select("#sig-ev-tooltip-text");
    const tooltipCircle = d3.select("#sig-ev-tooltip-circle");

    const mouseover = function (d) {
      tooltip.style("opacity", 1);
      d3.select(this).style("stroke-width", "2").style("opacity", 1);

      const {
        date: rawDate,
        description,
        sentiment: rawSentiment,
        count,
      } = d.target.__data__;
      const date = rawDate.toLocaleDateString("en-US");
      const sentiment = Number.parseFloat(rawSentiment).toFixed(3);
      const count_text = count ? ` | Count: ${count}` : "";

      tooltipMeta.html(`${date} | Sentiment: ${sentiment}${count_text}`);
      tooltipText.html(description);
      tooltipCircle.style("background-color", sentimentColor(sentiment));
    };
    const mousemove = function (d) {
      const [coordX, coordY] = [d.pageX, d.pageY];

      tooltip.style("left", coordX + "px");
      tooltip.style("top", coordY + "px");
    };
    const mouseleave = function (_) {
      tooltip.style("opacity", 0);
      d3.select(this).style("stroke-width", "1").style("opacity", 0.8);
    };

    // Draw circles
    eventCardGroup
      .append("g")
      .attr("class", "sig-events-circles")
      .selectAll(".sig-events-circle")
      .data(sig_events_dataset)
      .enter()
      .append("circle")
      .attr("fill", (d) => {
        const sentiment = d.sentiment;
        if (sentiment == null) {
          return sentimentColor((MAX_SENTIMENT + MIN_SENTIMENT) / 2);
        }
        return sentimentColor(sentiment);
      })
      .attr("cx", (d) => dateScale(d.date))
      .attr("cy", (d) => {
        if (!d.count) return getRandomArbitrary(0, 0.4) * GRAPH_HEIGHT;
        else return countScale(d.count);
      })
      .attr("r", 10)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  };

  const drawBars = (plotElements, dateScale, countScale) => {
    const tooltip = d3.select("#sig-ev-tooltip");
    const tooltipMeta = d3.select("#sig-ev-tooltip-meta");
    const tooltipText = d3.select("#sig-ev-tooltip-text");
    const tooltipCircle = d3.select("#sig-ev-tooltip-circle");

    const mouseover = function (d) {
      tooltip.style("opacity", 1);
      d3.select(this).style("stroke", "black").style("opacity", 1);

      const {
        date: rawDate,
        count,
        sentiment: rawSentiment,
      } = d.target.__data__;
      setHoveredFrequencies(d.target.__data__);
      const date = rawDate.toLocaleDateString("en-US");
      const sentiment = rawSentiment.toFixed(3);

      tooltipMeta.html(`${date} | Sentiment: ${sentiment} | Count: ${count}`);
      tooltipText.html("");
      tooltipCircle.style("background-color", sentimentColor(sentiment));
    };
    const mousemove = function (d) {
      const [coordX, coordY] = [d.pageX, d.pageY];

      tooltip.style("left", coordX + "px");
      tooltip.style("top", coordY + "px");
    };
    const mouseleave = function (_) {
      tooltip.style("opacity", 0);
      d3.select(this).style("stroke", "none").style("opacity", 0.8);
    };

    // Draw bars
    plotElements
      .append("g")
      .attr("class", "plot-elements-bars")
      .selectAll(".plot-elements-bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("fill", (d) => sentimentColor(d.sentiment))
      .attr("height", (d) => GRAPH_HEIGHT - countScale(d.count))
      .attr("width", GRAPH_WIDTH / dataset.length)
      .attr("x", (d) => dateScale(d.date))
      .attr("y", (d) => countScale(d.count))
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  };

  const addMainVis1 = (plotGroup, dateScale, countScale) => {
    const plotElements = plotGroup.append("g").attr("class", "plot-elements");

    drawBars(plotElements, dateScale, countScale);

    drawEventCards(plotElements, dateScale, countScale);
  };

  const createPlot = (svg, dateScale, countScale) => {
    addMainVis1(svg, dateScale, countScale);
    addGraphTitle(svg);
    addAxes(svg, dateScale, countScale);
  };

  const createAll = () => {
    console.debug("Creating graphs...");
    const svg1 = initializeSVG(svg1Ref);
    const [dateScale, countScale] = createScale();
    createPlot(svg1, dateScale, countScale);
  };

  useEffect(() => {
    importData();
  }, []);

  useEffect(() => {
    if (!dataset) return;

    createAll();

    console.debug("Create all done");
  }, [dataset]);

  return (
    <div id="timeline" className={`d-flex justify-content-center ${className}`}>
      <svg ref={svg1Ref}></svg>
      <div id="sig-ev-tooltip" className="tooltip">
        <div id="sig-ev-tooltip-circle" className="sentiment-circle" />
        <p id="sig-ev-tooltip-meta"></p>
        <p id="sig-ev-tooltip-text"></p>
      </div>
    </div>
  );
};

Timeline.propTypes = {};

export default Timeline;

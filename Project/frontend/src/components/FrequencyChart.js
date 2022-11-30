import React, { useEffect, useState, useRef, useMemo } from "react";
import * as d3 from "d3";
import axios from "axios";
import { sentimentColor } from "../common";

const FrequencyChart = (props) => {
  const svgRef = useRef();
  const xaxisRef = useRef();
  const yaxisRef = useRef();
  const bars = useRef();
  const [dataset, setData] = useState([]);

  const USE_LOCAL_FILE = true;

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
    ABSOLUTE_HEIGHT - ABSOLUTE_MARGIN.top - ABSOLUTE_MARGIN.bottom;
  const SVG_WIDTH =
    ABSOLUTE_WIDTH - ABSOLUTE_MARGIN.left - ABSOLUTE_MARGIN.right;
  const SVG_PADDING = { t: 30, r: 120, b: 30, l: 60 };
  const GRAPH_HEIGHT = SVG_HEIGHT - SVG_PADDING.t;
  const YAXIS_DOMAIN = SVG_HEIGHT - 2 * SVG_PADDING.t;
  const GRAPH_WIDTH = SVG_WIDTH - SVG_PADDING.l - SVG_PADDING.r;

  let svg = d3
    .select(svgRef.current)
    .attr("id", "frequency_chart")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT)
    .attr(
      "transform",
      "translate(" + ABSOLUTE_MARGIN.left + "," + ABSOLUTE_MARGIN.top + ")"
    );
  // svg.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 20).attr("id","cir1");
  // svg.append("circle").attr("cx", SVG_WIDTH).attr("cy", 0).attr("r", 20).attr("id","cir2");
  // svg.append("circle") .attr("cx", 0).attr("cy", SVG_HEIGHT).attr("r", 20).attr("id","cir3");
  //     svg.append("circle")
  //         .attr("cx", SVG_WIDTH)
  //         .attr("cy", SVG_HEIGHT)
  //         .attr("r", 20).attr("id","cir4");

  const createGraph = () => {
    var yScale = d3
      .scaleLinear()
      .domain([
        d3.max(dataset, function (d) {
          return d.count;
        }),
        0,
      ])
      .range([0, YAXIS_DOMAIN]);
    var xScale = d3
      .scaleBand()
      .domain(dataset.map((d) => d.platform))
      .range([0, GRAPH_WIDTH]);
    createBars(xScale, yScale);
    const xaB = d3.select(xaxisRef.current);
    xaB
      .call(d3.axisBottom(xScale))
      .attr(
        "transform",
        "translate(" + SVG_PADDING.l + "," + GRAPH_HEIGHT + ")"
      );
    const yaB = d3.select(yaxisRef.current);
    yaB
      .call(d3.axisLeft(yScale))
      .attr(
        "transform",
        "translate(" + SVG_PADDING.l + "," + SVG_PADDING.t + ")"
      );
    return [xScale, yScale];

    // const bars = d3.select(".rectangles").attr("width",SVG_WIDTH).attr("height",SVG_HEIGHT);
  };

  const getData = async () => {
    if (USE_LOCAL_FILE) {
      const frequencies = require("../data/freqData.json").frequencies;
      const ds = frequencies.map((d) => ({
        count: +d.count,
        meanSentiment: +d.meanSentiment,
        platform: d.platform,
      }));
      setData(ds);
      return;
    }

    const response = await axios({
      method: "GET",
      url: "http://127.0.0.1:8000/api/getPlatformFrequencies",
    });

    if (response.status !== 200) {
      console.log("Frequency chart API call failed");
      return;
    }

    const frequencies = response.data.frequencies;
    const ds = frequencies.map((d) => ({
        count: +d.count,
        meanSentiment: +d.meanSentiment,
        platform: d.platform,
      }));
    setData(ds);
    return ds;
  };

  const createBars = (xScale, yScale) => {
    // var xScale = d3.scaleBand().domain(["twitter","facebook","sc"]).range([0,GRAPH_WIDTH]);
    // const xaB = d3.select(".x-axis")
    // xaB.call(d3.axisBottom(xScale)).attr("transform","translate("+SVG_PADDING.l+","+GRAPH_HEIGHT+")")
    const rg = d3
      .select(".rectangles")
      .attr("width", GRAPH_WIDTH)
      .attr("height", GRAPH_HEIGHT)
      .attr("transform", "translate(60,0)");
    // let dummy = [2,3,4];
    var colors = d3
      .scaleQuantize()
      .domain([-1, 1])
      .range(["#4575b4", "#74add1", "#ffffbf", "#f46d43", "#d73027"]);
    rg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return xScale(d.platform) + (xScale.bandwidth() - 63) / 2;
      })
      .attr("y", function (d) {
        return yScale(d.count) + SVG_PADDING.t;
      })
      .attr("width", 63)
      .attr("height", function (d) {
        return GRAPH_HEIGHT - yScale(d.count) - SVG_PADDING.t;
      })
      .attr("fill", function (d) {
        return sentimentColor(d.meanSentiment);
      });
  };

  const createAll = () => {
    const [xScale, yScale] = createGraph();
    // createBars(xScale,yScale);

    //   var xaB = svg_group.append("g").attr("id","x-axis-bars");
    // //   var yaB = svg_group.append("g").attr("id","y-axis-bars");
    //   xaB.call(d3.axisBottom(xScale)).attr("transform","translate(0,"+SVG_HEIGHT+")")
    //   // xaB.append("text").attr("id","bar_x_axis_label").text("Number of users").attr("x",width/2).attr("y",height+20).style("font-size","10px");
    //     // yaB.call(d3.axisLeft(yScale)).attr("transform","translate(0,0)");
  };

  useEffect(() => {
    const setDate = async () => {
      await getData();
    };
    setDate();
  }, []);

  useEffect(() => {
    if (!dataset?.length) return;

    createAll();
  }, [dataset]);

  return (
    <div>
      <svg ref={svgRef}>
        <g className="color"></g>
        <g className="x-axis" ref={xaxisRef}></g>
        <g className="y-axis" ref={yaxisRef}></g>
        <g className="rectangles" ref={bars}></g>
      </svg>
    </div>
  );
};

export default FrequencyChart;

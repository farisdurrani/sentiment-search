import * as d3 from "d3";
import React, { useRef, useMemo, useEffect } from "react";
import { MAX_SENTIMENT, MIN_SENTIMENT, sentimentColor } from "../common";

const Legend = (props) => {
  const svgRef = useRef();
  const SVG_WIDTH = 550;
  const SVG_HEIGHT = 90;
  const SVG_PADDING = { t: 10, b: 10, r: 10, l: 10 };
  const LEGEND_WIDTH = SVG_WIDTH - SVG_PADDING.r - SVG_PADDING.l;
  const LEGEND_HEIGHT = SVG_WIDTH - SVG_PADDING.t - SVG_PADDING.b;
  const BAR_Y_START = 25;
  const DATA_POINTS = 100;

  const data = useMemo(() => {
    console.debug("Loading data Legend");
    const dataToAdd = [];
    for (
      let i = MIN_SENTIMENT;
      i <= MAX_SENTIMENT;
      i += (MAX_SENTIMENT - MIN_SENTIMENT) / DATA_POINTS
    ) {
      dataToAdd.push(i);
    }
    return dataToAdd;
  }, []);

  const createLegendSVGBase = () => {
    const legendconBase = d3
      .select(svgRef.current)
      .attr("width", SVG_WIDTH)
      .attr("height", SVG_HEIGHT);

    // draw boundary circles
    legendconBase.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 20);
    legendconBase
      .append("circle")
      .attr("cx", SVG_WIDTH)
      .attr("cy", 0)
      .attr("r", 20);
    legendconBase
      .append("circle")
      .attr("cx", 0)
      .attr("cy", SVG_HEIGHT)
      .attr("r", 20);
    legendconBase
      .append("circle")
      .attr("cx", SVG_WIDTH)
      .attr("cy", SVG_HEIGHT)
      .attr("r", 20);

    return legendconBase;
  };

  const createLegend = () => {
    console.debug("Creating legend");

    const legendconBase = createLegendSVGBase();

    const legendcon = legendconBase
      .append("g")
      .attr("transform", `translate(${SVG_PADDING.l}, ${SVG_PADDING.t})`);

    // add bars
    legendcon
      .append("g")
      .selectAll(".rect92309")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (_, i) => (i * LEGEND_WIDTH) / DATA_POINTS)
      .attr("y", BAR_Y_START)
      .attr("width", LEGEND_WIDTH / DATA_POINTS)
      .attr("height", LEGEND_HEIGHT * 0.05)
      .attr("fill", (d) => sentimentColor(d));

    // add title
    legendcon
      .append("text")
      .attr("class", "chart-title")
      .attr("x", LEGEND_WIDTH / 2)
      .attr("y", 12)
      .text("Sentiment")
      .attr("text-anchor", "middle")
      .attr("font-size", "14px");
      
      // add sentiment min max values
      legendcon
      .append("text")
      .attr("x", 10)
      .attr("alignment-baseline", "middle")
      .attr("y", BAR_Y_START + LEGEND_HEIGHT * 0.05 / 2)
      .attr("fill", "white")
      .text(MIN_SENTIMENT);
    legendcon
      .append("text")
      .attr("x", LEGEND_WIDTH - 20)
      .attr("alignment-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("y", BAR_Y_START + LEGEND_HEIGHT * 0.05 / 2)
      .attr("fill", "white")
      .text(MAX_SENTIMENT);
  };

  useEffect(() => {
    createLegend();
  }, []);

  return (
    <div id="legend">
      <svg ref={svgRef}></svg>
    </div>
  );
};
export default Legend;

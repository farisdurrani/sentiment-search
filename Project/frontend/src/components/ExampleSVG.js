import React, { useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

const Graph1 = (props) => {
  const svg1Ref = useRef();

  const createAll = () => {
    const svg = d3
      .select(svg1Ref.current)
      .attr("width", 800)
      .attr("height", 800)
      .attr("transform", `translate(${20}, ${20})`)
      .attr("id", "svg-1")
      .append("g");

    svg
      .append("circle")
      .attr("cx", 20)
      .attr("cy", 20)
      .attr("fill", "blue")
      .attr("r", 10);
  };

  useEffect(() => {
    createAll();
  }, []);

  return (
    <div>
      <svg ref={svg1Ref}></svg>
    </div>
  );
};

Graph1.propTypes = {};

export default Graph1;

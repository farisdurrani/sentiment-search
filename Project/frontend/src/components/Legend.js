import * as d3 from "d3";
import React, { useRef} from "react";
import {
    MAX_SENTIMENT,
    MIN_SENTIMENT,
    sentimentColor,
  } from "../common";

const Legend=(props) => {
    const svgRef = useRef();
    var setting = {
        width: 550,
        height: 90,
        x : 10,
        y: 10,
    }

    const legendcon =d3.select(svgRef.current).attr("x",setting.x).attr("y",setting.y).attr("width",setting.width).attr("height",setting.height)
    let data = []
    for(let i = -100;i<=100;i++){
        data.push(i/100)
    }
    legendcon.append("g").selectAll("rect").data(data).enter().append("rect").attr("x",function(d,i){
        return 1*i+1;
    }).attr("y",20).attr("width",1)
    .attr("height",10).attr("fill",function(d){
        return sentimentColor(d);
    })
    legendcon.append("text").attr("x",60).attr("y",12).text("mean sentiment").attr("font-size","14px")
    legendcon.append("text").attr("x",0).attr("y",45).text("-1")
    legendcon.append("text").attr("x",190).attr("y",45).text("1")

    return (
        <div id="legend">
          <svg ref={svgRef} ></svg>
          <rect id="sample"></rect>
        </div>
      );
}
export default Legend;
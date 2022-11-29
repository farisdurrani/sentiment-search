
import { color } from "d3";
import React, { useEffect, useState, useRef, useMemo, Component } from "react";
import ReactApexChart from 'react-apexcharts'

import { sentimentColor } from "../common";




class ApexChart extends React.Component {
    constructor(props) {
    const colors=[]
    function getColor(value){
        //value from 0 to 1
        console.log(value);
        colors.push(sentimentColor(value));
        return sentimentColor(value);
    }
    
    function importData() {
        const raw_dataset = require("../data/getBagOfWordsDummy.json")["bagOfWords"];
        const dataset = raw_dataset.map((e) => ({
        x: e.word,
        y: +e.count,
        z: getColor(+e.meanSentiment),
        }));

        return dataset;
    }

    var data=importData();
    console.log('hello',data);

        
      super(props);

      this.state = {
          
        series: [
          {
            data: data,
          }
        ],
        options: {
          legend: {
            show: false
          },
          chart: {
            height: 350,
            type: 'treemap'
          },
          title: {
            text: 'Word Treemap (Most Occurances)',
            align: 'center'
          },
          colors: colors,
          plotOptions: {
            treemap: {
              distributed: true,
              enableShades: false
            }
          },

          markers: {
            onClick: function(e) {

              window.open('https://stackoverflow.com');
              // do something on marker click
            }
        }
          
        },
      
      
      };
    }

  

    render() {
      return (
        

  <div id="chart">
<ReactApexChart options={this.state.options} series={this.state.series} type="treemap" height={350} />
</div>


      );
    }
  }

export default ApexChart;

import { color } from "d3";
import React, { useEffect, useState, useRef, useMemo, Component } from "react";
import ReactApexChart from 'react-apexcharts'
import { sentimentColor } from "../common";
// import ReactDOM from 'react-dom';


class ApexChart extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [{
          name: 'Negative',
          data: [80, 50, 30, 40, 100, 20],
        }, {
          name: 'Positive',
          data: [20, 30, 40, 80, 20, 80],
        }, {
          name: 'Neutral',
          data: [44, 76, 78, 13, 43, 10],
        }],
        options: {
          chart: {
            height: 350,
            type: 'radar',
            dropShadow: {
              enabled: true,
              blur: 1,
              left: 1,
              top: 1
            },
            
          },
          colors: [sentimentColor(-1).slice(0,-1)+",0.4)",sentimentColor(1).slice(0,-1)+",0.4)",sentimentColor(0).slice(0,-1)+",0.4)"],
          title: {
            text: 'Radar Chart - Multi Series'
          },
          stroke: {
            colors: [sentimentColor(-1),sentimentColor(1),sentimentColor(0)],
            width: 2
          },
          fill: {
            opacity: 0.1
          },
          markers: {
            size: 0
          },
          xaxis: {
            categories: ['Facebook', 'NYT', 'Reddit', 'Twitter', 'CNN', 'The Guardian']
          }
        },
      
      
      };
    }

  

    render() {
      return (
        

  <div id="chart">
<ReactApexChart options={this.state.options} series={this.state.series} type="radar" height={1000} />
</div>


      );
    }
  }

//   const domContainer = document.querySelector('#app');
//   ReactDOM.render(React.createElement(ApexChart), domContainer);

  export default ApexChart;
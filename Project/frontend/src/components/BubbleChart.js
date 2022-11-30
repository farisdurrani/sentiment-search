
import { color } from "d3";
import React, { useEffect, useState, useRef, useMemo, Component } from "react";
import ReactApexChart from 'react-apexcharts'
import axios from "axios"
import { sentimentColor } from "../common";




class ApexChart extends React.Component {
    constructor(props) {

    
    
     
    const colors=[]
    function getColor(value){
        //value from 0 to 1
        //console.log(value);
        colors.push(sentimentColor(value));
        return sentimentColor(value);
    }
    
    function importData(item) {
        const raw_dataset = item["bagOfWords"];
        const dataset = raw_dataset.map((e) => ({
        x: e.word,
        y: +e.count,
        z: getColor(+e.meanSentiment),
        }));

        return dataset;
    }

      
            

    
    //('hello',data);

    
      super(props);

      this.state = {
        data: fetchData(),
        series: [
          {
            data: this.state.data,
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
          fill: {
            opacity: 0.8
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

      async function fetchData() {
        try {
          console.log('fetch')
          const result = await axios.get("http://127.0.0.1:8000/api/getBagOfWords?platform=facebook&limitAmountOfWords=10")
          
          const raw_dataset = result.data["bagOfWords"];
          const dataset = raw_dataset.map((e) => ({
          x: e.word,
          y: +e.count,
          z: getColor(+e.meanSentiment),
          }));
          console.log('data',dataset)
          this.state.data=dataset;
          return dataset;
        } catch (error) {
          console.error('ss',error);
        }
      }
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
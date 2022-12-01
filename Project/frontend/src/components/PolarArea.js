
import { color } from "d3";
import React, { useEffect, useState, useRef, useMemo, Component } from "react";
import ReactApexChart from 'react-apexcharts'
import { sentimentColor } from "../common";
// import ReactDOM from 'react-dom';

import { Container } from "react-bootstrap";



const PolarArea = (props) => {

console.log('ffff',props.dataset)
    

        const colors=[]
        const pos=[]
        const neg=[]
        const neu=[]
   

        function getAvg(grades) {
            const total = grades.reduce((acc, c) => acc + c, 0);
            return total / grades.length;
          }

        function getColor(value,count)
        {
            
            if(value<0)
            {
                //console.log('hi1');
                for(var i=0;i<count;i++)
                {
                    neg.push(value);
                }
                
            }

            else if(value>0)
            {
                //console.log('hi2');
                for(var i=0;i<count;i++)
                {
                    pos.push(value);
                }
                //console.log(pos)
            }
            
            else
            {
                //console.log('hi3');
                for(var i=0;i<count;i++)
                {
                    neu.push(value);
                }
            }

            return 0;
       
        }
        

       
      
        function importData() {
            const raw_dataset = props.dataset;
            const dataset = raw_dataset.map((e) => ({
            x: e.word,
            y: +e.count,
            z: getColor(+e.meanSentiment,+e.count),
            }));
    
            return dataset;
        }
    
        var data=importData();
        const pos_n=pos.length;
        const neg_n=neg.length;
        const neu_n=neu.length;

        const pos_v=getAvg(pos);
        const neg_v=getAvg(neg);
        const neu_v=getAvg(neu);

        const pos_c=sentimentColor(pos_v);
        const neg_c=sentimentColor(neg_v);
        const neu_c=sentimentColor(neu_v);

        console.log(1,data)

        console.log('colors',pos_c,neg_c,neu_c);


    
      

      var state = {
      
        series: [pos_n,neg_n,neu_n],
        options: {
          chart: {
            type: 'polarArea',
          },
          stroke: {
            colors: [pos_c,neg_c,neu_c]
          },
          colors: [pos_c,neg_c,neu_c],
          labels: ['Positive', 'Negative', 'Neutral'],
          fill: {
            opacity: 0.8
          },
          title: {
            text: 'Sentiment Polarity Distribution in Top Words | Platform: ' + props.platform,
            align: 'center'
          },
          responsive: [{
            breakpoint: 400,
            options: {
              chart: {
                width: 50
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        },
      
      
      };
    

  

   
      return (
        

        <Container>
<ReactApexChart options={state.options} series={state.series} type="polarArea" />




</Container>
      )
    

  }

//   const domContainer = document.querySelector('#app');
//   ReactDOM.render(React.createElement(ApexChart), domContainer);

  export default PolarArea;
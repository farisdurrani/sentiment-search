
import { color } from "d3";
import React, { useEffect, useState, useRef, useMemo, Component } from "react";
import ReactApexChart from 'react-apexcharts'
import axios from "axios"
import { sentimentColor } from "../common";




// class ApexChart extends React.Component {
    
  

//     constructor(props) {

    
      
     
    
//     //('hello',data);

    
//       super(props);

      // this.state = {
        
      //   series: [
      //     {
      //       data: props.series,
      //     }
      //   ],
      //   options: {
      //     legend: {
      //       show: false
      //     },
      //     chart: {
      //       height: 350,
      //       type: 'treemap'
      //     },
      //     title: {
      //       text: 'Word Treemap (Most Occurances)',
      //       align: 'center'
      //     },
      //     fill: {
      //       opacity: 0.8
      //     },
      //     colors: props.colors,
      //     plotOptions: {
      //       treemap: {
      //         distributed: true,
      //         enableShades: false
      //       }
      //     },

      //     markers: {
      //       onClick: function(e) {

      //         window.open('https://stackoverflow.com');
      //         // do something on marker click
      //       }
      //   }
          
      //   },
      
      
      // };

//     }



  

//     render() {

      

      
//       return (
        

//   <div id="chart">
// <ReactApexChart options={this.state.options} series={this.state.series} type="treemap" height={350} />
// </div>


//       );
//     }
//   }

// export default ApexChart;



const Timeline = (props) => {
  const [dataset, setDataset] = useState([]);
  const [colors, setColor] = useState([]);
  useMemo(() => importData(), []);

  const color=[]
  
    function getColor(value){
        //value from 0 to 1
        //console.log(value);
        color.push(sentimentColor(value));
        return sentimentColor(value);
    }
    
    
   
    useEffect(() => {
      // console.log('hidd')
      // if (dataset)  return (
        

      //   <div id="chart">
      // hi {/* <ReactApexChart series={{data:[1,2,3]}} type="treemap" height={350} /> */}
      // </div>
      // )

      // else
       console.log(dataset);

    //    return (
        

    //     <div id="chart">
        
    //  hi {/* <ReactApexChart series={[{data:[1,2,3]}]} type="treemap" height={350} />  */}
    //   </div>
    //   )
  
  
    }, [dataset,colors]);
function importData() {
    axios.get( "http://127.0.0.1:8000/api/getBagOfWords?platform=facebook&limitAmountOfWords=10").then((response) => {
      if (response.data.success) console.debug("Response 200 downloaded");
      else {
        console.debug("Backend call failed");
        return;
      }

    
        const raw_dataset = response.data["bagOfWords"];
        const dataset = raw_dataset.map((e) => ({
        x: e.word,
        y: +e.count,
        z: getColor(+e.meanSentiment),
        }));
        setDataset(dataset);
        setColor(color);

    
  

    
    
    
    console.log('hi',colors);
  }
    )
}


var state= {
        
  series: [
    {
      data: dataset,
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
    colors:colors,
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
      


    return (
        

      <div id="chart">
     
     <ReactApexChart options={state.options} series={state.series} type="treemap" height={350} />
    </div>
    )




}


Timeline.propTypes = {};

export default Timeline;
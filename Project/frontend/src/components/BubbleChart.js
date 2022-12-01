
import { color } from "d3";
import React, { useEffect, useState, useRef, useMemo, Component } from "react";
import ReactApexChart from 'react-apexcharts'
import axios from "axios"
import { sentimentColor } from "../common";
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { Container } from "react-bootstrap";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MuiInput from '@mui/material/Input';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { PolarArea } from ".";


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



const BubbleChart = (props) => {
  const [dataset, setDataset] = useState([]);
  const [rawdataset, setRawDataset] = useState([]);
  const [colors, setColor] = useState([]);
  const [value, setValue] = React.useState(10);
  const [platform,setPlatform] = useState('All');
  useMemo(() => importData(), [value,platform]);

  const color=[]
  
    function getColor(value){
        //value from 0 to 1
        //console.log(value);
        color.push(sentimentColor(value));
        return sentimentColor(value);
    }
    
    
   
    useEffect(() => {
   
       console.log(dataset);

   
  
  
    }, [dataset,colors,value]);

    
    
function importData() {
  var params = {
    
   
    limitAmountOfWords: value
  };
console.log(platform)
  if (platform!='All'){
     
    params = {
    platform:platform,
    // orderDescending: "false",
    // startDate: "2015-12-31",
    // endDate: "2016-12-31",
    limitAmountOfWords: value
  };

  }

    axios.get( 'http://127.0.0.1:8000/api/getBagOfWords', { params }).then((response) => {
      if (response.data.success) console.debug("Response 200 downloaded");
      else {
        console.debug("Backend call failed");
        return;
      }

    
        const raw_dataset = response.data["bagOfWords"];
        setRawDataset(raw_dataset);
        const dataset = raw_dataset.map((e) => ({
        x: e.word,
        y: +e.count,
        z: getColor(+e.meanSentiment),
        }));
        setDataset(dataset);
        setColor(color);

    
  

    
    
    
    console.log('hello',response);
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
      type: 'treemap',
      foreColor: '#fff'

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

const handleChange = (event, newValue) => {
  setValue(newValue);
};
const Input = styled(MuiInput)`
  width: 42px;
`;



  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

    return (
      

<Container>

 <Box sx={{ width: 250 }}>
      <Typography id="input-slider" gutterBottom>
        Top Words
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
       
        </Grid>
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
        <ButtonGroup variant="outlined" aria-label="outlined primary button group">
        <Button onClick={() => {setPlatform('All')}}>All</Button>
      <Button onClick={() => {setPlatform('Facebook')}}>Facebook</Button>
      <Button onClick={() => {setPlatform('Reddit')}}>Reddit</Button>
      <Button onClick={() => {setPlatform('twitter')}}>Twitter</Button>
      <Button onClick={() => {setPlatform('The Guardian')}}>The Guardian</Button>
      <Button onClick={() => {setPlatform('CNN')}}>CNN</Button>
      <Button onClick={() => {setPlatform('The New York Times')}}>New York Times</Button>
    </ButtonGroup>
      </Grid>
      Platform: {platform}
    </Box>
<ReactApexChart options={state.options} series={state.series} type="treemap" height={350} />
{/* <FrequencyChart className="mt-5"/> */}
<PolarArea platform={platform} dataset={rawdataset} />
</Container>

    )




}


BubbleChart.propTypes = {};

export default BubbleChart;
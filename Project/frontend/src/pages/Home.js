import React, { useEffect, useState, useRef } from "react";
import { Container } from "react-bootstrap";
import {
  Timeline,
  ExampleSVG,
  Spacer,
  BubbleChart,
  PolarArea,
  SearchBar,
  Radar,
  FrequencyChart,
} from "../components/index";

const Home = () => {
  const [hoveredFrequencies, setHoveredFrequencies] = useState();
  const searchRef = useRef();

  return (
    <Container id="home">
      <SearchBar searchRef={searchRef} />
      <Timeline
        className="mt-5"
        searchRef={searchRef}
        setHoveredFrequencies={setHoveredFrequencies}
      />
      <FrequencyChart className="mt-5" hoveredFrequencies={hoveredFrequencies}/>
      <Spacer height={100}/>
      <BubbleChart className="mt-5" />
      {/* <PolarArea className="mt-5" />
      <Radar className="mt-5" /> */}
    </Container>
  );
};

export default Home;

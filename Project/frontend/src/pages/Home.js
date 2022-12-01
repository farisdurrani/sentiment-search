import React, { useEffect, useState, useRef } from "react";
import { Container } from "react-bootstrap";
import { DEFAULT_SEARCH_TERM } from "../common";
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
  const [searchTerm, setSearchTerm] = useState(DEFAULT_SEARCH_TERM);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Container id="home">
      <SearchBar setSearchTerm={setSearchTerm} isLoading={isLoading} />
      <Timeline
        className="mt-5"
        searchTerm={searchTerm}
        setHoveredFrequencies={setHoveredFrequencies}
        setIsLoading={setIsLoading}
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

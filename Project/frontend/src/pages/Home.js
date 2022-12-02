import React, { useEffect, useState, useRef } from "react";
import { Container, Col, Row } from "react-bootstrap";
import {
  ALL_PLATFORMS,
  DEFAULT_SEARCH_TERM,
  DEF_END_DATE,
  DEF_START_DATE,
} from "../common";
import {
  Timeline,
  ExampleSVG,
  Spacer,
  BubbleChart,
  PolarArea,
  SearchBar,
  Radar,
  FrequencyChart,
  Legend,
  Description,
} from "../components/index";

const Home = () => {
  const [hoveredFrequencies, setHoveredFrequencies] = useState();
  const [searchOptions, setSearchOptions] = useState({
    searchTerm: DEFAULT_SEARCH_TERM,
    startDate: DEF_START_DATE,
    endDate: DEF_END_DATE,
    selectedPlatform: ALL_PLATFORMS[0],
  });
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Container id="home">
      <SearchBar setSearchOptions={setSearchOptions} isLoading={isLoading} />
      <hr className="sep" />

      <Spacer height={20} />
      <Description
        text="Welcome to Sentiment Search. Providing a visual analysis of the
        Internet's sentiment for a keyword"
      />
      <Spacer height={20} />

      <div className="d-flex flex-row justify-content-between align-items-center mb-3 w-75 mx-auto">
        <Legend />
        <Description
          text={`A media post's sentiment can be very <b>negative</b> (-1), all the way to being very <b>positive</b> (1).`}
          className="w-25"
          pStyle={{ textAlign: "right" }}
        />
      </div>

      <Timeline
        className="mt-5"
        searchOptions={searchOptions}
        setHoveredFrequencies={setHoveredFrequencies}
        setIsLoading={setIsLoading}
      />
      <FrequencyChart
        className="mt-5"
        hoveredFrequencies={hoveredFrequencies}
      />
      <Spacer height={100} />
      <BubbleChart className="mt-5" startDate={searchOptions.startDate} endDate={searchOptions.endDate} />
      {/* <PolarArea className="mt-5" />
      <Radar className="mt-5" /> */}
    </Container>
  );
};

export default Home;

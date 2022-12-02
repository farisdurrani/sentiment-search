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

      <Description
        text="Welcome to Sentiment Search. <br/> Providing a visual analysis of the
        Internet's sentiment from 2015-2022 for any keywords."
      />
      <Spacer height={20} />

      <div className="d-flex flex-row justify-content-between align-items-center mb-3 w-75 mx-auto">
        <Legend />
        <Description
          text={`A media post's sentiment can be very <b>negative</b> (-1), all the way to being very <b>positive</b> (1).<br/>
          The better the feeling of reading a post, the bluer the color.`}
          className="w-25"
          pStyle={{ textAlign: "right" }}
        />
      </div>

      <hr className="sep" />
      <Description
        text={`This graph shows the count of posts with the keywords you added over time. The colors reflect the average sentiment per day. <br/>
        The circles denote significant events. <b>Hover</b> over to read.`}
      />
      <Timeline
        className="mt-5"
        searchOptions={searchOptions}
        setHoveredFrequencies={setHoveredFrequencies}
        setIsLoading={setIsLoading}
      />

      <hr className="sep" />
      <Description text="As you <b>hover</b> above, this graph below shows the breakdowns of posts per platform, along with the average sentiment per platform." />
      <FrequencyChart
        className="mt-5"
        hoveredFrequencies={hoveredFrequencies}
      />

      <Spacer height={100} />
      {/* <BubbleChart className="mt-5" startDate={searchOptions.startDate} endDate={searchOptions.endDate} /> */}
      {/* <PolarArea className="mt-5" />
      <Radar className="mt-5" /> */}
    </Container>
  );
};

export default Home;

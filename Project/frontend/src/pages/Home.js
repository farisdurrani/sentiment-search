import React, { useEffect, useState, useRef } from "react";
import { Button, Container, Form } from "react-bootstrap";
import {
  Timeline,
  ExampleSVG,
  Spacer,
  BubbleChart,
  PolarArea,
  SearchBar,
} from "../components/index";

const Home = () => {
  const searchRef = useRef();
  return (
    <Container id="home">
      <SearchBar searchRef={searchRef} />
      <Timeline className="mt-5" searchRef={searchRef} />
      <BubbleChart className="mt-5" />
      <PolarArea className="mt-5" />
    </Container>
  );
};

export default Home;

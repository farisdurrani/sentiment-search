import React, { useEffect, useState, useRef } from "react";
import { Button, Container } from "react-bootstrap";
import { Timeline, ExampleSVG } from "../components/index";

const Home = () => {
  return (
    <Container>
      <h1>Hello Frontend World</h1>
      <Button>Hello</Button>
      <Timeline />
      <ExampleSVG />
    </Container>
  );
};

export default Home;

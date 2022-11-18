import React, { useEffect, useState, useRef } from "react";
import { Button, Container } from "react-bootstrap";
import { Timeline } from "../components/index";

const Home = () => {
  return (
    <Container>
      <h1>Hello Frontend World</h1>
      <Button>Hello</Button>
      <Timeline />
    </Container>
  );
};

export default Home;

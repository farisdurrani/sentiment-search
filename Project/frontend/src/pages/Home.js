import React, { useEffect, useState, useRef } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Timeline, ExampleSVG, Spacer,BubbleChart,PolarArea } from "../components/index";

const Home = () => {
  const searchRef = useRef();
  return (
    <Container id="home">
      <div className="text-center mt-5">
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>
              <h1>Sentiment Search</h1>
            </Form.Label>
            <Form.Control
              disabled
              className="main-search m-auto"
              type="text"
              placeholder="🔍"
              defaultValue="Trump"
              ref={searchRef}
            />
          </Form.Group>
        </Form>
        <Button className="comfortable">Analyze</Button>
      </div>
      <Timeline className="mt-5"/>
      <BubbleChart className="mt-5"/>
      <PolarArea className="mt-5"/>
    </Container>
  );
};

export default Home;

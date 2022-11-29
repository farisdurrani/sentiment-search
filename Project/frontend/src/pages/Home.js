import React, { useEffect, useState, useRef } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Timeline, ExampleSVG, Spacer } from "../components/index";

const Home = () => {
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
              value="Trump"
            />
          </Form.Group>
        </Form>
        <Button className="comfortable">Analyze</Button>
      </div>
      <Timeline className="mt-5"/>
    </Container>
  );
};

export default Home;

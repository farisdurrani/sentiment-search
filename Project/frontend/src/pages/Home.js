import React, { useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import axios from "axios";

const Home = () => {
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:8000`);
      console.log(res);
    };
    fetchData();
  }, []);

  return (
    <Container>
      <h1>Hello Frontend World</h1>
      <Button>Hello</Button>
    </Container>
  );
};

export default Home;

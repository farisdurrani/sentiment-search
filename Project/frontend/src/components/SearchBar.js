import React from "react";
import PropTypes from "prop-types";
import { Button, Container, Form } from "react-bootstrap";

const SearchBar = (props) => {
  const { searchRef } = props;
  return (
    <div id="search-bar" className="text-center mt-5">
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
  );
};

SearchBar.propTypes = {};

export default SearchBar;

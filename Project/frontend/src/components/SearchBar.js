import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Button, Container, Form } from "react-bootstrap";
import { DEFAULT_SEARCH_TERM } from "../common";

const SearchBar = (props) => {
  const { setSearchTerm } = props;
  const searchRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchRef.current.value);
  };

  return (
    <div id="search-bar" className="text-center mt-5">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>
            <h1>Sentiment Search</h1>
          </Form.Label>
          <Form.Control
            disabled
            className="main-search m-auto"
            type="text"
            placeholder="🔍"
            defaultValue={DEFAULT_SEARCH_TERM}
            ref={searchRef}
          />
        </Form.Group>
        <Button className="comfortable" type="submit">
          Analyze
        </Button>
      </Form>
    </div>
  );
};

SearchBar.propTypes = {};

export default SearchBar;

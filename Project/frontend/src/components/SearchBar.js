import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Button, Container, Form, Accordion, Col, Row } from "react-bootstrap";
import { DEFAULT_SEARCH_TERM, DEF_END_DATE, DEF_START_DATE } from "../common";

const SearchBar = (props) => {
  const { setSearchTerm, isLoading } = props;
  const searchRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchRef.current.value);
  };

  return (
    <div id="search-bar" className="text-center mt-5">
      <Form onSubmit={handleSubmit}>
        <Form.Label>
          <h1>Sentiment Search</h1>
        </Form.Label>
        <Form.Control
          className="main-search m-auto mb-3"
          type="text"
          placeholder="🔍"
          defaultValue={DEFAULT_SEARCH_TERM}
          ref={searchRef}
        />
        <Button className="comfortable mb-3" type="submit" disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Analyze"}
        </Button>
        <Accordion defaultEventKey="0" flush className="search-options">
          <Accordion.Item eventKey="0">
            <Accordion.Header className="search-options-header">
              Advanced search
            </Accordion.Header>
            <Accordion.Body>
              <Form.Group className="d-flex flex-row justify-content-around">
                <Row className="w-25">
                  <Form.Label>Start date</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={DEF_START_DATE.toLocaleDateString()}
                  />
                </Row>
                <Row className="w-25">
                  <Form.Label>End date</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={DEF_END_DATE.toLocaleDateString()}
                  />
                </Row>
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Form>
    </div>
  );
};

SearchBar.propTypes = {};

export default SearchBar;

import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Button, Container, Form, Accordion, Col, Row } from "react-bootstrap";
import { DEFAULT_SEARCH_TERM, DEF_END_DATE, DEF_START_DATE } from "../common";
import { toast } from "react-toastify";

const SearchBar = (props) => {
  const { setSearchOptions, isLoading } = props;

  const searchRef = useRef();
  const startDateRef = useRef();
  const endDateRef = useRef();

  const validateInputs = () => {
    const startDate = startDateRef.current.value;
    const endDate = endDateRef.current.value;

    const validateDate = (date) => {
      if (date === "") return true;
      return new Date(date).toString() !== "Invalid Date";
    };

    if (!(validateDate(startDate) && validateDate(endDate))) {
      toast.error("Invalid date format", { autoClose: 1000 });
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setSearchOptions({
      serachTerm: searchRef.current.value,
      startDate: new Date(startDateRef.current.value) || DEF_START_DATE,
      endDateTerm: new Date(endDateRef.current.value) || DEF_END_DATE,
    });
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
        <Accordion flush className="search-options">
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
                    ref={startDateRef}
                  />
                </Row>
                <Row className="w-25">
                  <Form.Label>End date</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={DEF_END_DATE.toLocaleDateString()}
                    ref={endDateRef}
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

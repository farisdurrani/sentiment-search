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

    const [startDate, endDate] = [
      startDateRef.current.value
        ? new Date(startDateRef.current.value)
        : DEF_START_DATE,
      endDateRef.current.value
        ? new Date(endDateRef.current.value)
        : DEF_END_DATE,
    ];

    setSearchOptions({
      searchTerm: searchRef.current.value,
      startDate: startDate,
      endDate: endDate,
    });
  };

  const ALL_PLATFORMS = [
    "All",
    "CNN",
    "The Guardian",
    "Facebook",
    "Twitter",
    "Reddit",
    "The New York Times",
  ];

  const PlatformSelection = (
    <>
      <Row>
        <Form.Label>Platform</Form.Label>
        <div className="row w-50 m-auto">
          <Form.Select aria-label="Default select example">
            {ALL_PLATFORMS.map((e) => (
              <option key={e} value={e} label={e}/>
            ))}
          </Form.Select>
        </div>
      </Row>
    </>
  );

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
        <Accordion defaultActiveKey="0" flush className="search-options">
          <Accordion.Item eventKey="0">
            <Accordion.Header className="search-options-header">
              Advanced search
            </Accordion.Header>
            <Accordion.Body>
              <Form.Group>
                <Row className="d-flex flex-row justify-content-around">
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
                </Row>

                {PlatformSelection}
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

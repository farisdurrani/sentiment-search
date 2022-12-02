import React from "react";
import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const NavbarMain = (props) => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="home">
          Sentiment Search: Make the Internet your Focus Group
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="home">Home</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

NavbarMain.propTypes = {};

export default NavbarMain;

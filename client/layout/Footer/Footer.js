import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Footer.scss";

export default class Footer extends Component {
  render() {
    return (
      <Navbar className="Footer mt-5" bg="light" variant="light" expand="lg">
        <Nav className="mr-auto justify-content-start">
          <Nav.Item>Made with ❤️ in 2020</Nav.Item>
        </Nav>
        <Nav className="ml-auto justify-content-end">
          <Nav.Link href="/about">About</Nav.Link>
        </Nav>
        {/* <Form className="ml-auto">
          <FormControl
            type="text"
            placeholder="Signup for newsletter"
            size="sm"
            className="mr-sm-2"
          />
        </Form> */}
      </Navbar>
    );
  }
}

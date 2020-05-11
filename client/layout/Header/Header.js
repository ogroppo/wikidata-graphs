import React, { Component } from "react";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import { withTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { FaWikipediaW } from "react-icons/fa";
import "./Header.scss";

class Header extends Component {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <Navbar className="Header" bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="/">
          <img className="logo" src="/wikidata.png" /> Wikidata Graphs
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/timelines">Timelines</Nav.Link>
            <Nav.Link href="/trees">Trees</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withTracker(() => {
  return {
    user: Meteor.user(),
  };
})(Header);

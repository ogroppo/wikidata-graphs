import React, { Component } from "react";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import { withTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { FaChild } from "react-icons/fa";

class Header extends Component {
  componentDidMount() {}

  componentWillUnmount() {}

  logout = () => {
    Meteor.logout();
  };

  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            Lol.com <FaChild className="mb-1" />
          </Navbar.Brand>
          <div className="ml-auto">
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              {this.props.user ? (
                <Dropdown>
                  <Dropdown.Toggle variant="info" id="dropdown-basic">
                    {this.props.user.emails[0].address}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                    <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Link to="/login" className="btn btn-sm btn-primary">
                    Login
                  </Link>
                  <span>&nbsp;or&nbsp;</span>
                  <Link to="/signup" className="btn btn-sm btn-light">
                    Sign Up
                  </Link>
                </>
              )}
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    );
  }
}

export default withTracker(() => {
  return {
    user: Meteor.user(),
  };
})(Header);

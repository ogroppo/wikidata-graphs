import React, { Component } from "react";
import Header from "../../layout/Header/Header";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Footer from "../../layout/Footer/Footer";

export default class NotFound extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className="NotFound">
        <Header />
        <Container className="mt-4">
          <h1>404 - Page not found</h1>
          <Link to="/">Back to homepage</Link>
        </Container>
        <Footer />
      </div>
    );
  }
}

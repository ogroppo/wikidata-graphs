import React, { Component } from "react";
import Header from "../../layout/Header/Header";
import { Container } from "react-bootstrap";

export default class NotFound extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className="NotFound">
        <Header />
        <Container>
          <h1>404 - Page not found</h1>
        </Container>
      </div>
    );
  }
}

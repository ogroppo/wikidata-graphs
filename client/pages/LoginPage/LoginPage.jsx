import React, { Component } from "react";
import Header from "../../layout/Header/Header";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { Redirect, useLocation } from "react-router";
import { withTracker } from "meteor/react-meteor-data";

class LoginPage extends Component {
  state = {
    submitDisabled: true,
  };

  componentDidMount() {}

  onSubmit = (e) => {
    e.preventDefault();
    let { from } = location.state || { from: { pathname: "/" } };
    const { email, password } = this.state;
    Meteor.loginWithPassword({ email }, password, () => {
      //history.replace(from)
    });
  };

  setEmail = (e) => {
    this.setState(
      {
        email: e.target.value,
      },
      this.canSubmit
    );
  };

  setPassword = (e) => {
    this.setState(
      {
        password: e.target.value,
      },
      this.canSubmit
    );
  };

  canSubmit = () => {
    const { email, password } = this.state;

    this.setState({
      submitDisabled: !email || !password,
    });
  };

  render() {
    const { submitDisabled } = this.state;
    const { loggingIn, user } = this.props;

    if (loggingIn) return null;

    if (user) return <Redirect to="/" />;

    return (
      <div className="LoginPage">
        <Header />
        <Container>
          <Row className="justify-content-md-center">
            <Col md={6}>
              <h1>Login</h1>
              <Form onSubmit={this.onSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    onChange={this.setEmail}
                    name="email"
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    onChange={this.setPassword}
                  />
                </Form.Group>
                <div className="float-right">
                  <Button
                    disabled={submitDisabled}
                    type="submit"
                    className="ml-2"
                    variant="primary"
                  >
                    Login
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    loggingIn: Meteor.loggingIn(),
    user: Meteor.user(),
  };
})(LoginPage);

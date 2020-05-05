import React, { Component } from "react";
import Header from "../../layout/Header/Header";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Accounts } from "meteor/accounts-base";
import { Redirect } from "react-router";
import { withTracker } from "meteor/react-meteor-data";

class SignupPage extends Component {
  state = {
    submitDisabled: true,
  };

  componentDidMount() {}

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

  setConfirmPassword = (e) => {
    this.setState(
      {
        confirmPassword: e.target.value,
      },
      this.canSubmit
    );
  };

  canSubmit() {
    const { email, password, confirmPassword } = this.state;
    this.setState({
      submitDisabled:
        !email || !password || !confirmPassword || password !== confirmPassword,
    });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    Accounts.createUser(
      {
        email,
        password,
      },
      (err) => {
        console.error(err);

        //history.replace("/")
      }
    );
  };

  render() {
    const { submitDisabled } = this.state;
    const { loggingIn, user } = this.props;
    if (loggingIn) return null;

    if (user) return <Redirect to="/" />;

    return (
      <div className="SignupPage">
        <Header />
        <Container>
          <Row className="justify-content-md-center">
            <Col md={6}>
              <h1>Sign up</h1>
              <Form onSubmit={this.onSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" onChange={this.setEmail} />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" onChange={this.setPassword} />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    onChange={this.setConfirmPassword}
                  />
                </Form.Group>
                <div className="float-right">
                  <Button
                    disabled={submitDisabled}
                    type="submit"
                    className="ml-2"
                    variant="primary"
                  >
                    Sign up
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
})(SignupPage);

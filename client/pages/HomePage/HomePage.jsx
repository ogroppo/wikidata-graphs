import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../../layout/Header/Header.jsx";

const HomePage = ({ user }) => (
  <div className="HomePage">
    <Header />
    <Container>
      <h1>Welcome to lol.com</h1>
      <h2>What do we value</h2>
      <p>Privacy</p>
      <p>Accuracy</p>
      <p>user: {user ? user : "no user"}</p>
    </Container>
  </div>
);

export default withTracker(() => {
  return {
    user: Meteor.user(),
  };
})(HomePage);

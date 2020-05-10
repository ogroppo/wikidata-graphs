import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../../layout/Header/Header";
//import "./TimelinesPage.scss";

const TimelinesPage = ({ user }) => (
  <div className="TimelinesPage">
    <Header />
    <div className="fullContainer">
      <h1>Available Timelines</h1>
      <p>
        <Link to={"/timeline/historical-countries"}>Historical Countries</Link>
      </p>
    </div>
  </div>
);

export default withTracker(() => {
  return {
    user: Meteor.user(),
  };
})(TimelinesPage);

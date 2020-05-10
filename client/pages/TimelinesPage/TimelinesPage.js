import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import ReactGA from "react-ga";
import { Link } from "react-router-dom";
import Header from "../../layout/Header/Header";
//import "./TimelinesPage.scss";

class TimelinesPage extends Component {
  componentDidMount() {
    ReactGA.set({ page: this.props.location.pathname });
    ReactGA.pageview(this.props.location.pathname);
  }

  render() {
    return (
      <div className="TimelinesPage">
        <Header />
        <div className="fullContainer">
          <h1>Available Timelines</h1>
          <p>
            <Link to={"/timeline/historical-countries"}>
              Historical Countries
            </Link>
          </p>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    user: Meteor.user(),
  };
})(TimelinesPage);

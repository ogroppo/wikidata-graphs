import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import Header from "../../layout/Header/Header";
import { MdTimeline } from "react-icons/md";
import "./HomePage.scss";
import ReactGA from "react-ga";

class HomePage extends Component {
  componentDidMount() {
    ReactGA.set({ page: this.props.location.pathname });
    ReactGA.pageview(this.props.location.pathname);
  }

  render() {
    return (
      <div className="HomePage">
        <Header />
        <div className="fullContainer">
          <h1>Welcome to Wikidata driven graphs</h1>
          <p>Choose one of the categories below</p>
          <p>
            <Link to={"/timelines"}>
              <MdTimeline className="mr-2" />
              Timelines
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
})(HomePage);

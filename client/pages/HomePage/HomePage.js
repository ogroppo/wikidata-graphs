import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import { MdTimeline } from "react-icons/md";
import { GiFamilyTree } from "react-icons/gi";
import "./HomePage.scss";
import ReactGA from "react-ga";
import { FaMapSigns } from "react-icons/fa";

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
          <p>
            <Link to={"/trees"}>
              <GiFamilyTree className="mr-2" />
              Trees
            </Link>
          </p>
          <p>
            <Link to={"/maps"}>
              <FaMapSigns className="mr-2" />
              Maps
            </Link>
          </p>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    user: Meteor.user(),
  };
})(HomePage);

import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import ReactGA from "react-ga";
import { Link } from "react-router-dom";
import Header from "../../layout/Header/Header";
import "./AboutPage.scss";
import Footer from "../../layout/Footer/Footer";

export default class AboutPage extends Component {
  componentDidMount() {
    ReactGA.set({ page: this.props.location.pathname });
    ReactGA.pageview(this.props.location.pathname);
  }

  render() {
    return (
      <div className="AboutPage">
        <Header />
        <div className="fullContainer">
          <h1>About</h1>
          <p>
            This project is a subset of graphledge.com, a broader effort to
            offer data visualisations for an opinionated Knowledge Base.
          </p>
          <p>
            Started and Developed by{" "}
            <a href="mailto:orlando.groppo@gmail.com">Orlando</a>.
          </p>
        </div>
        <Footer />
      </div>
    );
  }
}

import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import ReactGA from "react-ga";
import { Link } from "react-router-dom";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
//import "./TreesPage.scss";

export default class TreesPage extends Component {
  componentDidMount() {
    ReactGA.set({ page: this.props.location.pathname });
    ReactGA.pageview(this.props.location.pathname);
  }

  render() {
    return (
      <div className="TreesPage">
        <Header />
        <div className="fullContainer">
          <h1>Available Trees</h1>
          <p>
            <Link to={"/tree/family-tree-explorer"}>Family Tree Explorer</Link>
          </p>
        </div>
        <Footer />
      </div>
    );
  }
}

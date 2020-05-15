import React, { Component } from "react";
import ReactGA from "react-ga";
import { Link } from "react-router-dom";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
//import "./MapsPage.scss";

export default class MapsPage extends Component {
  componentDidMount() {
    ReactGA.set({ page: this.props.location.pathname });
    ReactGA.pageview(this.props.location.pathname);
  }

  render() {
    return (
      <div className="MapsPage">
        <Header />
        <div className="fullContainer">
          <h1>Available Maps</h1>
          <p>
            <Link to={"/map/nearest-battle"}>Nearest Battle</Link>
          </p>
        </div>
        <Footer />
      </div>
    );
  }
}

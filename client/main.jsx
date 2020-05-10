import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
import { renderRoutes } from "./routes";
import "./vendor/bootstrap.min.css";
import "./main.scss";
import ReactGA from "react-ga";

ReactGA.initialize("UA-166019397-1");

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById("react-target"));
});

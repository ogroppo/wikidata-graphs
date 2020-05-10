import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
import { renderRoutes } from "./routes";
import "./vendor/bootstrap.min.css";
import "./main.scss";

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById("react-target"));
});

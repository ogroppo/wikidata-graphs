import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
import { renderRoutes } from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById("react-target"));
});

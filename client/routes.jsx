import React from "react";
import { Router, Route, Switch } from "react-router";
import { createBrowserHistory } from "history";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import NotFound from "./pages/NotFound/NotFound";
import TimelinesPage from "./pages/TimelinesPage/TimelinesPage";
import HistoricalCountries from "./pages/HistoricalCountries/HistoricalCountries";
import TreesPage from "./pages/TreesPage/TreesPage";
import FamilyTree from "./pages/FamilyTree/FamilyTree";
import AboutPage from "./pages/AboutPage/AboutPage";
import MapsPage from "./pages/MapsPage/MapsPage";
import NearestBattle from "./pages/NearestBattle/NearestBattle";

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/timelines" component={TimelinesPage} />
      <Route
        exact
        path="/timeline/historical-countries"
        component={HistoricalCountries}
      />
      <Route exact path="/trees" component={TreesPage} />
      <Route exact path="/tree/family-tree-explorer" component={FamilyTree} />
      <Route exact path="/maps" component={MapsPage} />
      <Route exact path="/map/battles-near-me" component={NearestBattle} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/signup" component={SignupPage} />
      <Route exact path="/about" component={AboutPage} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);

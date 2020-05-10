import React from "react";
import { Router, Route, Switch } from "react-router";
import { createBrowserHistory } from "history";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import NotFound from "./pages/NotFound/NotFound";
import TimelinesPage from "./pages/TimelinesPage/TimelinesPage";
import HistoricalCountries from "./pages/HistoricalCountries/HistoricalCountries";

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
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/signup" component={SignupPage} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);

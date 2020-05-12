import React, { Component } from "react";
import ReactGA from "react-ga";
import { Link } from "react-router-dom";
import Header from "../../layout/Header/Header";
import { Form, Dropdown, Button, Spinner, Alert } from "react-bootstrap";
import { BsPersonSquare } from "react-icons/bs";
import wdk from "wikidata-sdk";
import _ from "underscore";

import "./FamilyTree.scss";
import FamilyTreeGraph from "./FamilyTreeGraph";

export default class FamilyTree extends Component {
  state = {
    loadingSuggestions: false,
    searchValue: "",
    searchResults: [],
    showSuggesstions: false,
  };
  componentDidMount() {
    ReactGA.set({ page: this.props.location.pathname });
    ReactGA.pageview(this.props.location.pathname);
  }

  onChange = (e) => {
    let searchValue = e.target.value;
    this.setState(
      {
        searchValue,
        showSuggesstions: true,
      },
      this.lazySearch
    );
  };

  search = (label) => {
    let query = `
    SELECT ?item ?itemLabel ?itemDescription ?img ?genderLabel ?familyNameLabel WHERE {
      ?item wdt:P31 wd:Q5.
      ?item ?label '${label}'@en .
      optional { ?item wdt:P734 ?familyName . }
      optional { ?item wdt:P18 ?img . }
      optional { ?item wdt:P21 ?gender . }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    LIMIT 10
    `;

    const url = wdk.sparqlQuery(query);

    fetch(url)
      .then((response) => response.json())
      .then(wdk.simplify.sparqlResults)
      .then((searchResults) => {
        this.setState({
          searchResults: this.formatResults(searchResults),
          loadingSuggestions: false,
        });
      });
  };

  lazySearch = _.debounce(() => {
    this.setState({
      loadingSuggestions: true,
    });

    let titleCaseSearch =
      this.state.searchValue.length > 1
        ? this.state.searchValue
            .split(" ")
            .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
            .join(" ")
        : this.state.searchValue.toUpperCase;

    this.search(titleCaseSearch);
  }, 300);

  formatResults = (results) => {
    let formatted = [];
    results.forEach(({ item, ...rest }) => {
      formatted.push({
        ...rest,
        ...item,
      });
    });
    return formatted;
  };

  goToPerson = (root) => {
    this.setState({
      searchValue: root.label,
      searchResults: [],
      showSuggesstions: false,
      root,
    });
  };

  render() {
    const {
      searchValue,
      searchResults,
      root,
      loadingSuggestions,
      showSuggesstions,
    } = this.state;
    return (
      <div className="FamilyTree">
        <Header />
        <div className="fullContainer">
          <h1>Family Tree</h1>
          <Form onSubmit={(e) => e.preventDefault()} autoComplete="off">
            <Form.Group className="searchGroup" controlId="searchPerson">
              <Form.Label>
                Search for someone and click on a suggestion
              </Form.Label>
              <Form.Control
                type="search"
                placeholder="e.g. Sebastian Bach, Elon Musk, Mozart, Picasso, Micheal Jackson, Madonna"
                onChange={this.onChange}
                value={searchValue}
              ></Form.Control>
              <div
                style={{
                  display: showSuggesstions ? "block" : "none",
                }}
                className="dropdown-menu show d-relative"
              >
                {loadingSuggestions && (
                  <div className="searchingMessage">
                    <Spinner animation="border" variant="secondary" /> Searching
                    for name...
                  </div>
                )}
                {!loadingSuggestions && !searchResults.length && (
                  <div className="searchingMessage">
                    Sorry, no results found
                  </div>
                )}
                {searchResults.map((result, index) => (
                  <div key={index}>
                    <Button
                      className="searchResultBtn"
                      variant="link"
                      onClick={() => this.goToPerson(result)}
                    >
                      {result.label}
                      {result.description && <i>({result.description})</i>}
                    </Button>
                  </div>
                ))}
              </div>
            </Form.Group>
            {root ? (
              <FamilyTreeGraph root={root} goToPerson={this.goToPerson} />
            ) : (
              <Alert variant="info">
                Hint: if you search by full name the results will be more
                accurate.
              </Alert>
            )}
          </Form>
        </div>
      </div>
    );
  }
}

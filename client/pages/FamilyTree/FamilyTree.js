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
import Footer from "../../layout/Footer/Footer";
import searchPersonQuery from "./searchPersonQuery";

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

    if (this.props.location.hash) {
      this.search(decodeURI(this.props.location.hash.substr(1)), (results) => {
        if (results[0]) {
          this.goToPerson(results[0]);
        }
      });
    }
  }

  onChange = (e) => {
    let searchValue = e.target.value;
    this.setState(
      {
        searchValue,
        showSuggesstions: searchValue.length,
      },
      this.lazySearch
    );
  };

  search = (label, cb) => {
    searchPersonQuery(label)
      .then((searchResults) => {
        if (cb) {
          cb(searchResults);
        } else {
          this.setState({
            searchResults,
            loadingSuggestions: false,
          });
        }
      })
      .catch((error) => this.setState({ error, showSuggesstions: false }));
  };

  lazySearch = _.debounce(() => {
    this.setState({
      loadingSuggestions: true,
    });

    const { searchValue } = this.state;

    if (!searchValue) return;
    let titleCaseSearch = this.state.searchValue
      .split(" ")
      .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
      .join(" ");

    this.search(titleCaseSearch);
  }, 300);

  goToPerson = (root) => {
    this.props.history.push("#" + root.itemLabel);
    this.setState({
      searchValue: root.itemLabel,
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
      error,
    } = this.state;
    return (
      <div className="FamilyTree">
        <Header />
        <div className="fullContainer">
          <h1>Family Tree Explorer</h1>
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
                  <div key={result.id}>
                    <Button
                      className="searchResultBtn"
                      variant="link"
                      onClick={() => this.goToPerson(result)}
                    >
                      {result.itemLabel}
                      {result.itemDescription && (
                        <i>({result.itemDescription})</i>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </Form.Group>
          </Form>
          {error && <Alert variant="danger">{error.message}</Alert>}
          {root ? (
            <>
              <FamilyTreeGraph root={root} goToPerson={this.goToPerson} />
              <div className="mt-4">
                <h2>{root.itemLabel}</h2>
                <p>{root.itemDescription}</p>
                <p>
                  See on Wikidata:&nbsp;
                  <a
                    href={`https://www.wikidata.org/wiki/${root.id}`}
                  >{`https://www.wikidata.org/wiki/${root.id}`}</a>
                </p>
              </div>
            </>
          ) : (
            <Alert variant="info">
              Hint: if you search by full name the results will be more
              accurate.
            </Alert>
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

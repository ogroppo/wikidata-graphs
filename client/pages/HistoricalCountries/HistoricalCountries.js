import React, { Component } from "react";
import ReactGA from "react-ga";
import wdk from "wikidata-sdk";
import "./HistoricalCountries.scss";
import moment from "moment";

import Header from "../../layout/Header/Header";
import { Badge } from "react-bootstrap";

export default class HistoricalCountries extends Component {
  state = {
    withDate: [],
    withoutDate: [],
    loading: true,
  };

  timelineRef = React.createRef();

  componentDidMount() {
    ReactGA.set({ page: this.props.location.pathname });
    ReactGA.pageview(this.props.location.pathname);
    this.getData();
  }

  getData = () => {
    this.query = `SELECT DISTINCT ?item ?itemLabel ?img ?start ?end WHERE {
      ?item wdt:P31 wd:Q3024240;
      OPTIONAL {
        ?item wdt:P41 ?img;
          wdt:P580 ?start;
          wdt:P582 ?end.
      }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    ORDER BY ?start`;

    const url = wdk.sparqlQuery(this.query);

    fetch(url)
      .then((response) => response.json())
      .then(wdk.simplify.sparqlResults)
      .then((results) => {
        let resultsMap = {};
        results.forEach((result) => {
          if (!resultsMap[result.item.value]) {
            resultsMap[result.item.value] = result;
            resultsMap[result.item.value].images = [];
            if (result.img)
              resultsMap[result.item.value].images.push(result.img);
          } else resultsMap[result.item.value].images.push(result.img);
        });

        this.results = Object.values(resultsMap);

        this.drawData();
      });
  };

  drawData = () => {
    this.setState({
      loading: true,
    });

    let minYear = 0;
    let maxYear = 0;
    let withDate = [];
    let withoutDate = [];
    this.results.forEach((result) => {
      if (result.start && result.end) {
        let startDate = moment(result.start, "Y-MM-DD");
        minYear = Math.min(minYear, startDate.year());
        result.startYear = startDate.year();
        result.startDateFormatted = formatDate(startDate);

        let endDate = moment(result.end, "Y-MM-DD");
        maxYear = Math.max(maxYear, endDate.year());
        result.endYear = endDate.year();
        result.endDateFormatted = formatDate(endDate);
        withDate.push(result);
      } else withoutDate.push(result);
    });

    minYear -= 100;
    maxYear += 100;

    let yearRange = maxYear - minYear;

    let containerWidth = this.timelineRef.current.offsetWidth - 2; // -2 px of border

    let YEAR_SIZE = containerWidth / yearRange;

    withDate.forEach((result) => {
      if (result.startYear) {
        result.left = YEAR_SIZE * (result.startYear - minYear);
        result.width = YEAR_SIZE * (result.endYear - result.startYear);
        result.contentClass =
          result.startYear > yearRange / 2 ? "right" : "left";
      }
    });

    let decimationFactor = Math.floor(60 / YEAR_SIZE);
    let ticks = [];
    for (let index = minYear; index <= maxYear; index++) {
      ticks.push({
        left: YEAR_SIZE * (index - minYear),
        year: index <= 0 ? Math.abs(index) + 1 + " BCE" : index,
        showYear: !(index % decimationFactor),
      });
    }

    this.setState({
      loading: false,
      timelineWidth: YEAR_SIZE * (maxYear - minYear),
      ticks,
      withDate,
      withoutDate,
    });
  };

  render() {
    const { loading, withDate, ticks, timelineWidth, withoutDate } = this.state;

    return (
      <div className="HistoricalCountries">
        <Header />
        <div className="fullContainer">
          <h1>Timeline of historical countries</h1>
          {loading && <p>loading...</p>}
          <div ref={this.timelineRef} className="timelineWrapper">
            {!loading && (
              <div className="timeline">
                <div className="ticks" style={{ width: timelineWidth }}>
                  {ticks.map(
                    ({ left, year, showYear }) =>
                      showYear && (
                        <span key={year} className="tick" style={{ left }}>
                          {showYear && <span className="tickYear">{year}</span>}
                          <span className="tickLine"></span>
                        </span>
                      )
                  )}
                </div>
                <div className="scrollableY" style={{ width: timelineWidth }}>
                  {withDate.map(
                    ({
                      item,
                      images,
                      left,
                      width,
                      startDateFormatted,
                      contentClass,
                      endDateFormatted,
                    }) => (
                      <div className="row" key={item.value}>
                        <div
                          className="item"
                          key={item.value}
                          style={{ left, width }}
                        >
                          <div className="line"></div>
                          <div className={`content ${contentClass}`}>
                            {images.map((img, index) => (
                              <span key={index} className="imgWrapper">
                                <img src={img}></img>
                              </span>
                            ))}{" "}
                            <a
                              target="_blank"
                              href={`https://www.wikidata.org/wiki/${item.value}`}
                            >
                              {item.label}
                            </a>{" "}
                            - from {startDateFormatted} to {endDateFormatted}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
          {!loading && (
            <>
              <h2>The query</h2>
              <code className="mb-4">{this.query}</code>
              <h2>
                Entries without start date/end date{" "}
                {!!withoutDate.length && (
                  <Badge variant="secondary">{withoutDate.length}</Badge>
                )}
              </h2>
              {withoutDate.map(({ item, images }) => (
                <div key={item.value}>
                  {images.map((img, index) => (
                    <span key={index} className="imgWrapper">
                      <img src={img}></img>
                    </span>
                  ))}{" "}
                  <a
                    target="_blank"
                    href={`https://www.wikidata.org/wiki/${item.value}`}
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }
}

function formatDate(date) {
  let string = date.format("D MMM");
  let year = date.year();
  if (year <= 0) string += ` ${Math.abs(year) + 1} BCE`;
  else string += ` ${year}`;
  return string;
}

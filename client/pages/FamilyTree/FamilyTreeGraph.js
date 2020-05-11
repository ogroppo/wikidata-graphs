import React, { Component } from "react";
import ReactGA from "react-ga";
import { Link } from "react-router-dom";
import Header from "../../layout/Header/Header";
import { FaFemale, FaMale } from "react-icons/fa";
import Draggable from "react-draggable";

import { Form, Dropdown, Button, Spinner } from "react-bootstrap";
import { BsPersonSquare } from "react-icons/bs";
import wdk from "wikidata-sdk";
import _ from "underscore";
import "./FamilyTreeGraph.scss";

const CARD_WIDTH = 120;
const CARD_HEIGHT = 120;

const defaultState = {
  people: [],
  rels: [],
  svgCenterX: 0,
  svgCenterY: 0,
};

export default class FamilyTreeGraph extends Component {
  state = defaultState;
  maxDepth = 0;
  maxOffset = 0;
  peopleMap = {};

  componentDidMount() {
    this.draw();
  }

  draw = () => {
    this.setState({
      loading: true,
      ...defaultState,
    });
    this.addRoot(this.props.root);
    this.getParents(this.props.root);
    this.getChildren(this.props.root);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.root !== this.props.root) {
      this.draw();
    }
  }

  //done at the end of children... could be in a better place
  calcSvgStyle = () => {
    const svgHeight = CARD_HEIGHT * (this.maxDepth * 2 + 2);
    const svgWidth = CARD_WIDTH * (this.maxOffset * 2 + 2);

    this.setState({
      svgStyle: {
        width: svgWidth,
        left: -svgWidth / 2,
        height: svgHeight,
        top: -svgHeight / 2,
      },
      svgCenterX: svgWidth / 2,
      svgCenterY: svgHeight / 2,
      loading: false,
    });
  };

  addRoot = (root) => {
    root.left = 0;
    root.top = 0;
    root.depth = 0;
    root.offset = 0;
    this.peopleMap[root.value] = root;
    this.setState({
      people: [root],
    });
  };

  addParent = (parent, type) => {
    let {
      left: originLeft,
      top: originTop,
      offset: originOffset,
      depth: originDepth,
    } = this.peopleMap[parent.origin];
    parent.left =
      type === "mother" ? originLeft - CARD_WIDTH : originLeft + CARD_WIDTH;
    parent.top = originTop - CARD_HEIGHT;
    parent.depth = originDepth - 1;
    parent.offset = type === "mother" ? originOffset - 1 : originOffset + 1;
    this.peopleMap[parent.value] = parent;
    this.maxDepth = Math.max(this.maxDepth, Math.abs(parent.depth));
    this.maxOffset = Math.max(this.maxOffset, Math.abs(parent.offset));
    let rel = {
      id: parent.origin + parent.value,
      d: getPathD(parent.left, parent.top, originLeft, originTop),
    };
    this.setState(({ people, rels }) => ({
      people: people.concat(parent),
      rels: rels.concat(rel),
    }));
  };

  getChildren = (person) => {
    let query = `
    SELECT DISTINCT ?child ?childLabel ?childFamilyNameLabel ?childImg WHERE {
      OPTIONAL { wd:${person.value} wdt:P40 ?child . }
      OPTIONAL { wd:${person.value} wdt:P40 ?child . ?child wdt:P734 ?childFamilyName . }
      OPTIONAL { wd:${person.value} wdt:P40 ?child . ?child wdt:P18 ?childImg . }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    `;
    const url = wdk.sparqlQuery(query);
    fetch(url)
      .then((response) => response.json())
      .then(wdk.simplify.sparqlResults)
      .then((children) => {
        let childrenDublicates = {};
        children.forEach(({ child }, index, { length }) => {
          if (!childrenDublicates[child.value]) {
            childrenDublicates[child.value] = true;
            this.addChild({
              ...child,
              origin: person.value,
              offset: indexToOffset(index, length),
            });
          }
        });
        this.calcSvgStyle();
      })
      .catch((error) => {
        this.setState({
          error,
        });
      });
  };

  addChild = (child) => {
    let {
      left: originLeft,
      top: originTop,
      offset: originOffset,
      depth: originDepth,
    } = this.peopleMap[child.origin];
    child.left = originLeft + CARD_WIDTH * child.offset;
    child.top = originTop + CARD_HEIGHT;
    child.depth = originDepth + 1;
    this.maxDepth = Math.max(this.maxDepth, Math.abs(child.depth));
    this.maxOffset = Math.max(this.maxOffset, Math.abs(child.offset));
    this.peopleMap[child.value] = child;
    let rel = {
      id: child.origin + child.value,
      d: getPathD(child.left, child.top, originLeft, originTop),
    };
    this.setState(({ people, rels }) => ({
      people: people.concat(child),
      rels: rels.concat(rel),
    }));
  };

  getParents = (person) => {
    let query = `
    SELECT ?father ?fatherLabel ?fatherFamilyNameLabel ?fatherImg ?mother ?motherLabel ?motherFamilyNameLabel ?motherImg WHERE {
      OPTIONAL { wd:${person.value} wdt:P22 ?father }
      OPTIONAL { wd:${person.value} wdt:P22 [ wdt:P734 ?fatherFamilyName ] }
      OPTIONAL { wd:${person.value} wdt:P22 [ wdt:P18 ?fatherImg ] }
      OPTIONAL { wd:${person.value} wdt:P25 ?mother }
      OPTIONAL { wd:${person.value} wdt:P25 [ wdt:P734 ?motherFamilyName ] }
      OPTIONAL { wd:${person.value} wdt:P25 [ wdt:P18 ?motherImg ] }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    `;

    const url = wdk.sparqlQuery(query);

    fetch(url)
      .then((response) => response.json())
      .then(wdk.simplify.sparqlResults)
      .then((searchResults) => {
        if (searchResults[0]) {
          const { father, mother } = searchResults[0];
          if (father) {
            let fatherObj = {
              ...father,
              origin: person.value,
            };
            this.addParent(fatherObj, "father");
          }
          if (mother) {
            let motherObj = {
              ...mother,
              origin: person.value,
            };
            this.addParent(motherObj, "mother");
          }
          this.calcSvgStyle();
        }
      })
      .catch((error) => {
        this.setState({
          error,
        });
      });
  };

  render() {
    const {
      svgStyle,
      svgCenterX,
      svgCenterY,
      people,
      rels,
      loading,
    } = this.state;
    return (
      <div className="FamilyTreeGraph">
        <Draggable>
          <div className="dragArea">
            <div className="center">
              {loading ? (
                <Spinner animation="grow" variant="secondary" />
              ) : (
                <svg
                  style={svgStyle}
                  transform="scale(1)"
                  className="shapesSvg"
                >
                  <clipPath id="clipCircle">
                    <circle r="25" cx="25" cy="25" />
                  </clipPath>
                  <g
                    transform={`translate(${svgCenterX} ${svgCenterY})`}
                    className="svgCenter"
                  >
                    <g className="rels">
                      {rels.map(({ id, d }) => (
                        <path className="relPath" key={id} d={d} />
                      ))}
                    </g>
                    <g className="people">
                      {people.map((person) => (
                        <PersonSvg key={person.value} person={person} />
                      ))}
                    </g>
                  </g>
                </svg>
              )}
            </div>
          </div>
        </Draggable>
      </div>
    );
  }
}

class PersonSvg extends Component {
  openPage = (person) => {
    window.open(`https://www.wikidata.org/wiki/${person.value}`, "_blank");
  };

  render() {
    const { person } = this.props;
    return (
      <g
        onClick={() => this.openPage(person)}
        transform={`translate(${person.left} ${person.top})`}
      >
        <g transform={`translate(-25 -25)`}>
          <g
            className="mainPersonGroup"
            style={{ zIndex: person.siblings ? person.siblings.length : 0 }}
          >
            <g className="personIcon">
              <circle
                r="25"
                cx="25"
                cy="25"
                className="personIconCircle"
              ></circle>
              {person.img ? (
                <image
                  clipPath="url(#clipCircle)"
                  height="50px"
                  width="50px"
                  href={person.img}
                />
              ) : (
                <g>
                  <g transform={`translate(6 5)`}>
                    {person.gender === "male" ? <FaMale /> : <FaFemale />}
                  </g>
                </g>
              )}
            </g>
            <g transform={`translate(25 65)`} className="personName">
              <text dy="" className="firstName">
                {person.familyNameLabel
                  ? formatFirstName(
                      person.label.replace(person.familyNameLabel, ""),
                      20
                    )
                  : formatFirstName(person.label, 20)}
              </text>
              {person.familyNameLabel && (
                <text dy="14" className="familyName">
                  {person.familyNameLabel}
                </text>
              )}
            </g>
          </g>
        </g>
      </g>
    );
  }
}

function formatFirstName(firstNames, minLength) {
  return firstNames.length > minLength
    ? firstNames
        .split(" ")
        .map((name, index) => (!index ? name : name[0]))
        .join(" ")
    : firstNames;
}

function getPathD(startX, startY, endX, endY) {
  const xDiff = endX - startX;
  const yDiff = endY - startY;

  const c1Y = yDiff / 3 + startY;
  const c2Y = (yDiff / 3) * 2 + startY;

  const d = `M${startX},${startY} C${startX},${c1Y} ${endX},${c2Y} ${endX},${endY}`;
  return d;
}

const indexToOffset = (index, length) => {
  let floorIndex = Math.floor(length / 2);
  if (length % 2) return index - floorIndex;

  if (index < floorIndex) return index - floorIndex;
  else return index - floorIndex + 1;
};

import React, { Component } from "react";
import { FaFemale, FaMale } from "react-icons/fa";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Spinner, Alert } from "react-bootstrap";
import "./FamilyTreeGraph.scss";
import getSiblingsQuery from "./getSiblingsQuery";
import getSpousesQuery from "./getSpousesQuery";
import getChildrenQuery from "./getChildrenQuery";
import getFatherQuery from "./getFatherQuery";
import getMotherQuery from "./getMotherQuery";
import getPersonQuery from "./getPersonQuery";
import pluralize from "pluralize";

const CARD_WIDTH = 120;
const CARD_HEIGHT = 120;
const SIBLINGS_SPACING = 35;

const defaultState = {
  positionX: 0,
  positionY: 0,
  rootX: 0,
  rootY: 0,
  loading: true,
  people: [],
  rels: [],
};

export default class FamilyTreeGraph extends Component {
  state = defaultState;
  maxDepth = 0;
  maxOffset = 0;
  peopleMap = {};

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.root !== this.props.root) {
      this.draw();
    }
  }

  draw = () => {
    this.setState({
      loading: true,
    });

    const { root } = this.props;

    let rootPromise = getPersonQuery(root.id);
    let siblingsPromise = getSiblingsQuery(root.id);
    let spousePromise = getSpousesQuery(root.id);
    let fatherPromise = getFatherQuery(root.id);
    let motherPromise = getMotherQuery(root.id);
    let childrenPromise = getChildrenQuery(root.id);

    Promise.all([
      rootPromise,
      siblingsPromise,
      spousePromise,
      fatherPromise,
      motherPromise,
      childrenPromise,
    ])
      .then(([roots, siblings, spouses, fathers, mothers, children]) => {
        this.decorateRoot(roots[0], siblings, spouses);

        this.decorateChildren(children);
        this.decorateParent(fathers[0], "father");
        this.decorateParent(mothers[0], "mother");

        let people = roots.concat(fathers, mothers, children);
        let rels = this.extractRels(children).concat(
          this.extractRels(fathers),
          this.extractRels(mothers)
        );

        this.setState(({ positionX, rootX, positionY, rootY }) => ({
          people,
          rels,
          svgStyle: this.getSvgStyle(),
          loading: false,
          positionX: positionX + rootX,
          positionY: positionY + rootY,
        }));
      })
      .catch((error) => {
        console.error(error);

        this.setState({
          error,
          loading: false,
        });
      });
  };

  extractRels(items) {
    return items.map(({ rel }) => rel);
  }

  getSvgStyle = () => {
    let maxDepth = 0;
    let maxOffset = 0;

    Object.values(this.peopleMap).forEach((person) => {
      maxDepth = Math.max(maxDepth, Math.abs(person.depth));
      maxOffset = Math.max(maxOffset, Math.abs(person.offset));
      if (person.siblings) {
        maxOffset = Math.max(maxOffset, Math.abs(person.siblings.length));
      }
      if (person.spouses) {
        maxOffset = Math.max(maxOffset, Math.abs(person.spouses.length));
      }
    });

    const svgHeight = CARD_HEIGHT * (maxDepth * 2 + 2);
    const svgWidth = CARD_WIDTH * (maxOffset * 2 + 2);

    return {
      width: svgWidth,
      left: -svgWidth / 2,
      height: svgHeight,
      top: -svgHeight / 2,
      centerX: svgWidth / 2,
      centerY: svgHeight / 2,
    };
  };

  decorateRoot = (root, siblings, spouses) => {
    root.left = 0;
    root.top = 0;
    root.depth = 0;
    root.offset = 0;
    root.siblings = siblings;
    root.spouses = spouses;
    this.peopleMap[root.id] = root;
  };

  decorateChildren = (children) => {
    children.forEach((child, index, { length }) => {
      child.origin = this.props.root.id;

      child.offset = indexToOffset(index, length);
      let {
        left: originLeft,
        top: originTop,
        offset: originOffset,
        depth: originDepth,
      } = this.peopleMap[child.origin];
      child.left = originLeft + CARD_WIDTH * child.offset;
      child.top = originTop + CARD_HEIGHT;
      child.depth = originDepth + 1;
      this.peopleMap[child.id] = child;
      child.rel = {
        id: child.origin + child.id,
        d: getPathD(child.left, child.top, originLeft, originTop),
      };
    });
  };

  decorateParent = (parent, type) => {
    if (!parent) return;
    parent.origin = this.props.root.id;
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
    this.peopleMap[parent.id] = parent;
    parent.rel = {
      id: parent.origin + parent.id,
      d: getPathD(parent.left, parent.top, originLeft, originTop),
    };
  };

  updateRoot = (person) => {
    this.setState({
      rootX: person.left,
      rootY: person.top,
    });
    this.props.goToPerson(person);
  };

  render() {
    const {
      svgStyle,
      people,
      rels,
      loading,
      error,
      positionX,
      positionY,
    } = this.state;
    return (
      <div className="FamilyTreeGraph">
        {error && <Alert variant="danger">{error.message}</Alert>}
        <TransformWrapper
          zoomIn={{ step: 100 }}
          zoomOut={{ step: 100 }}
          positionX={positionX}
          positionY={positionY}
          options={{ limitToBounds: false, minScale: 0.2, maxScale: 2 }}
          onPanning={({ positionX, positionY }) => {
            this.setState({
              positionX,
              positionY,
            });
          }}
        >
          <TransformComponent>
            <div className="center">
              {loading && <Spinner animation="grow" variant="secondary" />}
              {svgStyle && (
                <svg
                  style={svgStyle}
                  transform="scale(1)"
                  className="shapesSvg"
                >
                  <clipPath id="clipCircle">
                    <circle r="25" cx="25" cy="25" />
                  </clipPath>
                  <g
                    transform={`translate(${svgStyle.centerX} ${svgStyle.centerY})`}
                    className="svgCenter"
                  >
                    <g className="rels">
                      {rels.map(({ id, d }) => (
                        <path className="relPath" key={id} d={d} />
                      ))}
                    </g>
                    <g className="people">
                      {people.map((person) => (
                        <PersonSvg
                          updateRoot={this.updateRoot}
                          key={person.id}
                          person={person}
                        />
                      ))}
                    </g>
                  </g>
                </svg>
              )}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    );
  }
}

class PersonSvg extends Component {
  openPage = (person) => {
    window.open(`https://www.wikidata.org/wiki/${person.id}`, "_blank");
  };

  render() {
    const { person } = this.props;
    return (
      <g
        className="personGroup"
        transform={`translate(${person.left} ${person.top})`}
      >
        <g>
          {person.siblings && person.siblings.length && (
            <g>
              {person.siblings.map((sibling, index, { length }) => (
                <g
                  className="siblingGroup"
                  onClick={() => this.props.updateRoot(sibling)}
                  transform={`translate(${
                    -(length - index) * SIBLINGS_SPACING
                  })`}
                  key={sibling.id}
                >
                  <PersonIcon person={sibling} />
                </g>
              ))}
              <g
                className="siblingsTextHelper"
                transform={`translate(-${
                  person.siblings.length * SIBLINGS_SPACING + SIBLINGS_SPACING
                } 4)`}
              >
                <text className="textHelper">
                  {person.siblings.length}{" "}
                  {pluralize("Sibling", person.siblings.length)}
                </text>
              </g>
            </g>
          )}
          {person.spouses && person.spouses.length && (
            <g>
              {person.spouses.map((spouse, index, { length }) => (
                <g
                  className="spouseGroup"
                  onClick={() => this.props.updateRoot(spouse)}
                  transform={`translate(${
                    (length - index) * SIBLINGS_SPACING
                  })`}
                  key={spouse.id}
                >
                  <PersonIcon person={spouse} />
                </g>
              ))}
              <g
                transform={`translate(${
                  person.spouses.length * SIBLINGS_SPACING + SIBLINGS_SPACING
                } 4)`}
              >
                <text className="textHelper">
                  {person.spouses.length}{" "}
                  {pluralize("Spouse", person.spouses.length)}
                </text>
              </g>
            </g>
          )}
          <g
            className="mainPersonGroup"
            onClick={() => this.props.updateRoot(person)}
            style={{ zIndex: person.siblings ? person.siblings.length : 0 }}
          >
            <PersonIcon person={person} />
            <g transform={`translate(0 42)`} className="personName">
              <text dy="" className="firstName">
                {formatFirstName(person)}
              </text>
              {person.familyNameLabel && (
                <text dy="14" className="familyName">
                  {person.familyNameLabel.join(" ")}
                </text>
              )}
            </g>
          </g>
        </g>
      </g>
    );
  }
}

const PersonIcon = ({ person }) => (
  <g className="personIcon">
    <circle r="25" cx="0" cy="0" className="personIconCircle"></circle>
    {person.image ? (
      <image
        clipPath="url(#clipCircle)"
        height="50"
        width="50"
        href={person.image}
        transform="translate(-25 -25)"
      />
    ) : (
      <g transform={`translate(-19 -19)`}>
        {person.genderLabel === "male" ? (
          <FaMale />
        ) : person.genderLabel === "female" ? (
          <FaFemale />
        ) : null}
      </g>
    )}
  </g>
);

function formatFirstName(person) {
  try {
    return person.givenNameLabel.length && person.familyNameLabel.length
      ? truncate(person.givenNameLabel.join(" "))
      : truncate(person.itemLabel);
  } catch (error) {
    console.log(person);
  }
}

function truncate(string, length = 18) {
  if (string.length > length) return string.substr(0, length).trim() + "...";
  return string;
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

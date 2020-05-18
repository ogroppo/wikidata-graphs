import React, { Component } from "react";
import ReactGA from "react-ga";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import {
  Map,
  Marker,
  Circle,
  CircleMarker,
  Popup,
  TileLayer,
} from "react-leaflet";
import { latLngBounds, icon } from "leaflet";
import { geolocated } from "react-geolocated";
import { Alert, Badge, Dropdown } from "react-bootstrap";
import getNearestBattleQuery from "./getNearestBattleQuery";

class NearestBattle extends Component {
  state = { radius: 50 };

  componentDidMount() {
    ReactGA.set({ page: this.props.location.pathname });
    ReactGA.pageview(this.props.location.pathname);
  }

  setRadius = (radius) => {
    this.setState({
      radius,
    });
  };

  render() {
    const { coords } = this.props;
    const { radius } = this.state;
    //const coords = { latitude: 45.8045, longitude: 9.0391 };
    return (
      <div className="NearestBattle">
        <Header />
        <div className="fullContainer">
          <div className="topStuff">
            <h1>Battles fought near me</h1>
            <Dropdown className="ml-auto">
              <Dropdown.Toggle
                variant="secondary"
                size="sm"
                id="dropdown-basic"
              >
                within {radius}Km
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => this.setRadius(10)} href="#">
                  10Km
                </Dropdown.Item>
                <Dropdown.Item onClick={() => this.setRadius(30)} href="#">
                  30Km
                </Dropdown.Item>
                <Dropdown.Item onClick={() => this.setRadius(50)} href="#">
                  50Km
                </Dropdown.Item>
                <Dropdown.Item onClick={() => this.setRadius(70)} href="#">
                  70Km
                </Dropdown.Item>
                <Dropdown.Item onClick={() => this.setRadius(90)} href="#">
                  90Km
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {!this.props.isGeolocationAvailable ? (
            <Alert variant="danger">
              Your browser does not support Geolocation
            </Alert>
          ) : !this.props.isGeolocationEnabled ? (
            <Alert variant="warning">
              Please enable Geolocation from your browser's settings to see the
              map.
            </Alert>
          ) : coords ? (
            <BattleMap radius={radius} coords={coords} />
          ) : (
            <Alert variant="info">Getting you location...</Alert>
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

class BattleMap extends Component {
  state = {
    loading: true,
    battles: [],
    bounds: null,
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { coords, radius } = this.props;

    getNearestBattleQuery(coords.latitude, coords.longitude, radius)
      .then(([directBattles, placeBattles]) => {
        let battles = mergeResults(directBattles, placeBattles).sort(
          (a, b) => a.distance - b.distance
        );

        let bounds = latLngBounds([
          [coords.latitude, coords.longitude],
          ...battles.map(({ location }) => location),
        ]);

        this.setState({
          battles,
          loading: false,
          bounds,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error, loading: false });
      });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.radius !== this.props.radius) this.getData();
  }

  render() {
    const { coords, radius } = this.props;
    const { battles, bounds, loading, error } = this.state;

    if (loading) return <Alert variant="info">Searching for Battles...</Alert>;

    return (
      <>
        {error && <Alert variant="danger">{error.message}</Alert>}
        <Map
          style={{ height: "50vh" }}
          center={[coords.latitude, coords.longitude]}
          zoom={13}
          bounds={bounds}
          className="mb-4"
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />{" "}
          <Circle
            radius={radius * 1000}
            className="radiusSearch"
            center={[coords.latitude, coords.longitude]}
          ></Circle>
          <CircleMarker
            className="myMarker"
            radius={5}
            center={[coords.latitude, coords.longitude]}
          ></CircleMarker>
          {battles.map((battle) => (
            <Marker key={battle.id} position={battle.location}>
              <Popup className="battlePopup">
                <b>
                  <a href={`https://www.wikidata.org/wiki/${battle.id}`}>
                    {battle.battleLabel}{" "}
                  </a>
                  {battle.pointInTime && (
                    <span>
                      (
                      {formatWithPrecision(
                        battle.pointInTime,
                        battle.pointInTimePrecision
                      )}
                      )
                    </span>
                  )}
                </b>
                <div>{battle.battleDescription}</div>
                {!!battle.images.length && (
                  <div className="imgContainer">
                    {battle.images.map((image) => (
                      <img
                        key={image}
                        className="battleImage"
                        src={image}
                      ></img>
                    ))}
                  </div>
                )}
              </Popup>
            </Marker>
          ))}
        </Map>
        {battles.length ? (
          <>
            <h2 className="">
              List of Battles&nbsp;
              <Badge variant="secondary" pill>
                {battles.length}
              </Badge>
            </h2>

            {battles.map((battle) => (
              <p key={battle.id}>
                <i>{battle.distance}Km</i>{" "}
                <a href={`https://www.wikidata.org/wiki/${battle.id}`}>
                  {battle.battleLabel}
                </a>
                {battle.pointInTime && (
                  <span> ({battle.pointInTime.format("D MMMM Y")})</span>
                )}{" "}
                {battle.battleDescription}
              </p>
            ))}
          </>
        ) : (
          <Alert variant="info">No battles near you! 😅 Pfeeew...</Alert>
        )}
      </>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(NearestBattle);

function formatWithPrecision(date, precision) {
  switch (precision) {
    case 11: //day
      return date.utc().format("D MMM Y");
    case 10: //month
      return date.utc().format("MMM Y");
    case 9: //year
      return date.utc().format("Y");
    default:
      return date.format();
  }
}

function mergeResults(...arrays) {
  let map = {};
  arrays[0].forEach((element) => {
    map[element.id] = element;
  });

  arrays.slice(1).forEach((array) => {
    array.forEach((element) => {
      if (!map[element.id]) map[element.id] = element;
    });
  });
  return Object.values(map);
}
